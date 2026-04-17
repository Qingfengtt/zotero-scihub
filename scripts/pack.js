const path = require('path')
const fs = require('fs')
const archiver = require('archiver')

const buildDir = path.join(__dirname, '..', 'build')
const outputPath = path.join(__dirname, '..', 'zotero-scihub.xpi')

// Remove existing .xpi if present
if (fs.existsSync(outputPath)) {
  fs.unlinkSync(outputPath)
}

const output = fs.createWriteStream(outputPath)
const archive = archiver('zip', { zlib: { level: 9 } })

output.on('close', () => {
  console.log(`Created zotero-scihub.xpi (${archive.pointer()} bytes)`)
})

archive.on('error', (err) => {
  throw err
})

archive.pipe(output)
archive.glob('**/*', {
  cwd: buildDir,
  ignore: ['**/.DS_Store'],
})
archive.finalize()
