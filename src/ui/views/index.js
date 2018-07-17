var html = require('choo/html')

var Game = require('../../game')
var Tabs = require('../components/Tabs')
var Console = require('../components/Console')
var Menu = require('../components/Menu')

var views = {
  main: mainView,
  room: require('./room'),
  inventory: inventoryView,
  stats: statsView,
  ship: shipView
}

var tabs = [
  { name: 'Room', view: views.room },
  { name: 'Inventory', view: views.inventory },
  { name: 'Stats', view: views.stats },
  { name: 'Ship', view: views.ship }
]

module.exports = views

function mainView (state, emit) {
  var el = html`
    <div class="bg-black white" style="width: 640px; height: 480px">
      ${state.cache(Tabs, 'tabs').render(tabs)}
      ${state.cache(Tabs, 'tabs').selected.view(state, emit)}
      ${state.cache(Console, 'console').render(state.data.console)}
    </div>`

  return html`
    <div id="viewport" class="">
      ${state.cache(Menu, 'menu').render(state.menu.toggled, el)}
      ${state.cache(Game, 'game').render()}
    </div>`
}

function inventoryView (state, emit) {
  return html`
    <div>
      <p>credits: ${state.data.hero.credits}</p>

      equipment:
      <pre>
        ${JSON.stringify(state.data.hero.equipment, null, 2)}
      </pre>
      
      items:
      <pre>
        ${JSON.stringify(state.data.hero.items, null, 2)}
      </pre>
    </div>`
}

function statsView (state, emit) {
  return html`
    <div>
      <pre>
        ${JSON.stringify(state.data.hero.stats, null, 2)}
      </pre>
    </div>`
}

function shipView (state, emit) {
  return html`
    <div>
      <pre>
        ${JSON.stringify(state.data.ship, null, 2)}
      </pre>
    </div>`
}
