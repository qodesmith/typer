const typer = require('../dist/typer.min')
const {wait, methodNames} = require('../src/testUtils')
const text =
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos asperiores aspernatur rerum voluptate nemo iusto animi! Modi ipsa, soluta rem nulla esse quibusdam fugit odit libero atque, nam repellat iste.'

describe('Testing the `.kill` API', () => {
  beforeEach(() => (document.body.innerHTML = '<div id="test"></div>'))

  /*
    NOTE: Can't test removing the `killTyper` listener from the body
    because Typer assigns a private function, kill, to that listener
    to which we have no access from the outside.
  */

  test('Should remove the `data-typer` attribute from the parent element', () => {
    const t1 = typer('#test', 1).line(text)
    return wait().then(() => {
      expect(document.querySelector('[data-typer]')).toBeTruthy()
      t1.kill()
      expect(document.querySelector('[data-typer]')).toBeNull()
    })
  })

  test('Should remove the `.typer` class', () => {
    const t1 = typer('#test', 1).line(text)
    return wait().then(() => {
      expect(document.querySelector('.typer')).toBeTruthy()
      t1.kill()
      expect(document.querySelector('.typer')).toBeNull()
    })
  })

  test("Should remove the `.cursor-block` class from the element it's typing in", () => {
    const t1 = typer('#test', 1).cursor({block: true}).line()
    return wait().then(() => {
      expect(document.querySelector('.cursor-block')).toBeTruthy()
      t1.kill()
      expect(document.querySelector('.cursor-block')).toBeNull()
    })
  })

  test("Should remove the `.cursor-soft` class from the element it's typing in", () => {
    const t1 = typer('#test', 1).cursor({blink: 'soft'}).line()
    return wait().then(() => {
      expect(document.querySelector('.cursor-soft')).toBeTruthy()
      t1.kill()
      expect(document.querySelector('.cursor-soft')).toBeNull()
    })
  })

  test("Should remove the `.cursor-hard` class from the element it's typing in", () => {
    const t1 = typer('#test', 1).cursor({blink: 'hard'}).line()
    return wait().then(() => {
      expect(document.querySelector('.cursor-hard')).toBeTruthy()
      t1.kill()
      expect(document.querySelector('.cursor-hard')).toBeNull()
    })
  })

  test("Should remove the `.no-cursor` class from the element it's typing in", () => {
    const t1 = typer('#test', 1).cursor(false).line()
    return wait().then(() => {
      expect(document.querySelector('.no-cursor')).toBeTruthy()
      t1.kill()
      expect(document.querySelector('.no-cursor')).toBeNull()
    })
  })

  test('Should remove current listener from `processListen` if in a listen state', () => {
    const eventName = 'nonsense'
    const event = new Event(eventName)
    const test = document.querySelector('#test')
    const t1 = typer('#test', 1)
      .line()
      .listen(eventName, '#test')
      .line('Hello world!')

    return wait()
      .then(() => {
        expect(test.textContent).toBe('')
        t1.kill()
        test.dispatchEvent(event)
      })
      .then(wait)
      .then(() => {
        expect(test.textContent).toBe('')
      })
  })

  test('Calling any API method after `.kill` should return a nullified API', () => {
    const t1 = typer('#test', 1).line(text)

    return wait().then(() => {
      t1.kill() // Initial kill call.

      methodNames.forEach(method => {
        const methodResults = t1[method]()
        expect(methodResults).toBe(t1)
      })

      return expect(document.body.textContent.length).toBeTruthy()
    })
  })
})
