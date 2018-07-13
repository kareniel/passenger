var html = require('choo/html')
var { Tabs } = require('./components')

var views = {
  main: mainView,
  room: roomView,
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
  return html`
    <div>
      <h1>Just a Passenger</h1>

      <button onclick=${e => emit('rounds:finish')}>Pass</button>

      ${state.cache(Tabs, 'tabs').render(tabs)}
      ${state.cache(Tabs, 'tabs').selected.view(state, emit)}
    </div>`
}

function roomView (state, emit) {
  return html`
    <div>
      <p>
        Current location: <strong>${state.data.hero.location.name}</strong>
      </p>
      <p>
        Doorways:
        <ul class="list">
          ${state.data.hero.location.doorways.map(doorway => html`
            <li>
              <button 
                ${doorway.locked ? 'disabled' : ''} 
                onclick=${e => enter(doorway)}>
                ${doorway.destination.name}
              </button>
            </li>
          `)}
        </ul>
      </p>

      <hr>
      
      <pre class="">
        ${JSON.stringify(state.data.hero.location, null, 2)}
      </pre>
    </div>`

  function enter (doorway) {
    var location = state.data.ship.rooms.find(room => room.name === doorway.destination.name)

    emit('hero:teleport', location, doorway.destination.position)
  }
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
