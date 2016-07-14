# redux-pull-actors

Actors for doing additional asynchronous work based on redux actions and
state transitions.

## var createActorMiddleware = require('redux-pull-actors')

Returns a function that takes a collection of stream creators, which are handed
the redux store. They will have objects `{action, state, oldState}` piped to
them for every action. If they are through streems, anything emited out the
other side will be dispatched back to the store.
