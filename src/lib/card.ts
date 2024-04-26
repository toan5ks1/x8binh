import ten_of_clubs from '../../assets/cards/10_of_clubs.png';
import ten_of_diamonds from '../../assets/cards/10_of_diamonds.png';
import ten_of_hearts from '../../assets/cards/10_of_hearts.png';
import ten_of_spades from '../../assets/cards/10_of_spades.png';
import two_of_clubs from '../../assets/cards/2_of_clubs.png';
import two_of_diamonds from '../../assets/cards/2_of_diamonds.png';
import two_of_hearts from '../../assets/cards/2_of_hearts.png';
import two_of_spades from '../../assets/cards/2_of_spades.png';
import three_of_clubs from '../../assets/cards/3_of_clubs.png';
import three_of_diamonds from '../../assets/cards/3_of_diamonds.png';
import three_of_hearts from '../../assets/cards/3_of_hearts.png';
import three_of_spades from '../../assets/cards/3_of_spades.png';
import four_of_clubs from '../../assets/cards/4_of_clubs.png';
import four_of_diamonds from '../../assets/cards/4_of_diamonds.png';
import four_of_hearts from '../../assets/cards/4_of_hearts.png';
import four_of_spades from '../../assets/cards/4_of_spades.png';
import five_of_clubs from '../../assets/cards/5_of_clubs.png';
import five_of_diamonds from '../../assets/cards/5_of_diamonds.png';
import five_of_hearts from '../../assets/cards/5_of_hearts.png';
import five_of_spades from '../../assets/cards/5_of_spades.png';
import six_of_clubs from '../../assets/cards/6_of_clubs.png';
import six_of_diamonds from '../../assets/cards/6_of_diamonds.png';
import six_of_hearts from '../../assets/cards/6_of_hearts.png';
import six_of_spades from '../../assets/cards/6_of_spades.png';
import seven_of_clubs from '../../assets/cards/7_of_clubs.png';
import seven_of_diamonds from '../../assets/cards/7_of_diamonds.png';
import seven_of_hearts from '../../assets/cards/7_of_hearts.png';
import seven_of_spades from '../../assets/cards/7_of_spades.png';
import eight_of_clubs from '../../assets/cards/8_of_clubs.png';
import eight_of_diamonds from '../../assets/cards/8_of_diamonds.png';
import eight_of_hearts from '../../assets/cards/8_of_hearts.png';
import eight_of_spades from '../../assets/cards/8_of_spades.png';
import nine_of_clubs from '../../assets/cards/9_of_clubs.png';
import nine_of_diamonds from '../../assets/cards/9_of_diamonds.png';
import nine_of_hearts from '../../assets/cards/9_of_hearts.png';
import nine_of_spades from '../../assets/cards/9_of_spades.png';
import ace_of_clubs from '../../assets/cards/ace_of_clubs.png';
import ace_of_diamonds from '../../assets/cards/ace_of_diamonds.png';
import ace_of_hearts from '../../assets/cards/ace_of_hearts.png';
import ace_of_spades from '../../assets/cards/ace_of_spades.png';
import jack_of_clubs from '../../assets/cards/jack_of_clubs.png';
import jack_of_diamonds from '../../assets/cards/jack_of_diamonds.png';
import jack_of_hearts from '../../assets/cards/jack_of_hearts.png';
import jack_of_spades from '../../assets/cards/jack_of_spades.png';
import king_of_clubs from '../../assets/cards/king_of_clubs.png';
import king_of_diamonds from '../../assets/cards/king_of_diamonds.png';
import king_of_hearts from '../../assets/cards/king_of_hearts.png';
import king_of_spades from '../../assets/cards/king_of_spades.png';
import queen_of_clubs from '../../assets/cards/queen_of_clubs.png';
import queen_of_diamonds from '../../assets/cards/queen_of_diamonds.png';
import queen_of_hearts from '../../assets/cards/queen_of_hearts.png';
import queen_of_spades from '../../assets/cards/queen_of_spades.png';

