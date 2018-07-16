var Vector = require('victor')
var parallel = require('run-parallel')

var ui = require('./ui')

const BASE_SPEED = 1.75
const DIRECTION = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3
}

class Sprite {
  constructor (img, size, index) {
    var cols = img.width / size.x
    var rows = img.height / size.y

    this.img = img
    this.sx = Math.floor(index / ((cols * rows) / cols)) * size.x
    this.sy = Math.floor(index / ((cols * rows) / rows)) * size.y
    this.sw = size.x
    this.sh = size.y
  }

  render (ctx, pos) {
    ctx.drawImage(
      this.img, this.sx, this.sy, this.sw, this.sh, pos.x, pos.y, this.sw, this.sh
    )
  }
}

class Obstacle {
  constructor (position, size) {
    this.position = position
    this.size = size
  }

  bottom () {
    return this.position.y + this.size.y
  }

  intersects (v) {
    return (
      ((v.x > this.position.x) && (v.x < this.position.x + this.size.x)) ||
      ((v.y > this.position.y) && (v.y < this.position.y + this.size.y))
    )
  }

  render (ctx) {
    ctx.fillStyle = 'grey'
    ctx.fillRect(
      this.position.x, this.position.y,
      this.size.x, this.size.y
    )
  }
}

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
      done => this.load('hero', 'sprites/link.png', new Vector(24, 24), done)
    ]

    parallel(tasks, callback)
  },
  load (key, src, size, done) {
    var img = new window.Image()

    img.onload = () => {
      var cols = img.width / size.x
      var rows = img.height / size.y
      var length = cols * rows

      this.sprites[key] = new Array(length)
        .fill(0)
        .map((_, index) => new Sprite(img, size, index))

      done()
    }

    img.src = src
  },
  start () {
    this.keys = new Set()

    this.hero = {
      sprites: this.sprites['hero'],
      facing: 2,
      position: { x: 111, y: 111 },
      top () {
        return this.position.y + 16
      },
      left () {
        return this.position.x + 4
      },
      render (ctx) {
        this.sprites[this.facing].render(ctx, this.position)

        ctx.fillStyle = 'red'
        ctx.fillRect(this.left(), this.top(), 1, 1)
      }
    }

    this.hwall = new Obstacle(new Vector(0, 50), new Vector(320, 24))
    this.vwall = new Obstacle(new Vector(0, 50), new Vector(24, 240))

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
  update () {
    this.state.time.seconds = (this.state.time.elapsed / 1000)

    var speed = this.keys.size > BASE_SPEED ? BASE_SPEED * 0.75 : BASE_SPEED

    if (this.keys.has('w')) {
      this.hero.facing = DIRECTION.UP

      if (!this.hwall.intersects(new Vector(0, this.hero.top() - speed))) {
        this.hero.position.y -= speed
      }
    }

    if (this.keys.has('d')) {
      this.hero.facing = DIRECTION.RIGHT
      this.hero.position.x += speed
    }

    if (this.keys.has('s')) {
      this.hero.facing = DIRECTION.DOWN
      this.hero.position.y += speed
    }

    if (this.keys.has('a')) {
      this.hero.facing = DIRECTION.LEFT

      if (!this.vwall.intersects(new Vector(this.hero.left() - speed, 0))) {
        this.hero.position.x -= speed
      }
    }
  },
  render () {
    this.keysArr = []
    this.keys.forEach(key => this.keysArr.push(key))

    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.fillStyle = 'white'
    this.ctx.font = 'bold 12px Arial'

    this.ctx.fillText(this.state.time.seconds.toFixed(2), 1, 14)
    this.ctx.fillText(this.keysArr.join(','), 1, 28)

    this.hwall.render(this.ctx)
    this.vwall.render(this.ctx)

    this.hero.render(this.ctx)
  }
}

function createCanvas () {
  var canvas = document.createElement('canvas')

  canvas.width = 320
  canvas.height = 240

  return canvas
}
