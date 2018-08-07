const typer = require('../typer.min')
const promise = (time = 250) => new Promise(resolve => setTimeout(resolve, time))

describe('Testing the `.pause` API', () => {
  beforeEach(() => document.body.innerHTML = '<div id="test"></div>')

  test('Passing `.pause` no arguments to should wait 500ms', () => {
    const content = 'Hello world!'
    typer('#test', 1).line([content]).pause().empty()

    return promise()
      .then(() => expect(document.body.textContent).toBe(content))
      .then(() => promise(350))
      .then(() => expect(document.body.textContent).toBe(''))
  })

  test('Passing `.pause` 1000 should wait 1 second', () => {
    const content = 'Hello world!'
    typer('#test', 1).line([content]).pause(1000).empty()

    return promise()
      .then(() => expect(document.body.textContent).toBe(content))
      .then(() => promise(350))
      .then(() => expect(document.body.textContent).toBe(content))
      .then(() => promise(650))
      .then(() => expect(document.body.textContent).toBe(''))
  })
})
