const values      = ['ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king'];
const suits       = ['hearts', 'diamonds', 'spades', 'clubs'];
const deck        = makeDeck();
let numberOfRolls = 3;
let $cards;
let $cardsToRoll;
let $rolls;
let $playerScore;
let $dealerScore;
let leftInPot = 100;
let $playerPot;
let $message;
let $rollButton;
let $fixButtons;
let $howToButton;

// Function to run when the document has loaded
$(init);

// Initial function that sets up the game
function init() {
  // Find all of the relevant things from the DOM;
  $rolls       = $('.rolls');
  $cards       = $('.card'); // Cards container
  $playerScore = $('.playerScore');
  $dealerScore = $('.dealerScore');
  $playerPot   = $('.playerPot');
  $message     = $('.message');
  $rollButton  = $('.roll');
  $fixButtons  = $('.fix');
  $howToButton = $('.how-to');

  // Setup event listeners
  $rollButton.on('click', roll);
  $fixButtons.on('click', fix);
  $howToButton.on('click', howToSJ);
}

function popUp(hideOrshow) {
  if (hideOrshow === 'hide') document.getElementById('ac-wrapper').style.display = 'none';
  else document.getElementById('ac-wrapper').removeAttribute('style');
}
window.onload = function() {
  setTimeout(function() {
    popUp('show');
  }, 1000);
};

function howToSJ(hideOrshow) {
  if (hideOrshow === 'hide') document.getElementById('howtoplay').style.display = 'none';
  else document.getElementById('howtoplay').removeAttribute('style');
  var audio = new Audio('./sounds/howtopopup.wav');
  audio.play();
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

    // Create a recurring setInterval to change the background of the cards
    // every 50 milliseconds
    const cardAnimationInterval = setInterval(() => {
      const random = deck[Math.floor(Math.random() * deck.length)];
      const $card = $($cardsToRoll[i]);
      $card.css('background-image', `url('images/${random}.png')`);
      var audio = new Audio('./sounds/shuffle.wav');
      audio.play();
    }, 50);

    // Create a setTimeout to run after 1 second
    setTimeout(() => {
      // Stop the previous interval from running...
      clearInterval(cardAnimationInterval);

      // Pick a random card value from the deck
      const random = deck[Math.floor(Math.random() * deck.length)];
      // Update the background-image of that specific card by fetching it out of the
      // array of cards and converting to a jQuery object so that we can use the
      // .css() method
      const $card = $($cardsToRoll[i]);
      // Set a data-attribute to remember the image
      $card.attr('data-image', random);
      // Update the background
      $card.css('background-image', `url('images/${random}.png')`);
    }, 1000);
  }

  // Needs to be in a setTimout or else this code will run BEFORE the
  // previous setTimeout finishes
  setTimeout(() => {
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
  }, 1100);
}

function fix() {
  // Find the corresponding card using the 'data-card' value that we added on
  // each of the fix buttons
  const $card = $(`.${$(this).data('card')}`);
  // Toggle (switch) the class of fixed on and off
  $card.toggleClass('fixed');
  var audio = new Audio('./sounds/fix.wav');
  audio.play();
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
    leftInPot = leftInPot-10;
    $playerPot.text(leftInPot);
    $message.html('<h2>You\'re bust! House wins!</h2>');
  } else if ($dealerScore.text() > 21) {
    leftInPot = leftInPot+10;
    $playerPot.text(leftInPot);
    $message.html('<h2>Dealer is bust! Player wins!</h2>');
  } else if ($dealerScore.text() > $playerScore.text()) {
    leftInPot = leftInPot-10;
    $playerPot.text(leftInPot);
    $message.html('<h2>House wins!</h2>');
  } else {
    leftInPot = leftInPot+10;
    $playerPot.text(leftInPot);
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
