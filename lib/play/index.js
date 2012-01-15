var app = require('derby').createApp(module),
    get = app.get,
    view = app.view,
    ready = app.ready;

// ROUTES //

get('/play/:gameId?', function(page, model, params) {
  var gameId = params.gameId;

  model.subscribe({ _game: 'game.' + params.gameId }, function() {
    var nextPlayerCount = (model.get('_game.players.length') || 0) + 1;

    model.push('_game.players', { name: "Player " + nextPlayerCount, });
    model.set('_game.playerCount', nextPlayerCount);
    model.set('_player', model.ref('_game.players.' + (nextPlayerCount - 1)));

    page.render({
      gameId: gameId,
    });
  });
});


// CONTROLLER FUNCTIONS //

ready(function(model) {
  model.on('push', '_game.players.*.cards', function(playerIndex, card){
    jQuery(".card").draggable({
      start: function(event, ui) {
                jQuery(this).css('cursor', 'move');
                jQuery(".ui-draggable").css('z-index', 0);
                jQuery(this).css('z-index', 1);
              },

      stop: function(event, ui) {
              var movedElement = $(this);
              var cardIndex = movedElement.data("card-index");
              var playerIndex = movedElement.data("owner-index");
              var top = ui.position.top + "px";
              var left = ui.position.left + "px";

              movedElement.css('cursor', 'default');
              model.set("_game.players." + playerIndex + ".cards." + cardIndex + ".position", { top: top, left: left });
            }
    });
  });

  model.on('set', '_game.players.*.cards.*.position', function(playerIndex, cardIndex, position) {
    console.log("Player " + playerIndex + ", Card ", cardIndex, " to position " + position.top + ", " + position.left);
    var domId = model.get('_game.players.' + playerIndex + '.cards.' + cardIndex + '.domId');
    var element = jQuery("#" + domId);

    element.css('left', position.left);
    element.css('top', position.top);
    jQuery(".card").css('z-index', 0);
    element.css('z-index', 1);
  });

  model.setNull('_player.nextCardIndex', 0);

  model.push('_player.cards', { "thumbnail-url": "http://s3.amazonaws.com/ledwards-swccgvkit-production/card_images/744/thumbnail.gif",
                                domId: model.get('_player.name').replace(" ", "_") + "-card" + model.get('_player.nextCardIndex'),
                                ownerIndex: model.get('_game.players').indexOf(model.get('_player')),
                                cardIndex: model.get('_player.nextCardIndex'),
                                position: { top: "0px", left: "0px" }
                              });
  model.incr('_player.nextCardIndex');

  model.push('_player.cards', { "thumbnail-url": "http://s3.amazonaws.com/ledwards-swccgvkit-production/card_images/745/thumbnail.gif",
                                domId: model.get('_player.name').replace(" ", "_") + "-card" + model.get('_player.nextCardIndex'),
                                ownerIndex: model.get('_game.players').indexOf(model.get('_player')),
                                cardIndex: model.get('_player.nextCardIndex'),
                                position: { top: "0px", left: "0px" }
                              });
  model.incr('_player.nextCardIndex');
});
