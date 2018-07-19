var html = require('choo/html')

var Game = require('@/ui/components/Game.component')
var Menu = require('@/ui/components/Menu')

module.exports = homeView

function homeView (state, emit) {
  var el = html`
    <div class="bg-black white" style="width: 640px; height: 480px">
      <p>-- insert menu here ---</p>
    </div>`

  return html`
    <div id="viewport" class="">
      ${state.cache(Menu, 'menu', state, emit).render(state.menu.toggled, el)}
      ${state.cache(Game, 'game', state, emit).render()}
    </div>`
}
