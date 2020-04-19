const t = typer
window.go = () => {
  window.x = t('section')
    .line(['JavaScript.', ' React.', ' SCSS.', ' Webpack.'], 500)
    .line('React!')
}

document.querySelector('button').addEventListener('click', go)
