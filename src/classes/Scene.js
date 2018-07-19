var { Vector, Box } = require('@/lib/math')

module.exports = class Scene {
  constructor (tilemap) {
    var min = new Vector(0, 0)
    var max = new Vector(tilemap.width || 640, tilemap.height || 480)

    this.tilemap = tilemap
    this.bounds = new Box(min, max)

    this.__c = 0
    this.__r = 0
    this.__tile = null
  }

  render (ctx, camera, tilesets) {
    this.__startCol = Math.floor(camera.position.x / 16)
    this.__endCol = this.__startCol + (camera.size.x / 16)
    this.__startRow = Math.floor(camera.position.y / 16)
    this.__endRow = this.__startRow + (camera.size.y / 16)

    for (this.__c = this.__startCol; this.__c < this.__endCol; this.__c++) {
      for (this.__r = this.__startRow; this.__r < this.__endRow; this.__r++) {

      }
    }
  }
}
