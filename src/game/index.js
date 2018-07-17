const { DIRECTION } = require('./constants')

var parallel = require('run-parallel')
var V = require('three').Vector2

var Sprite = require('./classes/Sprite')
var Hero = require('./classes/Hero')
var Obstacle = require('./classes/Obstacle')
var ui = require('../ui')

module.exports = {
  mount (selector) {
    var el = document.querySelector(selector)
    var uiEl = document.createElement('div')

    this.canvas = createCanvas()
    this.ctx = this.canvas.getContext('2d')
    this.ctx.imageSmoothingEnabled = false

    el.appendChild(this.canvas)
    el.appendChild(uiEl)

    ui.mount(uiEl)

    this.preload(() => {
      this.start()
    })
  },
  preload (callback) {
    this.sprites = {}

    var tasks = [
      done => this.loadSpritesheet('hero', 'sprites/link.png', new V(24, 24), done)
    ]

    parallel(tasks, callback)
  },
  loadSpritesheet (key, src, spriteSize, done) {
    var tilesheet = new window.Image()

    tilesheet.onload = () => {
      var cols = tilesheet.width / spriteSize.x
      var rows = tilesheet.height / spriteSize.y
      var length = cols * rows

      this.sprites[key] = new Array(length)
        .fill(0)
        .map((n, index) => new Sprite(tilesheet, spriteSize, index))

      done()
    }

    tilesheet.src = src
  },
  start () {
    this.keys = new Set()
    this.hero = new Hero(this.sprites['hero'], new V(160, 120), DIRECTION.DOWN)

    this.obstacles = [
      new Obstacle(new V(0, 0), new V(320, 24)),
      new Obstacle(new V(320 - 24, 0), new V(320, 240)),
      new Obstacle(new V(0, 240 - 24), new V((320 / 2) - 24, 240)),
      new Obstacle(new V((320 / 2) + 24, 240 - 24), new V(320, 240)),
      new Obstacle(new V(0, 0), new V(24, 240))
    ]

    this.update = this.update.bind(this)
    this.startedAt = Date.now()
    this.state = {
      running: true,
      time: {
        elapsed: 0.0,
        frame: 0
      }
    }

    document.addEventListener('keydown', e => {
      this.keys.add(e.key)
    })

    document.addEventListener('keyup', e => {
      this.keys.delete(e.key)
    })

    this.frame()
  },
  frame () {
    if (!this.state.running) return

    window.requestAnimationFrame(timestamp => {
      this.update()
      this.render()

      this.state.time.elapsed = timestamp
      this.state.time.frame++

      this.frame()
    })
  },
  collides (box) {
    return this.obstacles.some(obstacle => box.intersectsBox(obstacle))
  },
  update () {
    this.state.time.seconds = (this.state.time.elapsed / 1000)

    this.obstacles.forEach(obstacle => obstacle.update())

    this.hero.update(this)
  },
  render () {
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.keysArr = []
    this.keys.forEach(key => this.keysArr.push(key))
    this.ctx.fillText(this.keysArr.join(','), 1, 28)

    this.obstacles.forEach(obstacle => obstacle.render(this.ctx))

    this.hero.render(this.ctx)

    this.ctx.fillStyle = 'white'
    this.ctx.font = 'bold 12px Arial'

    this.ctx.fillText(this.state.time.seconds.toFixed(2), 1, 14)

    this.ctx.fillStyle = 'white'
    this.ctx.font = 'bold 12px Arial'
  }
}

function createCanvas () {
  var canvas = document.createElement('canvas')

  canvas.width = 320
  canvas.height = 240

  return canvas
}
