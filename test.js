var test = require('tape')
var createActorMiddleware = require('./')
var pull = require('pull-stream')

test('pull actors', function (t) {
  // setup stuff for tests
  t.plan(3)
  var num = 0 // our state object
  var count = 0 // how many times we've dispatched
  var store = {
    dispatch: function (action) {
      count++
      return middleware(action)
    },
    getState: function () {
      return {
        foo: num
      }
    }

  }

  var middleware = createActorMiddleware([
    function (store) {
      return pull(
        pull.filter(function (inc) {
          return inc.action.type === 'try_to_add' && num <= 6
        }),
        pull.map(function (inc) {
          return { type: 'add', payload: inc.action.payload }
        })
      )
    }
  ])(store)(reducer)

  function reducer (action) {
    if (action.type === 'add') {
      num = num + action.payload
    }
    return num
  }

  // Run tests.

  store.dispatch({ type: 'try_to_add', payload: 1 })
  store.dispatch({ type: 'try_to_add', payload: 3 })

  t.equal(store.getState().foo, 4, 'added 4')

  store.dispatch({ type: 'try_to_add', payload: 3 })
  store.dispatch({ type: 'try_to_add', payload: 3 })
  store.dispatch({ type: 'try_to_add', payload: 3 })

  t.equal(store.getState().foo, 7, 'stopped adding after end condition met.')

  t.equal(count, 8, '5 primary events, 3 from actors.')
})

