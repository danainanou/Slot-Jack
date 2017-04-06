var sj = sj || {};

sj.values      = ['ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king'];
sj.suits       = ['hearts', 'diamonds', 'spades', 'clubs'];
sj.numberOfRolls = 3;
sj.$cards;
sj.$cardsToRoll;
sj.$rolls;
sj.$playerScore;
sj.$dealerScore;
sj.$message;
sj.$rollButton;
sj.$fixButtons;
sj.leftInPot = 100;
sj.$playerPot;
sj.$howToButton;
sj.roll;

sj.init = function init() {
  sj.$rolls       = $('.rolls');
  sj.$cards       = $('.card');
  sj.$playerScore = $('.playerScore');
  sj.$dealerScore = $('.dealerScore');
  sj.$playerPot   = $('.playerPot');
  sj.$message     = $('.message');
  sj.$rollButton  = $('.roll');
  sj.$fixButtons  = $('.fix');
  sj.$howToButton = $('.how-to');
  sj.$rollButton.on('click', sj.roll);
  sj.$fixButtons.on('click', sj.fix);
  sj.$howToButton.on('click', sj.howToSJ);
};

sj.makeDeck = function() {
  // Create an empty array
  const deck = [];
  //
  for (let i = 0; i < sj.values.length; i++) {
    for (let j = 0; j < sj.suits.length; j++) {
      deck.push(`${sj.values[i]}_of_${sj.suits[j]}`);
    }
  }
  return deck;
};

sj.deck = sj.makeDeck();

sj.roll = function roll() {
  sj.$cardsToRoll = $('.card:not(.fixed)');
  for (let i = 0; i < sj.$cardsToRoll.length; i++) {
    const cardAnimationInterval = setInterval(() => {
      const random = sj.deck[Math.floor(Math.random() * sj.deck.length)];
      const $card = $(sj.$cardsToRoll[i]);
      $card.css('background-image', `url('images/${random}.png')`);
      const audio = new Audio('./sounds/shuffle.wav');
      audio.play();
    }, 50);

    setTimeout(() => {
      clearInterval(cardAnimationInterval);
      const random = sj.deck[Math.floor(Math.random() * sj.deck.length)];
      const $card = $(sj.$cardsToRoll[i]);
      $card.attr('data-image', random);
      $card.css('background-image', `url('images/${random}.png')`);
    }, 1000);
  }

  setTimeout(() => {
    const score = sj.calculateScore();
    if (sj.numberOfRolls === 0) {
      sj.$dealerScore.text(score);
      sj.calculateWinner();
    } else {
      sj.$playerScore.text(score);
      sj.counter();
    }
  }, 1100);
};



sj.popUp = function popUp(hideOrshow) {
  if (hideOrshow === 'hide') document.getElementById('ac-wrapper').style.display = 'none';
  else document.getElementById('ac-wrapper').removeAttribute('style');
};
window.onload = function() {
  setTimeout(function() {
    sj.popUp('show');
  }, 1000);
};

sj.howToSJ = function howToSJ(hideOrshow) {
  if (hideOrshow === 'hide') document.getElementById('howtoplay').style.display = 'none';
  else document.getElementById('howtoplay').removeAttribute('style');
  const audio = new Audio('./sounds/howtopopup.wav');
  audio.play();
};

sj.reset = function reset() {
  sj.$rollButton.hide();
  sj.$fixButtons.hide();

  setTimeout(() => {
    sj.numberOfRolls = 3;
    sj.$playerScore.text('0');
    sj.$dealerScore.text('0');
    sj.$rolls.text(sj.numberOfRolls);
    sj.$message.html('<h2>Start playing!</h2>');
    sj.$cards
    .removeClass('fixed')
    .css('background-image', 'none')
    .attr('data-image', '');

    sj.$rollButton.show();
    sj.$fixButtons.show();
  }, 5000);
};

sj.fix = function fix() {
  const $card = $(`.${$(this).data('card')}`);
  $card.toggleClass('fixed');
  const audio = new Audio('./sounds/fix.wav');
  audio.play();
};

sj.ai = function ai() {
  sj.$rollButton.hide();
  sj.$fixButtons.hide();
  sj.$message.html(`<h2>You got ${sj.$playerScore.text()}. Dealer is dealing...</h2>`);

  setTimeout(() => {
    sj.$cards
    .removeClass('fixed')
    .css('background-image', 'none')
    .attr('data-image', '');

    sj.roll();
  }, 3000);
};


sj.counter = function counter() {
  sj.numberOfRolls--;
  sj.$rolls.text(sj.numberOfRolls);
  if (sj.numberOfRolls === 0) {
    sj.ai();
  }
};

sj.calculateScore = function calculateScore() {
  let score = 0;
  for (let i = 0; i < sj.$cards.length; i++) {
    const image = $(sj.$cards[i]).attr('data-image');
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
  if (sj.$playerScore.text() > 21) {
    sj.leftInPot = sj.leftInPot-10;
    sj.$playerPot.text(sj.leftInPot);
    sj.$message.html('<h2>You\'re bust! House wins!</h2>');
  } else if (sj.$dealerScore.text() > 21) {
    sj.leftInPot = sj.leftInPot+10;
    sj.$playerPot.text(sj.leftInPot);
    sj.$message.html('<h2>Dealer is bust! Player wins!</h2>');
  } else if (sj.$dealerScore.text() > sj.$playerScore.text()) {
    sj.leftInPot = sj.leftInPot-10;
    sj.$playerPot.text(sj.leftInPot);
    sj.$message.html('<h2>House wins!</h2>');
  } else {
    sj.leftInPot = sj.leftInPot+10;
    sj.$playerPot.text(sj.leftInPot);
    sj.$message.html('<h2>Player wins!</h2>');
  }
  sj.reset();
};



$(sj.init.bind(sj));
