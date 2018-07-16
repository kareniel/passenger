// /src/ui/index.js
// web app used to prototype game systems

var choo = require('choo')
var devtools = require('choo-devtools')

var app = choo()

if (process.env.NODE_ENV !== 'production') {
  app.use(devtools())
}

app.use(require('./stores/game.store.js'))
app.use(require('./stores/time.store.js'))

app.use(require('./router.js'))

module.exports = app
