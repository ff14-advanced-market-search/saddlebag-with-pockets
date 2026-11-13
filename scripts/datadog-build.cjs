const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const PROJECT_ROOT = path.resolve(__dirname, '..')
const SERVICE = 'saddlebag-exchange'
const DATADOG_SITE = 'us5.datadoghq.com'
const COMMIT_SHA = /^[a-f0-9]{40}$/i

/** @param {Record<string, string | undefined>} environment */
function getBuildMetadata(environment = process.env) {
  const isPages = environment.CF_PAGES === '1'
  const commit = environment.CF_PAGES_COMMIT_SHA || ''
  const deployedEnvironment =
    environment.CF_PAGES_BRANCH === 'master' ? 'production' : 'preview'

  // Only these public values may be bundled. Never serialize the environment.
  return {
    service: SERVICE,
    version:
      isPages && COMMIT_SHA.test(commit)
        ? commit.toLowerCase()
        : 'local-development',
    env: isPages ? deployedEnvironment : 'development'
  }
}

/**
 * Run before Remix or Vitest resolves the provider's generated JSON import.
 * @param {string} rootDirectory
 * @param {Record<string, string | undefined>} environment
 */
function writeBuildMetadata(
  rootDirectory = PROJECT_ROOT,
  environment = process.env
) {
  const metadata = getBuildMetadata(environment)
  const filename = path.join(rootDirectory, 'app/.generated/datadog-build.json')
  const contents = `${JSON.stringify(metadata, null, 2)}\n`

  if (
    !fs.existsSync(filename) ||
    fs.readFileSync(filename, 'utf8') !== contents
  ) {
    fs.mkdirSync(path.dirname(filename), { recursive: true })
    fs.writeFileSync(filename, contents)
  }

  return metadata
}

/** @param {string} directory @returns {string[]} */
function getOutputFiles(directory) {
  if (!fs.existsSync(directory)) return []

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name)
    if (entry.isDirectory()) return getOutputFiles(filename)
    return entry.isFile() ? [filename] : []
  })
}

/**
 * Remove only the final standalone source-map comment. Executable code and its
 * mapped line/column positions stay unchanged; upload the exact deployed bytes.
 * @param {string} contents
 */
function stripSourceMapReference(contents) {
  return contents.replace(
    /(^|\r?\n)(?:\/\/[#@]\s*sourceMappingURL=[^\r\n]*|\/\*[#@]\s*sourceMappingURL=[^*]*\*\/)[ \t]*(?:\r?\n)?$/,
    '$1'
  )
}

/** @param {string} rootDirectory @param {boolean} removeMaps */
function cleanBuildOutputs(rootDirectory, removeMaps = true) {
  for (const directory of ['public/build', 'functions']) {
    for (const filename of getOutputFiles(
      path.join(rootDirectory, directory)
    )) {
      if (filename.endsWith('.map')) {
        if (removeMaps) fs.unlinkSync(filename)
      } else if (/\.(?:[cm]?js|css)$/.test(filename)) {
        const contents = fs.readFileSync(filename, 'utf8')
        const cleaned = stripSourceMapReference(contents)
        if (cleaned !== contents) fs.writeFileSync(filename, cleaned)
      }
    }
  }
}

/**
 * @param {string[]} arguments_
 * @param {{ cwd: string, env: Record<string, string | undefined> }} options
 */
function runNodeCommand(arguments_, options) {
  const result = spawnSync(process.execPath, arguments_, {
    ...options,
    stdio: 'inherit'
  })
  if (result.error) throw result.error
  return result.status ?? 1
}

/**
 * Build-time uploads add no browser instrumentation. Missing credentials and
 * upload outages never prevent the app from building; generated maps are never
 * deployed, including when either subprocess fails.
 * @param {{ rootDirectory?: string, environment?: Record<string, string | undefined>,
 * runCommand?: typeof runNodeCommand,
 * logger?: Pick<Console, 'info' | 'warn'> }} options
 */
function runBuild({
  rootDirectory = PROJECT_ROOT,
  environment = process.env,
  runCommand = runNodeCommand,
  logger = console
} = {}) {
  const metadata = writeBuildMetadata(rootDirectory, environment)
  const hasApiKey = Boolean(
    (environment.DATADOG_API_KEY || environment.DD_API_KEY || '').trim()
  )
  const uploadEnabled = hasApiKey && metadata.version !== 'local-development'
  const commandOptions = { cwd: rootDirectory, env: environment }
  const remixArguments = [
    require.resolve('@remix-run/dev/dist/cli.js'),
    'build'
  ]

  if (uploadEnabled) remixArguments.push('--sourcemap')
  else {
    logger.info(
      hasApiKey
        ? 'Datadog source maps skipped: upload requires a Cloudflare Pages commit SHA.'
        : 'Datadog source maps skipped: set DATADOG_API_KEY in the build environment to enable uploads.'
    )
  }

  try {
    const buildStatus = runCommand(remixArguments, commandOptions)
    if (buildStatus !== 0) return buildStatus
    if (!uploadEnabled) return 0

    // Strip comments before upload so the uploaded JS matches the deployment.
    cleanBuildOutputs(rootDirectory, false)
    let uploadStatus
    try {
      const uploadEnvironment = {
        ...environment,
        DD_SITE: DATADOG_SITE,
        DATADOG_SITE
      }
      // This CLI override takes precedence over DD_SITE and receives the API key.
      // Use the US5 intake derived from the pinned site, retaining proxy settings.
      delete uploadEnvironment.DATADOG_SOURCEMAP_INTAKE_URL
      uploadStatus = runCommand(
        [
          require.resolve('@datadog/datadog-ci'),
          'sourcemaps',
          'upload',
          path.join(rootDirectory, 'public/build'),
          '--service',
          metadata.service,
          '--release-version',
          metadata.version,
          '--minified-path-prefix',
          '/build/'
        ],
        {
          ...commandOptions,
          env: uploadEnvironment
        }
      )
    } catch {
      // Optional monitoring must not prevent deployment when its CLI fails.
      uploadStatus = 1
    }

    if (uploadStatus !== 0) {
      logger.warn(
        'Datadog source-map upload failed. Continuing the app build without readable stack traces for this release.'
      )
    }
    return 0
  } finally {
    cleanBuildOutputs(rootDirectory)
  }
}

module.exports = {
  getBuildMetadata,
  writeBuildMetadata,
  stripSourceMapReference,
  cleanBuildOutputs,
  runNodeCommand,
  runBuild
}

if (require.main === module) {
  try {
    process.exitCode = runBuild()
  } catch (error) {
    console.error(
      'Build failed:',
      error instanceof Error ? error.message : 'Unknown error'
    )
    process.exitCode = 1
  }
}
