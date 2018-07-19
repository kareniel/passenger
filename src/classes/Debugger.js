class Debugger {
  constructor () {
    this.cn = 0
    this.startedAt = Date.now()
    this.now = Date.now()
  }

  render (ctx, game) {
    this.cn++
    this.now = Date.now()

    this.__keys = []
    game.keyboard._keys.forEach(key => this.__keys.push(key))

    this.__fps = ((this.cn / (this.now - this.startedAt)) * 1000).toFixed(2)

    ctx.fillStyle = 'white'
    ctx.font = '12px monospace'
    ctx.textAlign = 'left'

    ctx.fillText(this.__fps, 1, 14)

    ctx.textAlign = 'center'

    ctx.fillText(this.__keys.join(', '), 160, 14)

    ctx.textAlign = 'right'

    ctx.fillText(game.camera.position.x.toFixed(2), 318, 14)
    ctx.fillText(game.camera.position.y.toFixed(2), 318, 28)
  }
}

module.exports = Debugger
