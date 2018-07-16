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
      period: 1,
      day: 1
    }
  }

  emitter.on('DOMContentLoaded', () => {
    startTimer()
  })

  function startTimer () {
    console.log('timer started')
    state.time.data.ticks = 0

    state.timer.data.timers.round = setInterval(() => {
      state.time.data.ticks++

      if (state.time.data.ticks === TICKS_PER_ROUND) {
        emitter.emit('skip')
        clearInterval(state.timer.data.timers.round)
        state.time.data.round++
        console.log('time \' up')
      }
    }, MILLISECONDS_PER_TICK)
  }
}
