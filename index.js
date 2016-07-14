var pull = require('pull-stream')
var notify = require('pull-notify')
var reduce = require('universal-reduce')

module.exports = actorMiddleware

function actorMiddleware (actors) {
  return function createMiddleware (store) {
    var publish = notify()
    reduce(actors, function (_, stream, n) {
      var source = pull(publish.listen(), stream(store))
      if (source) {
        pull(source, pull.drain(function (action) {
          if (action != null) store.dispatch(action)
        }))
      }
    })
    return function (next) {
      return function (action) {
        var before = store.getState()
        var res = next(action)
        var state = store.getState()
        publish({ action, before, state })
        return res
      }
    }
  }
}
