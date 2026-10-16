import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  getBuildMetadata,
  runBuild,
  stripSourceMapReference,
  writeBuildMetadata
} from './datadog-build.cjs'
import type { runNodeCommand } from './datadog-build.cjs'

const COMMIT = 'a'.repeat(40)
const PUBLIC_ENVIRONMENT = {
  CF_PAGES: '1',
  CF_PAGES_BRANCH: 'master',
  CF_PAGES_COMMIT_SHA: COMMIT
}
const temporaryDirectories: string[] = []

const createProject = () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'datadog-build-'))
  temporaryDirectories.push(directory)
  return directory
}

const writeBuildOutputs = (directory: string) => {
  const browser = path.join(directory, 'public/build/_shared/chart.js')
  const server = path.join(directory, 'functions/[[path]].js')
  for (const filename of [browser, server]) {
    fs.mkdirSync(path.dirname(filename), { recursive: true })
    fs.writeFileSync(
      filename,
      'console.log("fixture");\n//# sourceMappingURL=fixture.js.map\n'
    )
    fs.writeFileSync(`${filename}.map`, '{"version":3}')
  }
  return { browser, server }
}

const createLogger = () => ({ info: vi.fn(), warn: vi.fn() })

afterEach(() => {
  vi.restoreAllMocks()
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true })
  }
})

describe('public Datadog build metadata', () => {
  it('uses the deployed commit and separates previews from production', () => {
    expect(getBuildMetadata(PUBLIC_ENVIRONMENT)).toEqual({
      service: 'saddlebag-exchange',
      version: COMMIT,
      env: 'production'
    })
    expect(
      getBuildMetadata({
        ...PUBLIC_ENVIRONMENT,
        CF_PAGES_BRANCH: 'codex/debugging'
      })
    ).toEqual({
      service: 'saddlebag-exchange',
      version: COMMIT,
      env: 'preview'
    })
  })

  it('labels local builds without claiming the deployed commit', () => {
    expect(
      getBuildMetadata({ CF_PAGES_COMMIT_SHA: COMMIT, NODE_ENV: 'production' })
    ).toEqual({
      service: 'saddlebag-exchange',
      version: 'local-development',
      env: 'development'
    })
    expect(
      getBuildMetadata({
        ...PUBLIC_ENVIRONMENT,
        CF_PAGES_COMMIT_SHA: 'invalid'
      }).version
    ).toBe('local-development')
  })

  it('writes only allowlisted public values and preserves unchanged files', () => {
    const rootDirectory = createProject()
    const environment = {
      ...PUBLIC_ENVIRONMENT,
      DATADOG_API_KEY: 'private-upload-key',
      UNRELATED_SECRET: 'another-private-value'
    }
    writeBuildMetadata(rootDirectory, environment)
    const filename = path.join(
      rootDirectory,
      'app/.generated/datadog-build.json'
    )
    const contents = fs.readFileSync(filename, 'utf8')
    expect(JSON.parse(contents)).toEqual(getBuildMetadata(PUBLIC_ENVIRONMENT))
    expect(contents).not.toContain('private')
    const modifiedAt = fs.statSync(filename).mtimeMs
    writeBuildMetadata(rootDirectory, environment)
    expect(fs.statSync(filename).mtimeMs).toBe(modifiedAt)
  })
})

