const typer = require('../dist/typer.min')
const {wait} = require('../src/testUtils')

describe('Testing the `.pause` API', () => {
  beforeEach(() => (document.body.innerHTML = '<div id="test"></div>'))

  test('Passing `.pause` no arguments to should wait 500ms', () => {
    const content = 'Hello world!'
    typer('#test', 1).line([content]).pause().empty()

    return wait(250)
      .then(() => expect(document.body.textContent).toBe(content))
      .then(() => wait(350))
      .then(() => expect(document.body.textContent).toBe(''))
  })

  test('Passing `.pause` 1000 should wait 1 second', () => {
    const content = 'Hello world!'
    typer('#test', 1).line([content]).pause(1000).empty()

    return wait(250)
      .then(() => expect(document.body.textContent).toBe(content))
      .then(() => wait(350))
      .then(() => expect(document.body.textContent).toBe(content))
      .then(() => wait(650))
      .then(() => expect(document.body.textContent).toBe(''))
  })
})
