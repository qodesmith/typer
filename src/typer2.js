// https://bit.ly/2Xmuwqf - micro UUID!
const uuid = a=>a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid)
const CLASS_NAMES = ['qs-typer', 'qs-cursor-block', 'qs-cursor-soft', 'qs-cursor-hard', 'qs-no-cursor']
const CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@$^*()'
const VOIDS = ['AREA','BASE','BR','COL','COMMAND','EMBED','HR','IMG','INPUT','KEYGEN','LINK','META','PARAM','SOURCE','TRACK','WBR']


function typer(el, speed) {
  // Our queue which will contain all the instructions (method calls) for Typer to type.
  const q = []

  // Assign this instance of Typer a unique id.
  q.uuid = uuid()

  // Cursor stylesheet added to the head. Used in .cursor method and removeCursorStylesheet.
  let cursorStylesheet


  ////////////////
  // PUBLIC API //
  ////////////////

  const typerObj = {
    cursor(options) {
      // The .line & .continue methods will always use the current q.cursor value.

      // Reset any previous cursor styles set.
      removeCursorStylesheet()

      // The user specified they don't want a cursor.
      if (options === false) {
        q.cursor = 'qs-no-cursor' // Used as a class name.
        return this
      }

      const { color, blink, block } = options
      const cursor = []

      // Optional cursor color - https://bit.ly/2K4tIRT
      if (color) {
        cursorStylesheet = addStyle(`[data-typer="${q.uuid}"] .qs-typer::after`, `background-color:${color}`)
      }

      // Cursor's blinking style - default to soft.
      cursor.push(`qs-cursor-${blink === 'hard' ? 'hard' : 'soft'}`)

      // Cursor: block or line.
      if (block === true) cursor.push('qs-cursor-block')

      q.cursor = cursor.join(' ') // Used as a class.

      return this
    }
  }


  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////

  function removeCursorStylesheet() {
    if (cursorStylesheet) cursorStylesheet.remove()
  }
}

module.exports = typer