describe('Datadog build integration', () => {
  it('uploads the final deployed JavaScript with matching release metadata', () => {
    const rootDirectory = createProject()
    const runCommand = vi.fn<typeof runNodeCommand>()
    let outputs: ReturnType<typeof writeBuildOutputs>
    runCommand.mockImplementationOnce((arguments_) => {
      expect(arguments_).toContain('--sourcemap')
      outputs = writeBuildOutputs(rootDirectory)
      return 0
    })
    runCommand.mockImplementationOnce((arguments_, options) => {
      expect(arguments_.slice(1)).toEqual([
        'sourcemaps',
        'upload',
        path.join(rootDirectory, 'public/build'),
        '--service',
        'saddlebag-exchange',
        '--release-version',
        COMMIT,
        '--minified-path-prefix',
        '/build/'
      ])
      expect(options.env.DD_SITE).toBe('us5.datadoghq.com')
      expect(fs.readFileSync(outputs.browser, 'utf8')).toBe(
        'console.log("fixture");\n'
      )
      expect(fs.existsSync(`${outputs.browser}.map`)).toBe(true)
      return 0
    })

    expect(
      runBuild({
        rootDirectory,
        environment: { ...PUBLIC_ENVIRONMENT, DATADOG_API_KEY: 'private-key' },
        runCommand,
        logger: createLogger()
      })
    ).toBe(0)
    expect(runCommand).toHaveBeenCalledTimes(2)
    for (const filename of [outputs!.browser, outputs!.server]) {
      expect(fs.existsSync(`${filename}.map`)).toBe(false)
      expect(fs.readFileSync(filename, 'utf8')).toBe(
        'console.log("fixture");\n'
      )
    }
  })

  it.each([
    { environment: PUBLIC_ENVIRONMENT, reason: 'DATADOG_API_KEY' },
    { environment: { DATADOG_API_KEY: 'private-key' }, reason: 'commit SHA' }
  ])(
    'builds without maps when upload setup is incomplete',
    ({ environment, reason }) => {
      const rootDirectory = createProject()
      const logger = createLogger()
      const runCommand = vi.fn<typeof runNodeCommand>().mockReturnValue(0)
      expect(runBuild({ rootDirectory, environment, logger, runCommand })).toBe(
        0
      )
      expect(runCommand).toHaveBeenCalledTimes(1)
      expect(runCommand.mock.calls[0][0]).not.toContain('--sourcemap')
      expect(logger.info.mock.calls[0][0]).toContain(reason)
    }
  )

  it('preserves compiler failure and cleans partially written maps', () => {
    const rootDirectory = createProject()
    const outputs = writeBuildOutputs(rootDirectory)
    const runCommand = vi.fn<typeof runNodeCommand>().mockReturnValue(7)
    expect(
      runBuild({
        rootDirectory,
        environment: { ...PUBLIC_ENVIRONMENT, DATADOG_API_KEY: 'private-key' },
        runCommand,
        logger: createLogger()
      })
    ).toBe(7)
    expect(runCommand).toHaveBeenCalledTimes(1)
    expect(fs.existsSync(`${outputs.browser}.map`)).toBe(false)
    expect(fs.existsSync(`${outputs.server}.map`)).toBe(false)
  })

  it('continues the app build after upload failure without publishing maps', () => {
    const rootDirectory = createProject()
    const outputs = writeBuildOutputs(rootDirectory)
    const logger = createLogger()
    const runCommand = vi
      .fn<typeof runNodeCommand>()
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(1)
    expect(
      runBuild({
        rootDirectory,
        environment: { ...PUBLIC_ENVIRONMENT, DD_API_KEY: 'private-key' },
        runCommand,
        logger
      })
    ).toBe(0)
    expect(logger.warn).toHaveBeenCalledOnce()
    expect(fs.existsSync(`${outputs.browser}.map`)).toBe(false)
    expect(fs.existsSync(`${outputs.server}.map`)).toBe(false)
  })

  it('cleans maps when the compiler subprocess cannot start', () => {
    const rootDirectory = createProject()
    const outputs = writeBuildOutputs(rootDirectory)
    const runCommand = vi.fn<typeof runNodeCommand>().mockImplementation(() => {
      throw new Error('compiler unavailable')
    })
    expect(() =>
      runBuild({
        rootDirectory,
        environment: {},
        runCommand,
        logger: createLogger()
      })
    ).toThrow('compiler unavailable')
    expect(fs.existsSync(`${outputs.browser}.map`)).toBe(false)
    expect(fs.existsSync(`${outputs.server}.map`)).toBe(false)
  })

  it('continues after an upload subprocess exception and cleans maps', () => {
    const rootDirectory = createProject()
    const outputs = writeBuildOutputs(rootDirectory)
    const logger = createLogger()
    const runCommand = vi
      .fn<typeof runNodeCommand>()
      .mockReturnValueOnce(0)
      .mockImplementationOnce(() => {
        throw new Error('uploader unavailable')
      })
    expect(
      runBuild({
        rootDirectory,
        environment: { ...PUBLIC_ENVIRONMENT, DATADOG_API_KEY: 'private-key' },
        runCommand,
        logger
      })
    ).toBe(0)
    expect(logger.warn).toHaveBeenCalledOnce()
    expect(fs.existsSync(`${outputs.browser}.map`)).toBe(false)
    expect(fs.existsSync(`${outputs.server}.map`)).toBe(false)
  })

  it('fails the build when a generated source map cannot be removed', () => {
    const rootDirectory = createProject()
    writeBuildOutputs(rootDirectory)
    vi.spyOn(fs, 'unlinkSync').mockImplementationOnce(() => {
      throw new Error('cleanup unavailable')
    })
    const runCommand = vi.fn<typeof runNodeCommand>().mockReturnValue(0)
    expect(() =>
      runBuild({
        rootDirectory,
        environment: {},
        runCommand,
        logger: createLogger()
      })
    ).toThrow('cleanup unavailable')
  })
})

describe('source-map references', () => {
  it('removes the final standalone comment without changing executable positions', () => {
    expect(
      stripSourceMapReference(
        'first();\nsecond();\n//# sourceMappingURL=app.js.map\n'
      )
    ).toBe('first();\nsecond();\n')
    expect(
      stripSourceMapReference(
        '.chart {}\n/*# sourceMappingURL=app.css.map */\n'
      )
    ).toBe('.chart {}\n')
  })

  it('preserves strings and comments followed by executable code', () => {
    const literal = 'const message = "//# sourceMappingURL=example.js.map";'
    expect(stripSourceMapReference(literal)).toBe(literal)
    const earlierComment = '//# sourceMappingURL=example.js.map\nstart();\n'
    expect(stripSourceMapReference(earlierComment)).toBe(earlierComment)
  })
})
