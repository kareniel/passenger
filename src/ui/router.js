var views = require('./views')

module.exports = router

function router (state, emitter, app) {
  app.route('/', views.main)
}
