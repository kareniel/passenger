var Box = require('three').Box2
var V = require('three').Vector2

module.exports = class Obstacle extends Box {
  update () {
    if (!this._size) this._size = new V(0, 0)
    this.getSize(this._size)
  }

  render (ctx) {
    ctx.fillStyle = 'grey'
    ctx.fillRect(
      this.min.x, this.min.y,
      this._size.x, this._size.y
    )
  }
}
