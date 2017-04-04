// Slot Jack (Black Jack meets Slot machines)
//
// One player against AI. There is a grid with 3 columns, 3 'fix' buttons and a roll button.
// When the roll button is clicked the 3 columns cycle through an array of 52 cards each.
// The cards are each worth as many points as it is written on them apart from
// K, Q, J that are worth 10 points and Aces worth 11.
// The goal of the game is for the player to gather a score of 21 points and to not exceed that.
// 3 Aces win automatically. (3 Aces of Spades trigger extra bonus?)
// Both player and AI have 3 rounds to achieve that.
// Once the player rolls, he has the option to fix a column in order to hold that option for the second and third rolls. The AI has no option of that, it just rolls.
//
// -------------------------------------------------------
//
// Player, AI and cards/card values need to be assigned with an array or object literate.
// Connect values with cards.
// Assign onclick button to loop through the three arrays and randomly choose 3 values.
// A for loop should work wonders in this case.
// Make those values appear in the html with txt and possibly string interpolation.
// When the player wants to fix a value a class of 'fixed' will be added to the column they want to fix.
// Clicking the button again removes the fixed class.
// If the column has a class of fixed && the player has rolls left they will be able to roll again.
// Not sure at this point how to restrict the player and AI to having 3 rolls each. Maybe a conditional statement?
// Render the roll and fix buttons inactive and remove 'fixed' class from columns when AI is rolling.
// If the player has rolled 3 times then it's the AI's turn.
// Then the score is calculated and a winner is decided.
// If player 1 score = 21 && > AI score then P1 wins, else if AI score = 21 && > P1 score, AI wins.
// else if player 1 score > 21 return loss, else tie.
// If player 1 || AI roll 3 Aces then it is a win else Aces = 11 points.

const values      = ['ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king'];
const suits       = ['hearts', 'diamonds', 'spades', 'clubs'];
const deck        = makeDeck();
let numberOfRolls = 3;
let $cards;
let $cardsToRoll;
let $rolls;
let $playerScore;
let $dealerScore;
let $message;
let $rollButton;
let $fixButtons;

// Function to run when the document has loaded
$(init);

// Initial function that sets up the game
function init() {
  // Find all of the relevant things from the DOM;
  $rolls       = $('.rolls');
  $cards       = $('.card'); // Cards container
  $playerScore = $('.playerScore');
  $dealerScore = $('.dealerScore');
  $message     = $('.message');
  $rollButton  = $('.roll');
  $fixButtons  = $('.fix');

  // Setup event listeners
  $rollButton.on('click', roll);
  $fixButtons.on('click', fix);
}

function reset() {
  $rollButton.hide();
  $fixButtons.hide();

  setTimeout(() => {
    numberOfRolls = 3;
    $playerScore.text('0');
    $dealerScore.text('0');
    $rolls.text(numberOfRolls);
    $message.html('<h2>Start playing!</h2>');
    $cards
    .removeClass('fixed')
    .css('background-image', 'none')
    .attr('data-image', '');

    $rollButton.show();
    $fixButtons.show();
  }, 5000);
}

function roll() {
  // Select all of the cards that have the class of '.card' but NOT the class
  // of '.fixed'
  $cardsToRoll = $('.card:not(.fixed)');
  // Loop through them and...
  for (let i = 0; i < $cardsToRoll.length; i++) {
    // Pick a random card value from the deck
    var random = deck[Math.floor(Math.random() * deck.length)];
    // Update the background-image of that specific card by fetching it out of the
    // array of cards and converting to a jQuery object so that we can use the
    // .css() method
    const $card = $($cardsToRoll[i]);
    // Set a data-attribute to remember the image
    $card.attr('data-image', random);
    // Update the background
    $card.css('background-image', `url('images/${random}.png')`);
  }

  // Calculate the score of all of the visible cards
  const score = calculateScore();

  // If there are 0 rolls left, this must mean that computer is playing
  if (numberOfRolls === 0) {
    $dealerScore.text(score);
    calculateWinner();
  } else {
    $playerScore.text(score);
    // Increment the counter
    counter();
  }
}

function fix() {
  // Find the corresponding card using the 'data-card' value that we added on
  // each of the fix buttons
  const $card = $(`.${$(this).data('card')}`);
  // Toggle (switch) the class of fixed on and off
  $card.toggleClass('fixed');
}

function ai() {
  $rollButton.hide();
  $fixButtons.hide();
  $message.html(`<h2>You got ${$playerScore.text()}. Dealer is dealing...</h2>`);

  setTimeout(() => {
    // Remove the fixed classes from the cards
    // and remove the background-image
    // remove data-attribute
    $cards
    .removeClass('fixed')
    .css('background-image', 'none')
    .attr('data-image', '');

    roll();
  }, 3000);
}

function counter() {
  // Decrease the number of rolls
  numberOfRolls--;
  // Update the text in the DOM
  $rolls.text(numberOfRolls);
  // If there are no more rolls left...
  if (numberOfRolls === 0) {
    ai();
  }
}

function calculateScore() {
  // Either computer or player...
  let score = 0;
  // Loop through all of the cards displayed
  for (let i = 0; i < $cards.length; i++) {
    // Get the card's background image
    const image = $($cards[i]).attr('data-image');
    // Try to get the value from the first number of the card
    // e.g. '10_of_hearts.png' => 10
    const value = parseInt(image);
    // If the value is not a numner, it means it has to be
    // ace, jack, queen or king
    if (isNaN(value)) {
      // Split the name where there is _
      // e.g. king_of_spades => ['king', 'of', 'spades']
      // Then take the first index
      const name = image.split('_')[0];
      switch (name) {
        case 'jack':
          score += 10;
          break;
        case 'queen':
          score += 10;
          break;
        case 'king':
          score += 10;
          break;
        case 'ace':
          if ((score + 11) > 21) {
            score += 1;
          } else {
            score += 11;
          }
          break;
      }
    } else {
      score += value;
    }
  }
  return score;
}

function calculateWinner() {
  // Display the correct message
  if ($playerScore.text() > 21) {
    $message.html('<h2>You\'re bust! House wins!</h2>');
  } else if ($dealerScore.text() > 21) {
    $message.html('<h2>Dealer is bust! Player wins!</h2>');
  } else if ($dealerScore.text() >= $playerScore.text()) {
    $message.html('<h2>House wins!</h2>');
  } else {
    $message.html('<h2>Player wins!</h2>');
  }
  // Reset the game
  reset();
}

function makeDeck() {
  // Create an empty array
  const deck = [];
  //
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < suits.length; j++) {
      deck.push(`${values[i]}_of_${suits[j]}`);
    }
  }
  return deck;
}
