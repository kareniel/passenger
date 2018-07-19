var Component = require('choo/component')
var html = require('choo/html')

var Game = require('@/classes/Game')

module.exports = class GameComponent extends Component {
  constructor (id, state, emit) {
    super()

    this.state = state
    this.emit = emit

    this._game = new Game()

    window.game = this._game
  }

  createElement () {
    this.el = html`<canvas width="320" height="240"></canvas>`
    this.ctx = this.el.getContext('2d')

    return this.el
  }

  update () {
    return false
  }

  load () {
    this._game.run(this.ctx)
  }
}
