const typer = require('../dist/typer.min')
const {wait} = require('../src/testUtils')
const text =
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit temporibus deserunt illum facere hic eius totam cupiditate aut expedita necessitatibus neque aperiam quos obcaecati ipsa, accusamus tempora doloremque! Modi, molestiae.'

describe('Testing the `.halt` API', () => {
  beforeEach(() => (document.body.innerHTML = '<div id="test"></div>'))

  test('Should halt Typer from continuing', () => {
    const t1 = typer('#test').line(text, 10)
    let content

    return wait(500)
      .then(t1.halt)
      .then(wait)
      .then(() => {
        content = document.querySelector('#test').textContent
        return wait(500)
      })
      .then(() => {
        const content2 = document.querySelector('#test').textContent
        expect(content).toBe(content2)
      })
  })
})
