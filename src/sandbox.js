const t = typer
const text = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi obcaecati voluptate earum delectus repudiandae? Doloribus adipisci ad sequi, a odio similique, nesciunt ipsam mollitia iure aut magni eius harum possimus, perferendis accusantium ea? Recusandae accusantium quas dolor aut voluptate sunt molestias? Libero laudantium aperiam magnam minima, fuga id sint accusamus.'
let goCalled = false

window.go = () => {
  window.x = t('section', 10)
    .line(text.slice(0, 20))
}

window.go2 = () => {
  x.line('This is a 2nd set of instructions for typer.', 70)
}

document.querySelector('.go').addEventListener('click', () => {
  if (goCalled) return go2()

  goCalled = true
  go()
})

document.querySelector('.halt').addEventListener('click', () => x.halt())
document.querySelector('.resume').addEventListener('click', () => x.resume())
