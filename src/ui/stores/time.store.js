const MILLISECONDS_PER_TICK = 1000
const TICKS_PER_ROUND = 3
const ROUNDS_PER_PERIOD = 300

module.exports = timeStore

function timeStore (state, emitter) {
  state.time = {
    data: {
      timers: {
        round: null
      },
      ticks: 0,
      round: 1,
      actions: 0,
      period: 1,
      day: 1
    }
  }

  emitter.on('DOMContentLoaded', () => {
    emitter.on('skip', skip)
    emitter.on('room:exit', roomExit)
    // startTimer()
  })

  function skip () {
    console.log('round', state.time.data.round, 'complete')
    state.time.data.round++
  }

  function startTimer () {
    console.log('round', state.time.data.round)
    state.time.data.ticks = 0
    state.time.data.actions = 0

    state.time.data.timers.round = setInterval(() => {
      state.time.data.ticks++

      if (state.time.data.ticks === TICKS_PER_ROUND) {
        emitter.emit('skip')
        clearInterval(state.time.data.timers.round)
        startTimer()
      }
    }, MILLISECONDS_PER_TICK)
  }

  function roomExit () {
    if (state.time.data.round >= ROUNDS_PER_PERIOD) {
      state.time.data.period++

      if (state.time.data.period > 4) {
        state.time.data.day++
        state.time.data.period = 1
      }
    }
  }
}
