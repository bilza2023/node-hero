// /controllers/playerController.js
const path = require('path');
const DeckBuilder = require('../player/deckbuilder/Deckbuilder');
const { defineDeck } = require('../player/deck');

function showPlayer(req, res) {
  const builder = new DeckBuilder();
  defineDeck(builder);              // fills the builder
  const deck = builder.build();     // extracts the full JSON

  const firstSlide = deck.deck;  // just to verify rendering
  res.render(path.join('..', 'player', 'views', 'index'), { deck: firstSlide });
}

module.exports = { showPlayer };
