/*
  This function is meant to be used in environments that only allow JavaScript
  modules to be imported but not assets like CSS. Typer needs the CSS to work.

  You almost certainly don't need to use this function.
*/

function applyStylesToDom() {
  const css =
    '.typer:after{content:"";display:inline-block;vertical-align:middle;width:.1em;height:1em;background-color:currentColor;margin-left:.1em}.cursor-block:after{width:.5em}.cursor-soft:after{-webkit-animation:softblink .7s infinite;animation:softblink .7s infinite}.cursor-hard:after{-webkit-animation:hardblink .7s infinite;animation:hardblink .7s infinite}.no-cursor:after{content:none}.white-space{white-space:pre-wrap}@-webkit-keyframes softblink{0%{opacity:1}50%{opacity:0}to{opacity:1}}@keyframes softblink{0%{opacity:1}50%{opacity:0}to{opacity:1}}@-webkit-keyframes hardblink{50%,to{visibility:hidden}}@keyframes hardblink{50%,to{visibility:hidden}}'
  const id = '__typer-js-style-tag'

  // See if the document already has the styles we need.
  const headLinks = [...document.head.querySelectorAll('link')]
  const dontAppend = !!headLinks.find(link =>
    link.getAttribute('href').endsWith('typer.css'),
  )
  if (dontAppend || document.getElementById(id) != null) return

  const style = document.createElement('style')
  style.setAttribute('id', id)
  style.textContent = css
  document.head.appendChild(style)
}

module.exports = applyStylesToDom
