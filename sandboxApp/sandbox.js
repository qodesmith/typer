// These styles are declared in `index.html` inside the styles in the header.
const fontFaces = ['monospace', 'sans-serif', 'serif', 'cursive', 'fantasy']

Array.from(document.querySelectorAll('section')).forEach((section, i) => {
  const fontFace = fontFaces[i]

  Array.from(section.querySelectorAll('div')).forEach((div, j) => {
    typer(div, 5)
      .cursor({block: j === 0})
      .line(`JavaScript - ${fontFace}`)
      .continue('<span style="background: pink"> this is a span</span>')
  })
})
