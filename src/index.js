var choo = require('choo')
var devtools = require('choo-devtools')

var app = choo()

if (process.env.NODE_ENV !== 'production') {
  app.use(devtools())
}

app.use(require('@/ui/stores/menu.store'))

app.use(require('@/ui/router'))

app.mount('#viewport')
