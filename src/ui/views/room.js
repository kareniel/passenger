var html = require('choo/html')

module.exports = roomView

function roomView (state, emit) {
  return html`
    <div>
      <p>
        Current location: 
        <strong>${state.data.hero.location.name}</strong>
      </p>

      <p>
        Doorways: ${doorways(state, emit)}
      </p>

      <p>
        Objects: ${objects(state, emit)}
      </p>

      <hr>
      
      <pre class="">
        ${JSON.stringify(state.data.hero.location, null, 2)}
      </pre>
    </div>`
}

function doorways (state, emit) {
  return html`<ul class="list">
    ${state.data.hero.location.doorways.map(doorway => html`
      <li>
        <button 
          ${doorway.locked ? 'disabled' : ''} 
          onclick=${e => enter(doorway)}>
          ${doorway.destination.name}
        </button>
      </li>
    `)}
  </ul>`

  function enter (doorway) {
    var location = state.data.ship.rooms.find(room => room.name === doorway.destination.name)

    emit('hero:teleport', location, doorway.destination.position)
  }
}

function objects (state, emit) {
  return html`
    <ul class="list">
      ${(state.data.hero.location.objects || [])
    .filter(obj => {
      return isVisible(obj)
    })
    .map(obj => html`
        <li>
          <span>${obj.name}</span>

          <select onchange=${e => selectAction(e, obj)}>
            <option>Actions</option>
            <option>Look</option>
          </select>
        </li>
      `)}
    </ul>`

  function selectAction (e, obj) {
    var selectedOption = e.target.selectedOptions[0].text
    e.target.selectedIndex = 0

    switch (selectedOption) {
      case 'Look':
        emit('object:look', obj)
        break
      default:
        break
    }
  }

  function isVisible (obj) {
    return obj.conditions.every(condition => {
      var subject = condition[0]
      var value = condition[2]

      return state.data.conditionVariables[subject] == value
    })
  }
}
