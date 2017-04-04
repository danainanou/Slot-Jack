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

const cardValues = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
let $cards;
let count = 0;
const player1 = '';
// const ai = '';

// Function to run when the document has loaded
$(init);

// Initial function that sets up the game
function init() {
  // Setup event listeners
  $('.roll').on('click', roll);
  $('.roll').on('click', counter);
  $('.fix').on('click', fix);
}

function roll() {
  // Select all of the cards that have the class of '.card' but NOT the class
  // of '.fixed'
  $cards = $('.card:not(.fixed)');
  // Loop through them and...
  for (let i = 0; i < $cards.length; i++) {
    // Pick a random card value from the list of card values
    var random = cardValues[Math.floor(Math.random() * cardValues.length)];
    // Add it to the html of that specific card by fetching it out of the
    // array of card
    $($cards[i]).html(random);
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
  $('.card').removeClass('fixed');
  $('.roll').off;
  $('.fix').off;
  
}

function counter() {
  count++;
  if (count % 4 === 0) {
    alert('Player 2\'s turn now!');
    ai();
  }
}
// var cardValues = [
//   { name: 'A', image: 'ace_of_spades.png'},
//   { name: 'K', image: 'king_of_spades.png'},
//   { name: 'Q', image: 'queen_of_spades.png'},
//   { name: 'J', image: 'jack_of_spades.png'},
//   { name: '10', image: '10_of_spades.png'},
//   { name: '9', image: '9_of_spades.png'},
//   { name: '8', image: '8_of_spades.png'},
//   { name: '7', image: '7_of_spades.png'},
//   { name: '6', image: '6_of_spades.png'},
//   { name: '5', image: '5_of_spades.png'},
//   { name: '4', image: '4_of_spades.png'},
//   { name: '3', image: '3_of_spades.png'},
//   { name: '2', image: '2_of_spades.png'}
// ];
// + '<img src=''+cardValues.image+''>'
//
// ace = new Image();
// ace.src = 'ace_of_spades.png';
// king = new Image();
// king.src = 'king_of_spades.png';
// queen = new Image();
// queen.src = 'queen_of_spades.png';
// jack = new Image();
// jack.src = 'jack_of_spades.png';
// ten = new Image();
// ten.src = 'ten_of_spades.png';
// nine = new Image();
// nine.src = 'nine_of_spades.png';
// eight = new Image();
// eight.src = 'eight_of_spades.png';
// seven = new Image();
// seven.src = 'seven_of_spades.png';
// six = new Image();
// six.src = 'six_of_spades.png';
// five = new Image();
// five.src = 'five_of_spades.png';
// four = new Image();
// four.src = 'four_of_spades.png';
// three = new Image();
// three.src = 'three_of_spades.png';
// two = new Image();
// two.src = 'two_of_spades.png';
//
// const cardValues = {
//   'A' : ace,
//   'K' : king,
// 'Q' : queen, 'J' : jack, 10 : ten, 9 : nine, 8 : eight, 7 : seven, 6 : six, 5 : five, 4 : four, 3 : three, 2 : two}
