const typer = require('../dist/typer.min')
const {wait} = require('../src/testUtils')

describe('Testing the `.run` API', () => {
  beforeEach(() => (document.body.innerHTML = '<div id="test"></div>'))

  test('Passing `.run` a fxn should run that function', () => {
    const func = jest.fn()

    typer('#test').line().run(func)
    return wait().then(() => expect(func).toHaveBeenCalled())
  })

  test('The 1st argument to the function passed to `.run` should be the parent element', () => {
    const test = document.querySelector('#test')

    return new Promise(resolve => {
      typer('#test')
        .line()
        .run(function (el) {
          resolve({el, argLength: arguments.length})
        })
    }).then(obj => {
      expect(obj.el === test).toBe(true)
      expect(obj.argLength).toBe(1)
    })
  })
})
