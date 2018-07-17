var Component = require('choo/component')

module.exports = class Menu extends Component {
  createElement (toggled, el) {
    this.el = el

    return el
  }

  update (toggled, el) {
    if (this.toggled !== toggled) {
      el.style.display = toggled
        ? 'block'
        : 'none'
    }

    return true
  }
}
