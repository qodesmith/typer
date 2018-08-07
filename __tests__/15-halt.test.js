const typer = require('../typer.min')
const wait = require('../src/wait')
const text = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit temporibus deserunt illum facere hic eius totam cupiditate aut expedita necessitatibus neque aperiam quos obcaecati ipsa, accusamus tempora doloremque! Modi, molestiae.'

describe('Testing the `.halt` API', () => {
  beforeEach(() => document.body.innerHTML = '<div id="test"></div>')

  // https://goo.gl/3c1a8h
  global.console = {
    warn: jest.fn()
  }

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

  test('Calling `.halt` while Typer is in pause mode should result in a console warning', () => {
    const t1 = typer('#test').line('abc', 1).pause(1000000)

    return wait(100)
      .then(t1.halt)
      .then(() => expect(global.console.warn).toHaveBeenCalled())
  })

  test('Calling `.halt` while Typer is in listen mode should result in a console warning', () => {
    const t1 = typer('#test').line('abc', 1).listen('if-you-build-it-he-will-come')

    return wait(100)
      .then(t1.halt)
      .then(() => expect(global.console.warn).toHaveBeenCalled())
  })
})
