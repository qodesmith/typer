const typer = require('../typer.min')

describe(`Testing Typer itself (not the api)`, () => {
  beforeEach(() => document.body.innerHTML = '<div id="test"></div>')

  function testTyper(selector, options) {
    return function() {
      return typer(selector, options)
    }
  }

  test('Typer should throw when given a bad selector', () => {
    expect(testTyper()).toThrow()
    expect(testTyper(5)).toThrow()
    expect(testTyper('#not-on-page')).toThrow()
  })

  test("Typer should throw when the options don't have `min` and `max` together", () => {
    expect(testTyper('#test', { min: 5 })).toThrow()
    expect(testTyper('#test', { max: 5 })).toThrow()
  })

  test('Typer should throw when called on the same element twice', () => {
    typer('#test')
    expect(testTyper('#test')).toThrow()
  })

  test('Typer should return an API object when given proper arguments', () => {
    document.body.innerHTML = `
      <div id="test1"></div>
      <div id="test2"></div>
      <div id="test3"></div>
    `

    const t1 = typer('#test1')
    const t2 = typer('#test2', 1)
    const t3 = typer('#test3', { min: 1, max: 30 })
    const api = ['cursor', 'line', 'back', 'continue', 'pause', 'emit', 'listen', 'run', 'end', 'kill'];

    [t1, t2, t3].forEach(obj => api.forEach(property => expect(obj).toHaveProperty(property)))
  })
})
