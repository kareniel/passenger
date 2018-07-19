var Loader = require('@/classes/Loader')
var Keyboard = require('@/classes/Keyboard')
var Camera = require('@/classes/Camera')
var Scene = require('@/classes/Scene')
var Debugger = require('@/classes/Debugger')

var { Vector } = require('@/lib/math')

const KEYS = {
  UP: 'UP',
  RIGHT: 'RIGHT',
  DOWN: 'DOWN',
  LEFT: 'LEFT'
}

module.exports = class Game {
  constructor () {
    this.__delta = 0
    this.__direction = new Vector()
    this._previousElapsed = 0

    this.loader = new Loader()
    this.keyboard = new Keyboard()
    this.camera = new Camera()
    this.debugger = new Debugger()

    this.tick = this.tick.bind(this)
  }

  run (ctx) {
    this.ctx = ctx

    this.loader.data.tilesets.forEach(tileset => {
      this.loader.add(tileset.name, 'tiles/' + tileset.src)
    })

    this.loader.load().then(data => {
      this.tilemaps = data.tilemaps
      this.tilesets = data.tilesets

      this.init()
      window.requestAnimationFrame(this.tick)
    })
  }

  tick (elapsed) {
    window.requestAnimationFrame(this.tick)

    this.__delta = (elapsed - this._previousElapsed) / 1000.0
    this.__delta = Math.min(this.__delta, 0.25)
    this._previousElapsed = elapsed

    this.update(this.__delta)
    this.render()
  }

  init () {
    this.scene = new Scene(this.tilemaps['start'])
  }

  update (delta) {
    this.__direction.set(0, 0)

    if (this.keyboard.isDown(KEYS.LEFT)) this.__direction.setX(-1)
    if (this.keyboard.isDown(KEYS.RIGHT)) this.__direction.setX(1)
    if (this.keyboard.isDown(KEYS.UP)) this.__direction.setY(-1)
    if (this.keyboard.isDown(KEYS.DOWN)) this.__direction.setY(1)

    if (this.__direction.x !== 0 || this.__direction.y !== 0) {
      this.camera.move(delta, this.__direction, this.scene)
    }
  }

  render () {
    this.clear()
    this.scene.render(this.ctx, this.camera, this.tilesets)
    this.debugger.render(this.ctx, this)
  }

  clear () {
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, 320, 240)
  }
}
