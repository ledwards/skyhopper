var app = require('derby').createApp(module),
    get = app.get,
    view = app.view,
    ready = app.ready;

// ROUTES //

get('/play/:gameId?', function(page, model, params) {
  var gameId = params.gameId;

  model.subscribe({ _game: 'game.' + gameId }, function() {
    var nextPlayerCount = (model.get('_game.players.length') || 0) + 1;

    model.push('_game.players', { name: "Player " + nextPlayerCount });
    model.set('_game.playerCount', nextPlayerCount);
    model.set('_player', model.ref('_game.players.' + (nextPlayerCount - 1)));

    page.render({
      gameId: gameId,
    });
  });
});


// CONTROLLER FUNCTIONS //

ready(function(model) {
  exports.updateCard = function(e) {
    var el = jQuery(e.target).parent();
    var top = el.css("top");
    var left = el.css("left");
    model.set("_game.card.position", { top: top, left: left });
  };

  model.on('set', '_game.card.position', function(position){
    jQuery(".card:first").css('left', position.left);
    jQuery(".card:first").css('top', position.top);
    jQuery(".card").css('z-index', 0);
    jQuery(".card:first").css('z-index', 1);
  });
});
