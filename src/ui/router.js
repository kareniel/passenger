module.exports = router

function router (state, emitter, app) {
  app.route('/', require('./views/home.view'))
}
