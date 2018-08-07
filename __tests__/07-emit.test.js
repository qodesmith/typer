const typer = require('../typer.min')
const promise = (time = 250) => new Promise(resolve => setTimeout(resolve, time))
const event = 'event'
const bodyCallback = jest.fn()
const elCallback = jest.fn()

describe('Testing the `.emit` API', () => {
  beforeEach(() => document.body.innerHTML = '<div id="test"></div>')

  test('1 arg to `.emit` should fire that event off the body', () => {
    document.body.addEventListener(event, bodyCallback)
    typer('#test').line().emit(event)

    return promise().then(() => expect(bodyCallback).toHaveBeenCalled())
  })

  test('2nd arg to `.emit` should fire that event off that selector', () => {
    document.querySelector('#test').addEventListener(event, elCallback)
    typer('#test').line().emit(event, '#test')

    return promise().then(() => expect(elCallback).toHaveBeenCalled())
  })
})
