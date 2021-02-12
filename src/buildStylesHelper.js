const fs = require('fs-extra')
const path = require('path')

const destination = path.resolve(__dirname, '../applyStylesToDom/index.js')
const cssMinFilePath = path.resolve(__dirname, '../dist/typer.min.css')
const css = fs.readFileSync(cssMinFilePath, 'utf8').split('\n')[0]
const fileContent = `/*
  This function is meant to be used in environments that only allow JavaScript
  modules to be imported but not assets like CSS. Typer needs the CSS to work.

  You almost certainly don't need to use this function.
*/

function applyStylesToDom() {
  const css =
    \`${css}\`
  const id = '__typer-js-style-tag'

  // See if the document already has the styles we need.
  const headLinks = [...document.head.querySelectorAll('link')]
  const dontAppend = headLinks.some(link => {
    const href = link.getAttribute('href') || ''
    return href.endsWith('typer.css') || href.endsWith('typer.min.css')
  })

  if (dontAppend || document.getElementById(id) != null) return

  const style = document.createElement('style')
  style.setAttribute('id', id)
  style.textContent = css
  document.head.appendChild(style)
}

module.exports = applyStylesToDom
`

fs.ensureFileSync(destination)
fs.writeFileSync(destination, fileContent, 'utf8')
console.log('Created applyStylesToDom/index.js')
