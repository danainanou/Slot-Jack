var sj = sj || {};

sj.values      = ['ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king'];
sj.suits       = ['hearts', 'diamonds', 'spades', 'clubs'];
// const deck        = makeDeck();
let numberOfRolls = 3;
let $cards;
let $cardsToRoll;
let $rolls;
let $playerScore;
let $dealerScore;
let $message;
let $rollButton;
let $fixButtons;

// $(init);

sj.init = function init() {
  $rolls       = $('.rolls');
  $cards       = $('.card');
  $playerScore = $('.playerScore');
  $dealerScore = $('.dealerScore');
  $message     = $('.message');
  $rollButton  = $('.roll');
  $fixButtons  = $('.fix');
  $rollButton.on('click', sj.roll);
  $fixButtons.on('click', sj.fix);
};

sj.deck = function makeDeck() {
  const deck = [];
  for (let i = 0; i < sj.values.length; i++) {
    for (let j = 0; j < sj.suits.length; j++) {
      deck.push(`${sj.values[i]}_of_${sj.suits[j]}`);
    }
  }
  return deck;
};

sj.reset = function reset() {
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
};

sj.roll = function roll() {
  $cardsToRoll = $('.card:not(.fixed)');
  for (let i = 0; i < $cardsToRoll.length; i++) {
    const cardAnimationInterval = setInterval(() => {
      const random = sj.deck[Math.floor(Math.random() * sj.deck.length)];
      const $card = $($cardsToRoll[i]);
      $card.css('background-image', `url('images/${random}.png')`);
    }, 50);

    setTimeout(() => {
      clearInterval(cardAnimationInterval);
      const random = sj.deck[Math.floor(Math.random() * sj.deck.length)];
      const $card = $($cardsToRoll[i]);
      $card.attr('data-image', random);
      $card.css('background-image', `url('images/${random}.png')`);
    }, 1000);
  }

  setTimeout(() => {
    const score = sj.calculateScore();
    if (numberOfRolls === 0) {
      $dealerScore.text(score);
      sj.calculateWinner();
    } else {
      $playerScore.text(score);
      sj.counter();
    }
  }, 1100);
};

sj.fix = function fix() {
  const $card = $(`.${$(this).data('card')}`);
  $card.toggleClass('fixed');
};

sj.ai = function ai() {
  $rollButton.hide();
  $fixButtons.hide();
  $message.html(`<h2>You got ${$playerScore.text()}. Dealer is dealing...</h2>`);

  setTimeout(() => {
    $cards
    .removeClass('fixed')
    .css('background-image', 'none')
    .attr('data-image', '');

    sj.roll();
  }, 3000);
};

sj.counter = function counter() {
  numberOfRolls--;
  $rolls.text(numberOfRolls);
  if (numberOfRolls === 0) {
    sj.ai();
  }
};

sj.calculateScore = function calculateScore() {
  let score = 0;
  for (let i = 0; i < $cards.length; i++) {
    const image = $($cards[i]).attr('data-image');
    const value = parseInt(image);
    if (isNaN(value)) {
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
};

sj.calculateWinner = function calculateWinner() {
  if ($playerScore.text() > 21) {
    $message.html('<h2>You\'re bust! House wins!</h2>');
  } else if ($dealerScore.text() > 21) {
    $message.html('<h2>Dealer is bust! Player wins!</h2>');
  } else if ($dealerScore.text() >= $playerScore.text()) {
    $message.html('<h2>House wins!</h2>');
  } else {
    $message.html('<h2>Player wins!</h2>');
  }
  sj.reset();
};

$(sj.init.bind(sj));
