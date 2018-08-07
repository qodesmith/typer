const typer = require('../typer.min')
const promise = (time = 100) => new Promise(resolve => setTimeout(resolve, time))
const eventName = 'nonsense'
const event = new Event(eventName)
const content = 'Hello world!'
const content2 = 'Can this content be reached?'

describe('Testing the `.listen` API', () => {
  beforeEach(() => document.body.innerHTML = '<div id="test"></div>')

  const body = document.body

  test('1 arg to `.listen` should listen to that event on the body', () => {
    // The 2nd `.listen` will carry over to the next test.
    typer('#test', 1)
      .listen(eventName)
      .line([content])
      .listen(eventName)
      .line([content2])
      .end()

    return promise()
      .then(() => {
        // No event has been triggered.
        expect(body.textContent).toBe('')

        // Trigger the 1st event.
        body.dispatchEvent(event)
      })
      .then(() => promise()) // Give Typer a moment to get the 1st content on the screen.
      .then(() => {
        // Expect our 1st content set to be on the screen.
        expect(body.textContent).toBe(content)

        // Trigger the 2nd event.
        body.dispatchEvent(event)
      })
      .then(() => promise()) // Give Typer a moment to get the 2nd content on the screen.

      // Expect our 2nd content set to be on the screen.
      .then(() => expect(body.textContent.includes(content2)).toBe(true))
  })

  test('2nd arg to `.listen` as a string should listen to that event on that selector', () => {
    const test = document.querySelector('#test')
    typer('#test', 1)
      .listen(eventName, '#test')
      .line([content])

    return promise()
      .then(() => {
        // No event has been triggered.
        expect(body.textContent).toBe('')

        // Dispatch even off the body.
        body.dispatchEvent(event)
      })
      .then(() => promise()) // Give Typer a moment to potentially type content.
      .then(() => {
        // Having dispatched off the body, no content should be visible.
        expect(body.textContent).toBe('')

        // Trigger event off our specific element.
        test.dispatchEvent(event)
      })
      .then(() => promise()) // Give Typer a moment to potentially type content.

      // Expect content to be on the screen.
      .then(() => expect(body.textContent).toBe(content))
  })

  /*
    NOTE: We can't test `.listen` with an element as the 2nd parameter because
    Typer does a `({}).toString.call(...)` check expecting `[object HTMLDivElement]`
    but Jest's test DOM environment produces `[object Object]` instead.
  */
})