const cardImages: { [key: string]: string } = {
  '2_of_spades': two_of_spades,
  '2_of_clubs': two_of_clubs,
  '2_of_diamonds': two_of_diamonds,
  '2_of_hearts': two_of_hearts,
  '3_of_hearts': three_of_hearts,
  '3_of_spades': three_of_spades,
  '3_of_clubs': three_of_clubs,
  '3_of_diamonds': three_of_diamonds,
  '4_of_spades': four_of_spades,
  '4_of_hearts': four_of_hearts,
  '4_of_clubs': four_of_clubs,
  '4_of_diamonds': four_of_diamonds,
  '5_of_spades': five_of_spades,
  '5_of_hearts': five_of_hearts,
  '5_of_clubs': five_of_clubs,
  '5_of_diamonds': five_of_diamonds,
  '6_of_spades': six_of_spades,
  '6_of_hearts': six_of_hearts,
  '6_of_clubs': six_of_clubs,
  '6_of_diamonds': six_of_diamonds,
  '7_of_spades': seven_of_spades,
  '7_of_hearts': seven_of_hearts,
  '7_of_clubs': seven_of_clubs,
  '7_of_diamonds': seven_of_diamonds,
  '8_of_spades': eight_of_spades,
  '8_of_hearts': eight_of_hearts,
  '8_of_clubs': eight_of_clubs,
  '8_of_diamonds': eight_of_diamonds,
  '9_of_spades': nine_of_spades,
  '9_of_hearts': nine_of_hearts,
  '9_of_clubs': nine_of_clubs,
  '9_of_diamonds': nine_of_diamonds,
  '10_of_spades': ten_of_spades,
  '10_of_hearts': ten_of_hearts,
  '10_of_clubs': ten_of_clubs,
  '10_of_diamonds': ten_of_diamonds,
  jack_of_spades: jack_of_spades,
  jack_of_hearts: jack_of_hearts,
  jack_of_clubs: jack_of_clubs,
  jack_of_diamonds: jack_of_diamonds,
  queen_of_spades: queen_of_spades,
  queen_of_hearts: queen_of_hearts,
  queen_of_clubs: queen_of_clubs,
  queen_of_diamonds: queen_of_diamonds,
  king_of_spades: king_of_spades,
  king_of_hearts: king_of_hearts,
  king_of_clubs: king_of_clubs,
  king_of_diamonds: king_of_diamonds,
  ace_of_spades: ace_of_spades,
  ace_of_hearts: ace_of_hearts,
  ace_of_clubs: ace_of_clubs,
  ace_of_diamonds: ace_of_diamonds,
};
//Hit club
// const getCardImageUrl = (cardNumber: number): string => {
//   const suits = ['hearts', 'diamonds', 'clubs', 'spades']; // Adjusted suits order
//   const ranks = [
//     '2',
//     '3',
//     '4',
//     '5',
//     '6',
//     '7',
//     '8',
//     '9',
//     '10',
//     'jack',
//     'queen',
//     'king',
//     'ace',
//   ];

//   if (cardNumber < 1 || cardNumber > 52) {
//     throw new Error('Card number must be between 1 and 52.');
//   }

//   cardNumber -= 1;

//   const suit = suits[Math.floor(cardNumber / 13)];
//   const rank = ranks[cardNumber % 13];
//   const key = `${rank}_of_${suit}` as keyof typeof cardImages;

//   return cardImages[key];
// };

const getCardImageUrl = (cardNumber: number): string => {
  const suits = ['spades', 'clubs', 'diamonds', 'hearts'];
  const ranks = [
    'ace',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'jack',
    'queen',
    'king',
  ];

  if (cardNumber < 0 || cardNumber > 51) {
    throw new Error('Card number must be between 0 and 51.');
  }

  const suitIndex = cardNumber % 4;
  const rankIndex = Math.floor(cardNumber / 4);
  const key =
    `${ranks[rankIndex]}_of_${suits[suitIndex]}` as keyof typeof cardImages;

  return cardImages[key];
};

export { getCardImageUrl };
