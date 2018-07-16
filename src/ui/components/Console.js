var Component = require('choo/component')
var html = require('choo/html')

module.exports = class Console extends Component {
  constructor (id, state, emit) {
    super()

    this.state = state
    this.emit = emit
  }

  createElement (lines) {
    this.lines = lines.slice()

    this.el = html`
      <pre style="height: 200px; overflow-y: scroll;">
        ${this.lines.join('\n')}
      </pre>`

    global.ell = this.el

    return this.el
  }

  update (lines) {
    if (lines !== this.lines) {
      this.el.textContent = lines.join('\n')
      this.el.scrollTop = this.el.scrollHeight
    }
    return false
  }
}
