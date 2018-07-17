module.exports = menuStore

function menuStore (state, emitter) {
  state.menu = {
    toggled: false
  }

  emitter.on('DOMContentLoaded', () => {
    emitter.on('menu:toggle', toggleMenu)

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        emitter.emit('menu:toggle')
      }
    })
  })

  function toggleMenu () {
    state.menu.toggled = !state.menu.toggled
    emitter.emit('render')
  }
}
