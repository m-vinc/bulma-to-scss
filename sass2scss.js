const fs = require('fs-extra')
const path = require('path')
const { spawn } = require('child_process')
const { promisify } = require('util')

fs.readdir = promisify(fs.readdir)
fs.lstat = promisify(fs.lstat)

const bulma = '../bulma'
const bulmaExtensions = '../bulma-extensions'

const isSassFile = file => path.extname(file) === '.sass'
const isDirectory = path => fs.lstatSync(path).isDirectory()

const resolveSassFileFromFiles = ([file, ...files], sassFiles = [], directory = [], basePath) => {
  if (file) {
    const resolvedPath = path.resolve(basePath, file)
    if (resolvedPath && isSassFile(resolvedPath)) {
      return resolveSassFileFromFiles(files, sassFiles.concat(resolvedPath), directory, basePath)
    } else if (resolvedPath && isDirectory(resolvedPath)) {
      return resolveSassFileFromFiles(files, sassFiles, directory.concat(resolvedPath), basePath)
    } else return resolveSassFileFromFiles(files, sassFiles, directory, basePath)
  } else {
    return {sassFiles, directory}
  }
}

const resolveSassFileFromFolder = ([folder, ...folders], sassFiles = []) => {
  if (folder) {
    const files = fs.readdirSync(folder)
    const resolvedFiles = resolveSassFileFromFiles(files, [], [], folder)
    return resolveSassFileFromFolder(
      folders.concat(resolvedFiles.directory),
      sassFiles.concat(resolvedFiles.sassFiles)
    )
  } else return sassFiles
}
console.log('Converting Bulma to SCSS')
const bulmaSassFiles = resolveSassFileFromFolder([bulma])
bulmaSassFiles.forEach(sass => {
  const scssPath = sass.replace(/sass/g, 'scss')
  const relativeScss = path.relative(bulma, scssPath)
  const err = fs.ensureDirSync(path.dirname(relativeScss))
  const scss = spawn('sass-convert', ['-F', 'sass', '-T', 'scss', sass])
  let chunks = ''
  scss.stdout.on('data', data => {
    chunks += data
  })
  scss.on('close', code => {
    if (code === 0) {
      chunks = chunks.replace(/\.sass"/g, '.scss"').replace(/sass\//g, 'scss/')
      fs.writeFile(relativeScss, chunks, {encoding: 'utf8'}, err => {
        if (err) console.log(`unable to convert sass file ${sass}`)
      })
    } else console.log(`unable to convert sass file ${sass}`)
  })
})

const bulmaExtensionsFiles = resolveSassFileFromFolder([bulmaExtensions])

console.log('Converting Bulma-Extensions to SCSS')
bulmaExtensionsFiles.forEach(sass => {
  const relativeScss = `./scss/extensions/${path.relative(
    path.resolve(bulmaExtensions), sass.replace(/sass/g, 'scss'))}`
  fs.ensureDirSync(path.dirname(relativeScss))
  const scss = spawn('sass-convert', ['-F', 'sass', '-T', 'scss', sass])
  let chunks = ''
  scss.stdout.on('data', data => {
    chunks += data
  })
  scss.on('close', code => {
    if (code === 0) {
      chunks = chunks.replace(/\.sass"/g, '.scss"').replace(/sass\//g, 'scss/')
      fs.writeFile(relativeScss, chunks, {encoding: 'utf8'}, err => {
        if (err) console.log(`unable to write sass file ${sass}`)
      })
    } else console.log(`unable to convert sass file ${sass}`)
  })
})
