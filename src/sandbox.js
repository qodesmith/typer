const t = typer
const text = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi obcaecati voluptate earum delectus repudiandae? Doloribus adipisci ad sequi, a odio similique, nesciunt ipsam mollitia iure aut magni eius harum possimus, perferendis accusantium ea? Recusandae accusantium quas dolor aut voluptate sunt molestias? Libero laudantium aperiam magnam minima, fuga id sint accusamus.'
let goCalled = false
const sections = document.querySelectorAll('section')

window.go = () => {
  window.x = t(sections[0], 10)
    .line(text.slice(0, 20))
    .line('Pause after this line')
    .pause()
    .line('Next, listen for an event before proceeding.')
    .listen('test')
    .line(`Successfully listened to event!`)

  window.y = t(sections[1], 5)
    .cursor({ block: true, blink: 'hard' })
    .line(text)
    .end(el => console.log('THIS IS THE END:', el))

}

window.go2 = () => {
  x.cursor({ block: true, color: 'red' })
    .line('This is a 2nd set of instructions for typer.', 70)
}

document.querySelector('.go').addEventListener('click', () => {
  if (goCalled) return go2()

  goCalled = true
  go()
})

document.querySelector('.halt').addEventListener('click', () => x.halt())
document.querySelector('.resume').addEventListener('click', () => x.resume())
document.querySelector('.listen').addEventListener('click', () => {
  document.body.dispatchEvent(new Event('test'))
})
document.querySelector('.kill').addEventListener('click', () => y.kill())
