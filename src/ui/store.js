var fs = require('fs')
var path = require('path')
var yaml = require('js-yaml')

const MILLISECONDS_PER_TICK = 1000
const TICKS_PER_ROUND = 3
const ROUNDS_PER_PERIOD = 300
const PERIODS_PER_DAY = 4
const ROUNDS_PER_DAY = ROUNDS_PER_PERIOD * PERIODS_PER_DAY

module.exports = store

function store (state, emitter) {
  state.data = {
    hero: yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../../data/hero.yaml'))),
    ship: yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../../data/ship.yaml'))),
    passengers: yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../../data/passengers.yaml'))),
    tick: 0,
    timerId: null,
    console: [],
    conditionVariables: {
      'Ship ran into an asteroid': false
    }
  }

  state.computed = {
    round () {
      return state.tick / TICKS_PER_ROUND
    },
    day () {
      var round = state.computed.round()

      return Math.floor(round / ROUNDS_PER_DAY) + 1
    },
    period () {
    // TODO: implement
      return 'Morning'
    }
  }

  emitter.on('DOMContentLoaded', () => {
    registerEvents()
    runInitialEvents()
  })

  function registerEvents () {
    emitter.on('object:look', lookAtObject)
    emitter.on('hero:teleport', teleportHero)
  }

  function lookAtObject (obj) {
    state.data.console.push(obj.description)
    emitter.emit('render')
  }

  function runInitialEvents () {
    var { rooms } = state.data.ship
    var startingRoom = rooms.find(room => room.name === 'Guest Quarters')

    emitter.emit('hero:teleport', startingRoom)
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
