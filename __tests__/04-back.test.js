const typer = require('../typer.min')
const content = 'Hello World!'
const wait = require('../src/wait')
const promise = (time = 20) => wait(time).then(() => document.querySelector('#test'))

describe('Testing the `.back` API', () => {
  beforeEach(() => document.body.innerHTML = '<div id="test"></div>')

  test('Passing `.back` no arguments should do nothing', () => {
    typer('#test', 1).line([content]).back()
    return promise().then(el => expect(el.textContent).toBe(content))
  })

  test('Passing `.back` a (+) number should remove that many characters', () => {
    const num = 6

    typer('#test', 1).line([content]).back(num)
    return promise().then(el => expect(el.textContent).toBe(content.slice(0, -num)))
  })

  test('Passing `.back` a (-) number should remove all-but that many characters', () => {
    const num = 3

    typer('#test', 1).line([content]).back(-num)
    return promise().then(el => expect(el.textContent).toBe(content.slice(0, num)))
  })

  test('Passing `.back` two number arguments should remove characters at a speed', () => {
    const repeated = content.repeat(20)
    const num = 10

    typer('#test', 1).line([repeated]).back(num, 1)

    return promise(50)
      .then(el => {
        expect(el.textContent).not.toBe(repeated)
        expect(el.textContent).toBe(repeated.slice(0, -num))
      })
  })

  test('Passing "empty" to `.back` should empty the line', () => {
    typer('#test', 1).line([content]).back('empty')
    return promise().then(el => expect(el.textContent).toBe(''))
  })

  test('Passing "empty" to `.back` with a 2nd (+) # arg will erase that many chars instantly', () => {
    const num = 6

    typer('#test', 1).line([content]).back('empty', num)

    return promise().then(el => {
      expect(el.textContent).toBe(content.slice(0, -num))
      expect(el.textContent.length).toBe(content.length - num)
    })
  })

  test('Passing "empty" to `.back` with a 2nd (-) # arg will erase all-but that many chars instantly', () => {
    const num = 3

    typer('#test', 1).line([content]).back('empty', -num)

    return promise()
      .then(el => {
        expect(el.textContent).toBe(content.slice(0, num))
        expect(el.textContent.length).toBe(num)
      })
  })

  test('Passing "all" to `.back` should remove all characters', () => {
    typer('#test', 1).line([content]).back('all')
    return promise(50).then(el => expect(el.textContent).toBe(''))
  })

  test('Passing "all" to `.back` with 2nd # arg should remove all characters at speed', () => {
    const repeated = content.repeat(3)
    typer('#test', 1).line([repeated]).back('all', 20)

    return promise()
      .then(el => expect(el.textContent).not.toBe(''))
      .then(() => promise(800))
      .then(el => expect(el.textContent).toBe(''))
  })
})
