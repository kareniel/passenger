var V = require('three').Vector2

module.exports = class Sprite {
  constructor (img, size, index) {
    this.img = img
    this.size = size

    var numberOf = {
      cols: img.width / size.x,
      rows: img.height / size.y
    }

    numberOf.sprites = numberOf.cols * numberOf.rows

    this.offset = new V(
      (Math.floor(index / (numberOf.sprites / numberOf.cols)) * size.x),
      (Math.floor(index / (numberOf.sprites / numberOf.rows)) * size.y)
    )
  }

  render (ctx, position) {
    ctx.drawImage(
      this.img,
      this.offset.x, this.offset.y,
      this.size.x, this.size.y,
      position.x, position.y,
      this.size.x, this.size.y
    )
  }
}
