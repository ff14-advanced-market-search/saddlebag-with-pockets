const { execFileSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const rootDirectory = path.resolve(__dirname, '..')
const clientBuildDirectory = path.join(rootDirectory, 'public', 'build')
const serverBuildDirectory = path.join(rootDirectory, 'functions')

const getFiles = (directory) => {
  if (!fs.existsSync(directory)) return []

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)
    return entry.isDirectory() ? getFiles(entryPath) : [entryPath]
  })
}

const removeSourceMaps = () => {
  const buildFiles = [clientBuildDirectory, serverBuildDirectory].flatMap(
    getFiles
  )
  const mapFiles = buildFiles.filter((file) => file.endsWith('.map'))

  for (const mapFile of mapFiles) {
    fs.rmSync(mapFile)
  }

  for (const compiledFile of buildFiles.filter((file) =>
    /\.(?:css|js)$/u.test(file)
  )) {
    const contents = fs.readFileSync(compiledFile, 'utf8')
    const withoutSourceMapReference = contents
      .replace(/\n\/\/# sourceMappingURL=[^\r\n]*(?:\r?\n)?$/u, '')
      .replace(/\n\/\*# sourceMappingURL=.*?\*\/(?:\r?\n)?$/u, '')

    if (contents !== withoutSourceMapReference) {
      fs.writeFileSync(compiledFile, withoutSourceMapReference)
    }
  }

  console.log(`Removed ${mapFiles.length} source maps from deployment output.`)
}

const getReleaseVersion = () => {
  const manifestFiles = fs
    .readdirSync(clientBuildDirectory)
    .filter((file) => /^manifest-.*\.js$/u.test(file))

  if (manifestFiles.length !== 1) {
    throw new Error(
      `Expected one Remix manifest, found ${manifestFiles.length}.`
    )
  }

  const manifest = fs.readFileSync(
    path.join(clientBuildDirectory, manifestFiles[0]),
    'utf8'
  )
  const version = manifest.match(/"version":"([^"]+)"/u)?.[1]

  if (!version) {
    throw new Error(
      'Could not read the release version from the Remix manifest.'
    )
  }

  return version
}

try {
  const releaseVersion = getReleaseVersion()

  if (!process.env.DATADOG_API_KEY) {
    console.log('DATADOG_API_KEY is not set; skipping source map upload.')
  } else {
    const datadogCli = path.join(
      rootDirectory,
      'node_modules',
      '.bin',
      'datadog-ci'
    )

    execFileSync(
      datadogCli,
      [
        'sourcemaps',
        'upload',
        clientBuildDirectory,
        '--service=saddlebag-exchange',
        `--release-version=${releaseVersion}`,
        '--minified-path-prefix=https://saddlebagexchange.com/build'
      ],
      {
        env: {
          ...process.env,
          DATADOG_SITE: process.env.DATADOG_SITE || 'us5.datadoghq.com'
        },
        stdio: 'inherit'
      }
    )
  }
} finally {
  removeSourceMaps()
}
