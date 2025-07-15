// /controllers/playerController.js :contentReference[oaicite:0]{index=0}
const path = require('path');
const DeckBuilder = require('../player/deckbuilder/Deckbuilder');
const { defineDeck } = require('../player/deck');

function showPlayer(req, res) {
  // 1. Build the deck
  const builder = new DeckBuilder();
  defineDeck(builder);
  const fullDeck = builder.build();

  // 2. Extract the slides array
  const deck = fullDeck.deck;
  console.log('🚀 deck (server):', deck);

  // 3. Render the player index — Express is already set up
  //    to look in player/views, so this works:
  res.render('index', { fullDeck });
}

module.exports = { showPlayer };
