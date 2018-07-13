// /src/ui/index.js
// web app used to prototype game systems

var choo = require('choo')
var devtools = require('choo-devtools')

var app = choo()

app.use(devtools())
app.use(require('./store.js'))
app.use(require('./router.js'))

module.exports = app
