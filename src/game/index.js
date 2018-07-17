const { DIRECTION } = require('./constants')

var Component = require('choo/component')
var html = require('choo/html')
var parallel = require('run-parallel')
var V = require('three').Vector2

var Sprite = require('./classes/Sprite')
var Hero = require('./classes/Hero')
var Obstacle = require('./classes/Obstacle')

module.exports = class Game extends Component {
  constructor () {
    super()

    this.update = this.update.bind(this)
    this.state = {
      running: false,
      time: {
        elapsed: 0.0,
        frame: 0
      }
    }

    this.preload(() => {
      this.setup()
      this.start()
    })
  }

  createElement () {
    this.el = html`<canvas width="320" height="240"></canvas>`
    this.ctx = this.el.getContext('2d')

    return this.el
  }

  update () {
    return false
  }

  preload (callback) {
    this.sprites = {}

    var tasks = [
      done => this.loadSpritesheet('hero', 'sprites/link.png', new V(24, 24), done)
    ]

    parallel(tasks, callback)
  }

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
  }

  setup () {
    this.keys = new Set()
    this.hero = new Hero(this.sprites['hero'], new V(160, 120), DIRECTION.DOWN)

    this.obstacles = [
      new Obstacle(new V(0, 0), new V(320, 24)),
      new Obstacle(new V(320 - 24, 0), new V(320, 240)),
      new Obstacle(new V(0, 240 - 24), new V((320 / 2) - 24, 240)),
      new Obstacle(new V((320 / 2) + 24, 240 - 24), new V(320, 240)),
      new Obstacle(new V(0, 0), new V(24, 240))
    ]

    document.addEventListener('keydown', e => {
      this.keys.add(e.key)
    })

    document.addEventListener('keyup', e => {
      this.keys.delete(e.key)
    })
  }

  start () {
    this.startedAt = Date.now()
    this.state.running = true

    this.frame()
  }

  frame () {
    if (!this.state.running) return

    window.requestAnimationFrame(timestamp => {
      this.gameUpdate()
      this.gameRender()

      this.state.time.elapsed = timestamp
      this.state.time.frame++

      this.frame()
    })
  }

  collides (box) {
    return this.obstacles.some(obstacle => box.intersectsBox(obstacle))
  }

  gameUpdate () {
    this.state.time.seconds = (this.state.time.elapsed / 1000)

    this.obstacles.forEach(obstacle => obstacle.update())

    this.hero.update(this)
  }

  gameRender () {
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, this.el.width, this.el.height)

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
