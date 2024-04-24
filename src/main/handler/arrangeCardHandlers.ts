import { ipcMain } from 'electron';

function isStraightFlush(hand: any) {
  return isStraight(hand) && isFlush(hand);
}

// Hàm kiểm tra Tứ quý (Four of a Kind)
function isFourOfAKind(hand: any) {
  const values = hand.map((card: number) => ((card - 1) % 13) + 2);
  const frequency = values.reduce(
    (acc: { [x: string]: any }, value: string | number) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    },
    {}
  );
  return Object.values(frequency).some((count) => count === 4);
}

// Hàm kiểm tra Thùng (Flush)
function isFlush(hand: any[]) {
  const suits = hand.map((card) => Math.floor((card - 1) / 13));
  return suits.every((suit) => suit === suits[0]);
}

// Hàm kiểm tra Sảnh (Straight)
function isStraight(hand: any[]) {
  const values = hand
    .map((card) => ((card - 1) % 13) + 2)
    .sort((a, b) => a - b);
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i + 1] - values[i] !== 1) {
      return false;
    }
  }
  return true;
}

// Hàm kiểm tra Sám cô (Three of a Kind)
function isThreeOfAKind(hand: any) {
  const values = hand.map((card: number) => ((card - 1) % 13) + 2);
  const frequency = values.reduce(
    (acc: { [x: string]: any }, value: string | number) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    },
    {}
  );
  return Object.values(frequency).some((count) => count === 3);
}

// Hàm kiểm tra Full house
function isFullHouse(hand: any) {
  const values = hand.map((card: number) => ((card - 1) % 13) + 2);
  const frequency = values.reduce(
    (acc: { [x: string]: any }, value: string | number) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    },
    {}
  );
  const counts = Object.values(frequency);
  return counts.includes(3) && counts.includes(2);
}

// Hàm kiểm tra Đôi (Pair)
function isPair(hand: any) {
  const values = hand.map((card: number) => ((card - 1) % 13) + 2);
  const frequency = values.reduce(
    (acc: { [x: string]: any }, value: string | number) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    },
    {}
  );
  return Object.values(frequency).some((count) => count === 2);
}

function findBestHand(cards: any) {
  let bestHands: any = null;
  let bestScore = 0;

  function checkCombination(chi1: any, chi2: any, chi3: any) {
    const score1 = evaluateHand(chi1).score;
    const score2 = evaluateHand(chi2).score;
    const score3 = evaluateHand(chi3).score;
    const totalScore = score1 + score2 + score3;

    if (
      totalScore > bestScore ||
      (totalScore === bestScore && score1 > (bestHands ? bestHands.score1 : 0))
    ) {
      bestScore = totalScore;
      bestHands = { chi1, chi2, chi3, score1, score2, score3 };
    }
  }

  function generateHands(
    index: any,
    chi1 = [] as any,
    chi2 = [] as any,
    chi3 = [] as any
  ) {
    if (index === cards.length) {
      if (chi1.length === 5 && chi2.length === 5 && chi3.length === 3) {
        checkCombination(chi1, chi2, chi3);
      }
      return;
    }

    const card = cards[index];
    if (chi1.length < 5) {
      generateHands(index + 1, [...chi1, card], chi2, chi3);
    }
    if (chi2.length < 5) {
      generateHands(index + 1, chi1, [...chi2, card], chi3);
    }
    if (chi3.length < 3) {
      generateHands(index + 1, chi1, chi2, [...chi3, card]);
    }
  }

  cards.sort((a: number, b: number) => a - b);
  generateHands(0);

  return bestHands;
}

function evaluateHand(hand: any) {
  if (isStraightFlush(hand)) return { score: 100, name: 'Thùng phá sảnh' };
  if (isFourOfAKind(hand)) return { score: 80, name: 'Tứ quý' };
  if (isFlush(hand)) return { score: 60, name: 'Thùng' };
  if (isStraight(hand)) return { score: 50, name: 'Sảnh' };
  if (isThreeOfAKind(hand)) return { score: 40, name: 'Sám cô' };
  if (isFullHouse(hand)) return { score: 70, name: 'Full house' };
  if (isPair(hand)) return { score: 20, name: 'Đôi' };
  return { score: 10, name: 'Mậu thầu' };
}

function findBestDivision(cards: any) {
  // Sắp xếp các lá bài từ nhỏ đến lớn
  cards.sort((a: number, b: number) => a - b);

  // Chọn chi 1 là mạnh nhất dựa trên tiêu chí nào đó
  let chi1 = cards.slice(8, 13);
  let chi2 = cards.slice(3, 8);
  let chi3 = cards.slice(0, 3);

  // Đảm bảo chi 1 là mạnh nhất bằng cách sắp xếp
  chi1.sort((a: number, b: number) => b - a);

  return { chi1, chi2, chi3 };
}

function simpleSort(cards: any) {
  cards.sort((a: number, b: number) => ((a - 1) % 13) - ((b - 1) % 13));

  let chi1 = [],
    chi2 = [],
    chi3 = [];

  chi1 = cards.slice(8, 13);
  chi2 = cards.slice(3, 8);
  chi3 = cards.slice(0, 3);

  return findBestDivision(cards);
}

function displaySortedHands(cards: any) {
  const sorted = findBestHand(cards);

  const chi1Evaluation = evaluateHand(sorted.chi1);
  const chi2Evaluation = evaluateHand(sorted.chi2);
  const chi3Evaluation = evaluateHand(sorted.chi3);
  return {
    cards: sorted.chi1.concat(sorted.chi2, sorted.chi3),
    chi1: chi1Evaluation,
    chi2: chi2Evaluation,
    chi3: chi3Evaluation,
  };
}
export const setupArrangeCardHandlers = () => {
  ipcMain.on('arrange-card', (event, input, position) => {
    console.log('card:', input);
    console.log('position:', position);
    const cards = input
      .join(', ')
      .split(',')
      .map(Number)
      .filter((card: number) => card >= 1 && card <= 52);
    if (cards.length !== 13) {
      console.log('Bạn cần nhập đúng 13 số, mỗi số từ 1 đến 52.');
      event.reply('arrange-card', {
        error: 'Bạn cần nhập đúng 13 số, mỗi số từ 1 đến 52.',
      });
    }

    const result = displaySortedHands(cards);
    event.reply('arrange-card', result, position);
  });
};
