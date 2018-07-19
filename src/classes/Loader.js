var fs = require('fs')
var path = require('path')
var yaml = require('js-yaml')

var Tilemap = require('@/classes/Tilemap')
var Tileset = require('@/classes/Tileset')

module.exports = class Loader {
  constructor () {
    this.data = {
      settings: yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../../data/settings.yaml'))),
      tilesets: yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../../data/tilesets.yaml'))),
      tilemaps: yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../../data/tilemaps.yaml')))
    }

    this.images = {}
    this.promises = []
  }

  add (key, src) {
    var img = new window.Image()

    var promise = new Promise((resolve, reject) => {
      img.onload = () => {
        this.images[key] = img
        resolve()
      }

      img.onerror = err => {
        reject(new Error(`Failed to load image ${src}:`), err)
      }
    })

    img.src = src
    this.promises.push(promise)
  }

  load () {
    return Promise.all(this.promises).then(() => {
      var tilemaps = {}

      this.data.tilemaps.forEach(tilemap => {
        tilemaps[tilemap.name] = new Tilemap(tilemap.cols, tilemap.rows, tilemap.tiles)
      })

      tilemaps['start'] = tilemaps[this.data.settings.start.tilemap]

      var tilesets = {}

      this.data.tilesets.forEach(tileset => {
        tilesets[tileset.name] = new Tileset(this.images[tileset.name])
      })

      return {
        tilemaps,
        tilesets
      }
    })
  }
}
