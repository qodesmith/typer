const t = typer
window.go = () => {
  window.x = t('section')
    .line('JavaScript. React. SCSS. Webpack.')
    .continue(' React!')
    .continue(` I've made my career on these things.`)
}

document.querySelector('button').addEventListener('click', go)
