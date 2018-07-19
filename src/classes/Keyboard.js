class Keyboard {
  constructor () {
    this._keys = new Set()

    this._registerEvents()
  }

  isDown (key) {
    return this._keys.has(key)
  }

  _registerEvents () {
    window.addEventListener('keydown', this._onKeyDown.bind(this))
    window.addEventListener('keyup', this._onKeyUp.bind(this))
  }

  _onKeyDown (e) {
    this._keys.add(Keyboard.KEYS[e.key] || e.key)
  }

  _onKeyUp (e) {
    this._keys.delete(Keyboard.KEYS[e.key] || e.key)
  }
}

Keyboard.KEYS = {
  w: 'UP',
  d: 'RIGHT',
  s: 'DOWN',
  a: 'LEFT',

  ArrowUp: 'UP',
  ArrowRight: 'RIGHT',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',

  Escape: 'CANCEL',
  Enter: 'CONFIRM'
}

module.exports = Keyboard
