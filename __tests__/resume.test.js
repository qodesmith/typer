const typer = require('../dist/typer.min')
const {wait} = require('../src/testUtils')
const text =
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit temporibus deserunt illum facere hic eius totam cupiditate aut expedita necessitatibus neque aperiam quos obcaecati ipsa, accusamus tempora doloremque! Modi, molestiae.'

describe('Testing the `.resume` API', () => {
  beforeEach(() => (document.body.innerHTML = '<div id="test"></div>'))

  test('Should resume Typer when in a halted status', () => {
    const t1 = typer('#test').line(text, 10)
    let content
    let content2

    return wait(500)
      .then(() => t1.halt())
      .then(wait)
      .then(() => {
        content = document.querySelector('#test').textContent
        return wait(500)
      })
      .then(() => {
        content2 = document.querySelector('#test').textContent
        expect(content).toBe(content2)
      })
      .then(t1.resume)
      .then(wait)
      .then(() => {
        const content3 = document.querySelector('#test').textContent
        expect(content3.length).toBeGreaterThan(content2.length)
        expect(content3.length).toBeGreaterThan(content.length)
      })
  })
})
