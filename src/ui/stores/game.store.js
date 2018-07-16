var fs = require('fs')
var path = require('path')
var yaml = require('js-yaml')

module.exports = gameStore

function gameStore (state, emitter) {
  state.data = {
    hero: yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../../../data/hero.yaml'))),
    ship: yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../../../data/ship.yaml'))),
    passengers: yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../../../data/passengers.yaml'))),
    console: [],
    conditionVariables: {
      'Ship ran into an asteroid': false
    }
  }

  emitter.on('DOMContentLoaded', () => {
    emitter.on('object:look', lookAtObject)
    emitter.on('hero:teleport', teleportHero)

    var startingRoom = state.data.ship.rooms.find(room => room.name === 'Guest Quarters')

    emitter.emit('hero:teleport', startingRoom)
  })

  function lookAtObject (obj) {
    state.data.console.push(obj.description)
    emitter.emit('render')
  }

  function teleportHero (location, position) {
    state.data.hero.location = Object.assign({}, location, {
      doorways: resolveDoorwaysForRoom(location)
    })

    state.data.position = position || { x: 0, y: 0 }

    emitter.emit('action:movement')
    emitter.emit('render')
  }

  function resolveDoorwaysForRoom (room) {
    // TODO: refactor
    var doorways = state.data.ship.doorways.reduce((a, b) => {
      if (b.rooms.includes(room.name)) {
        var index = b.rooms.indexOf(room.name)
        var roomNames = b.rooms.slice()

        roomNames.splice(index, 1)

        return a.concat({
          destination: {
            name: roomNames[0],
            position: {
              x: 0,
              y: 0
            }
          },
          locked: b.locked
        })
      }

      return a
    }, [])

    return doorways
  }
}
