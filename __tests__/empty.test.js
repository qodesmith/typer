const typer = require('../dist/typer.min')
const {wait} = require('../src/testUtils')

describe('Testing the `.empty` API', () => {
  test('`.empty` should empty the container starting fresh with a single div', () => {
    const body = document.body
    const content = 'Hello world!'

    body.innerHTML = '<div id="test"></div>'
    typer('#test', 1).line([content])

    return wait()
      .then(() => expect(body.textContent).toBe(content))
      .then(() => {
        body.innerHTML = '<div id="test"></div>'
        typer('#test', 1).line([content]).line([content]).empty()
      })
      .then(wait)
      .then(() => {
        const test = document.querySelector('#test')

        expect(body.textContent).toBe('')
        expect(test.children.length).toBe(1)
      })
  })
})
