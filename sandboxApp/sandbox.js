Array.from(document.querySelectorAll('section')).forEach(section => {
  Array.from(section.querySelectorAll('div')).forEach((div, i) => {
    typer(div, 5)
      .cursor({block: i === 0})
      .line('JavaScript')
  })
})
