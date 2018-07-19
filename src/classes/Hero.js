var { Vector, Box } = require('@/lib/math')

const { BASE_SPEED, DIRECTION } = require('@/constants')

module.exports = class Hero {
  constructor (sprites, position = new Vector(0, 0), direction = DIRECTION.DOWN) {
    this.sprites = sprites
    this.direction = direction
    this.position = position
    this.sprite = this.sprites[this.direction]

    var min = this.position.clone().add(new Vector(4, 16))
    var max = this.position.clone().add(this.sprite.size).sub(new Vector(4, 0))

    this.bbox = new Box(min, max)
    this.nextBox = this.bbox.clone()
  }

  update (world) {
    var speed = world.keys.size > 1
      ? BASE_SPEED * 0.75
      : BASE_SPEED

    if (world.keys.has('w') || world.keys.has('ArrowUp')) {
      this.direction = DIRECTION.UP

      this.nextBox.copy(this.bbox)
      this.nextBox.translate(new Vector(0, -speed))

      if (!world.collides(this.nextBox)) {
        this.position.y -= speed
        this.bbox.copy(this.nextBox)
      }
    }

    if (world.keys.has('d') || world.keys.has('ArrowRight')) {
      this.direction = DIRECTION.RIGHT

      this.nextBox.copy(this.bbox)
      this.nextBox.translate(new Vector(speed, 0))

      if (!world.collides(this.nextBox)) {
        this.position.x += speed
        this.bbox.copy(this.nextBox)
      }
    }

    if (world.keys.has('s') || world.keys.has('ArrowDown')) {
      this.direction = DIRECTION.DOWN

      this.nextBox.copy(this.bbox)
      this.nextBox.translate(new Vector(0, speed))

      if (!world.collides(this.nextBox)) {
        this.position.y += speed
        this.bbox.copy(this.nextBox)
      }
    }

    if (world.keys.has('a') || world.keys.has('ArrowLeft')) {
      this.direction = DIRECTION.LEFT

      this.nextBox.copy(this.bbox)
      this.nextBox.translate(new Vector(-speed, 0))

      if (!world.collides(this.nextBox)) {
        this.position.x -= speed
        this.bbox.copy(this.nextBox)
      }
    }

    this.sprite = this.sprites[this.direction]
  }

  render (ctx) {
    this.sprite.render(ctx, this.position)

    // nw bound
    ctx.fillStyle = 'red'
    ctx.fillRect(this.bbox.min.x, this.bbox.min.y, 1, 1)

    // se bound
    ctx.fillStyle = 'red'
    ctx.fillRect(this.bbox.max.x, this.bbox.max.y, 1, 1)
  }
}
