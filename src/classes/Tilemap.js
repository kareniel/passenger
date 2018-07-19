var { Vector } = require('@/lib/math')

module.exports = class Tilemap {
  constructor (cols, rows, tiles) {
    this.size = new Vector(cols, rows)

    this.layers = [
      tiles
    ]

    this._index = 0
  }

  getTile (layerIndex, row, col) {
    this._index = row * this.size.x + col

    return this.layers[layerIndex][this._indexPointer]
  }
}
