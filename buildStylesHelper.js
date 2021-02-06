const fs = require('fs')
const path = require('path')

const filePath = path.resolve('./typer.css')
const css = fs.readFileSync(filePath, 'utf8').split('\n')[0]
const fileContent = `/*
  This file is meant to be imported into environments that only allow JavaScript
  modules to be imported but not assets like CSS. Typer needs the CSS to work.
  You almost certainly don't need to use this file.
*/

function applyStylesToDom() {
  const css = '${css}'
  const id = '__typer-js-style-tag'

  // See if the document already has the styles we need.
  const headLinks = [...document.head.querySelectorAll('link')]
  const dontAppend = !!headLinks.find(link => link.getAttribute('href').endsWith('typer.css'))
  if (dontAppend || document.getElementById(id) != null) return


  const style = document.createElement('style')
  style.setAttribute('id', id)
  style.textContent = css
  document.head.appendChild(style)
}

module.exports = applyStylesToDom
`

fs.writeFileSync('./applyStylesToDom.js', fileContent, 'utf8')
