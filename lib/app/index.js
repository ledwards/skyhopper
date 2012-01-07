var app = require('derby').createApp(module),
    get = app.get,
    view = app.view,
    ready = app.ready,
    start;

// ROUTES //

start = +new Date();

// Derby routes can be rendered on the client and the server
get('/:room?', function(page, model, params) {
  var room = params.room || 'home';

  // Subscribes the model to any updates on this room's object. Also sets a
  // model reference to the room. This is equivalent to:
  //   model.set('_room', model.ref('rooms.' + room));
  model.subscribe({ _room: 'rooms.' + room }, function() {

    // setNull will set a value if the object is currently null or undefined
    model.setNull('_room.welcome', 'Welcome to ' + room + '!');

    model.incr('_room.visits');

    // This value is set for when the page initially renders
    model.set('_timer', '0.0');
    // Reset the counter when visiting a new route client-side
    start = +new Date();

    // Render will use the model data as well as an optional context object
    page.render({
      room: room,
      randomUrl: parseInt(Math.random() * 1e9).toString(36)
    });
  });
});


// CONTROLLER FUNCTIONS //

ready(function(model) {
  var timer;

  // Exported functions are exposed as a global in the browser with the same
  // name as the module that includes Derby. They can also be bound to DOM
  // events using the "x-bind" attribute in a template.
  exports.stop = function() {

    // Any path name that starts with an underscore is private to the current
    // client. Nothing set under a private path is synced back to the server.
    model.set('_stopped', true);
    clearInterval(timer);
  };

  (exports.start = function() {
    model.set('_stopped', false);
    timer = setInterval(function() {
      model.set('_timer', (((+new Date()) - start) / 1000).toFixed(1));
    }, 100);
  })();
});
