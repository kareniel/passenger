var Component = require('choo/component')

module.exports = class Menu extends Component {
  constructor () {
    super()

    this.toggled = false
  }

  createElement (toggled, el) {
    this.toggled = toggled

    el.style.display = toggled ? 'block' : 'none'

    return el
  }

  update (toggled, el) {
    return this.toggled !== toggled
  }
}
