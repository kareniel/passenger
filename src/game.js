var ui = require('./ui')

module.exports = {
  mount (selector) {
    var el = document.querySelector(selector)
    var uiEl = document.createElement('div')

    this.canvas = createCanvas()
    this.ctx = this.canvas.getContext('2d')
    this.ctx.imageSmoothingEnabled = false

    this.sprites = {}

    el.appendChild(this.canvas)
    el.appendChild(uiEl)

    ui.mount(uiEl)

    this.preload()
    this.start()
  },
  preload () {
    this.load('hero', 'sprites/link.png', {})
  },
  load (key, src, opts) {
    var el = document.createElement('img')

    el.src = src
    el.style.display = 'none'

    this.sprites[key] = el
  },
  start () {
    this.update = this.update.bind(this)
    this.startedAt = Date.now()
    this.state = {
      running: true,
      time: {
        elapsed: 0.0,
        frame: 0
      }
    }

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
  },
  render () {
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.fillStyle = 'white'
    this.ctx.font = 'bold 12px Arial'
    this.ctx.fillText(this.state.time.seconds.toFixed(2), 0, 14)

    this.ctx.drawImage(this.sprites['hero'], 160, 120)
  }
}

function createCanvas () {
  var canvas = document.createElement('canvas')

  canvas.width = 320
  canvas.height = 240

  return canvas
}
