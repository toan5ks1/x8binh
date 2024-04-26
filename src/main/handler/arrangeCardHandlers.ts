import { ipcMain } from 'electron';

const RANKS = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
];
const SUITS = ['♠', '♣', '♦', '♥'];
const CARDS = [
  'A♠', // 0: A bích
  'A♣', // 1: Þt chuồn
  'A♦', // 2: Þt rô
  'A♥', // 3: Þt cơ
  '2♠', // 4: 2 bích
  '2♣', // 5: 2 chuồn
  '2♦', // 6: 2 rô
  '2♥', // 7: 2 cơ
  '3♠', // 8: 3 bích
  '3♣', // 9: 3 chuồn
  '3♦', // 10: 3 rô
  '3♥', // 11: 3 cơ
  '4♠',
  '4♣',
  '4♦',
  '4♥',
  '5♠',
  '5♣',
  '5♦',
  '5♥',
  '6♠',
  '6♣',
  '6♦',
  '6♥',
  '7♠',
  '7♣',
  '7♦',
  '7♥',
  '8♠',
  '8♣',
  '8♦',
  '8♥',
  '9♠',
  '9♣',
  '9♦',
  '9♥',
  '10♠',
  '10♣',
  '10♦',
  '10♥',
  'J♠',
  'J♣',
  'J♦',
  'J♥',
  'Q♠',
  'Q♣',
  'Q♦',
  'Q♥',
  'K♠',
  'K♣',
  'K♦',
  'K♥',
];

function convertToDefaultType(cards: any) {
  return cards.map((card: any) => {
    return CARDS.findIndex((value) => value == card);
  });
}

function sortCardsForChinesePoker(cards: any) {
  // Hàm phụ trợ để phân loại bài
  function classifyCards(cards: any) {
    let ranks = {} as any;
    let suits = {} as any;
    cards.forEach((card: any) => {
      let rank = card.substring(0, card.length - 1);
      let suit = card[card.length - 1];
      if (!ranks[rank]) ranks[rank] = [];
      if (!suits[suit]) suits[suit] = [];
      ranks[rank].push(card);
      suits[suit].push(card);
    });
    //sort ranks by RANKS order and suits by SUITS order
    ranks = Object.keys(ranks)
      .sort((a, b) => RANKS.indexOf(a) - RANKS.indexOf(b))
      .reduce((obj: any, key) => {
        obj[key] = ranks[key];
        return obj;
      }, {});
    //sort suits by SUITS order
    suits = Object.keys(suits)
      .sort((a, b) => SUITS.indexOf(a) - SUITS.indexOf(b))
      .reduce((obj: any, key) => {
        obj[key] = suits[key];
        return obj;
      }, {});

    //sort cards by RANKS order inside each suit
    for (let suit in suits) {
      suits[suit] = suits[suit].sort((a: string, b: string) => {
        return (
          RANKS.indexOf(a.substring(0, a.length - 1)) -
          RANKS.indexOf(b.substring(0, b.length - 1))
        );
      });
    }

    return { ranks, suits };
  }

  // Hàm tìm và lấy bộ
  function findCombination(ranks, suits) {
    let combinations = [];

    // Tìm tứ quý, cù lũ, sảnh, thùng, Sám cô, đôi
    for (let rank in ranks) {
      if (ranks[rank].length === 4) {
        combinations.push({ type: 'Tứ Quý', cards: ranks[rank] });
      }
      if (ranks[rank].length === 3) {
        combinations.push({ type: 'Sám cô', cards: ranks[rank] });
      }
      // if (ranks[rank].length === 2) {
      //   combinations.push({ type: "Đôi", cards: ranks[rank] });
      // }
      //sort theo thứ tự ["Đôi", "Sám cô", "Tứ Quý"]
    }

    //tìm nhiều đôi nhất (1 đôi). Trong 1 trường hợp có tứ quý, sẽ có 4 combinations đôi được tạo ra
    for (let rank in ranks) {
      if (ranks[rank].length >= 2) {
        for (let i = 0; i < ranks[rank].length - 1; i++) {
          for (let j = i + 1; j < ranks[rank].length; j++) {
            combinations.push({
              type: 'Đôi',
              cards: [ranks[rank][i], ranks[rank][j]],
            });
          }
        }
      }
    }

    //tìm nhiều sảnh nhất
    for (let i = 0; i < RANKS.length - 4; i++) {
      let straight = [];
      let count = 0;
      for (let j = i; j < i + 5; j++) {
        if (ranks[RANKS[j]]) {
          straight.push(ranks[RANKS[j]][0]);
          count++;
        }
      }
      if (count === 5) {
        combinations.push({ type: 'Sảnh', cards: straight });
      }
    }

    //tìm nhiều thú nhất (2 đôi)
    for (let rank in ranks) {
      if (ranks[rank].length >= 2) {
        let rankPairs = [];
        for (let i = 0; i < ranks[rank].length - 1; i++) {
          for (let j = i + 1; j < ranks[rank].length; j++) {
            rankPairs.push([ranks[rank][i], ranks[rank][j]]);
          }
        }
        console.log(rankPairs);
        for (let rank2 in ranks) {
          if (ranks[rank2].length >= 2) {
            let rank2Pairs = [];
            for (let i = 0; i < ranks[rank2].length - 1; i++) {
              for (let j = i + 1; j < ranks[rank2].length; j++) {
                rank2Pairs.push([ranks[rank2][i], ranks[rank2][j]]);
              }
            }
            //conmpare 2 pairs from 2 ranks if not the same rank and not the same pair of cards push to combinations
            rankPairs.forEach((pair) => {
              rank2Pairs.forEach((pair2) => {
                //check if 2 pairs are not the same rank and not the same pair of cards
                if (
                  pair[0].substring(0, pair[0].length - 1) !==
                    pair2[0].substring(0, pair2[0].length - 1) &&
                  pair[1].substring(0, pair[1].length - 1) !==
                    pair2[1].substring(0, pair2[1].length - 1) &&
                  pair[0].substring(0, pair[0].length - 1) !==
                    pair2[1].substring(0, pair2[1].length - 1) &&
                  pair[1].substring(0, pair[1].length - 1) !==
                    pair2[0].substring(0, pair2[0].length - 1)
                ) {
                  combinations.push({
                    type: 'Thú',
                    cards: pair.concat(pair2),
                  });
                }
              });
            });
          }
        }
      }
    }

    //tìm nhiều cù lũ nhất (3 la cùng 1 rank và 2 la cùng 1 rank)
    for (let rank in ranks) {
      if (ranks[rank].length === 3) {
        for (let rank2 in ranks) {
          if (rank !== rank2 && ranks[rank2].length >= 2) {
            combinations.push({
              type: 'Cù Lũ',
              cards: ranks[rank].concat(ranks[rank2].slice(0, 2)),
            });
          }
        }
      }
    }

    //tìm nhiều thùng nhất
    for (let suit in suits) {
      let numOfCards = suits[suit].length;
      if (suits[suit].length >= 5) {
        combinations.push({ type: 'Thùng', cards: suits[suit].slice(0, 5) });
        numOfCards -= 5;
      }
      if (numOfCards >= 5) {
        combinations.push({ type: 'Thùng', cards: suits[suit].slice(5, 10) });
        numOfCards -= 5;
      }
    }

    //tim nhieu Thùng phá sảnh nhất (sảnh đồng chất) 5 lá tuần tự theo RANKS order và cùng 1 suit
    for (let suit in suits) {
      let straight = [];
      const suitRanksIndex = suits[suit].map((card) =>
        RANKS.indexOf(card.substring(0, card.length - 1))
      );
      for (let i = 0; i <= suitRanksIndex.length - 5; i++) {
        let isValidSubset = true;
        for (let j = i; j < i + 5 - 1; j++) {
          if (suitRanksIndex[j + 1] - suitRanksIndex[j] !== 1) {
            isValidSubset = false;
            break;
          }
        }
        if (isValidSubset) {
          straight = suits[suit].slice(i, i + 5);
          combinations.push({ type: 'Thùng phá sảnh', cards: straight });
        }
      }
    }

    combinations.sort((a, b) => {
      return (
        [
          'Đôi',
          'Thú',
          'Sám cô',
          'Sảnh',
          'Tứ Quý',
          'Thùng',
          'Cù Lũ',
          'Thùng phá sảnh',
        ].indexOf(a.type) -
        [
          'Đôi',
          'Thú',
          'Sám cô',
          'Sảnh',
          'Tứ Quý',
          'Thùng',
          'Cù Lũ',
          'Thùng phá sảnh',
        ].indexOf(b.type)
      );
    });
    return combinations;
  }

  // Sắp xếp bộ bài
  let { ranks, suits } = classifyCards(cards);
  let combinations = findCombination(ranks, suits);

  const combinations2 = combinations;

  let firstSet = null;
  let secondSet = null;
  let thirdSet = null;
  if (combinations.length > 0) {
    if (combinations[combinations.length - 1].cards.length == 5) {
      firstSet = combinations[combinations.length - 1];
      combinations = combinations.filter(
        (combination) =>
          !combination.cards.some((card) => firstSet.cards.includes(card))
      );
      if (combinations.length > 0) {
        secondSet = combinations[combinations.length - 1];
        combinations = combinations.filter(
          (combination) =>
            !combination.cards.some((card) => secondSet.cards.includes(card))
        );
      } else {
        secondSet = { type: 'Mậu thầu', cards: [] };
      }
      while (secondSet.cards.length < 5) {
        //filter notFullFiveCombinations that don't have any card in secondSet
        let notFullFiveCombinations = combinations.filter(
          (combination) =>
            !combination.cards.some((card) => secondSet.cards.includes(card)) &&
            !combination.cards.some((card) => firstSet.cards.includes(card)) &&
            combination.cards.length + secondSet.cards.length <= 5
        );
        if (notFullFiveCombinations.length > 0) {
          secondSet.cards.push(
            ...notFullFiveCombinations[notFullFiveCombinations.length - 1].cards
          );
        }
        if (notFullFiveCombinations.length == 0) {
          const cardsLeft = cards.filter(
            (card) =>
              !firstSet.cards.includes(card) && !secondSet.cards.includes(card)
          );
          cardsLeft.forEach((card) => {
            if (
              !combinations.some((combination) =>
                combination.cards.includes(card)
              ) &&
              secondSet.cards.length < 5
            ) {
              secondSet.cards.push(card);
            }
          });
          if (secondSet.cards.length < 5) {
            secondSet.cards.push(
              ...cardsLeft.slice(0, 5 - secondSet.cards.length)
            );
          }
        }
      }
      combinations = combinations.filter(
        (combination) =>
          !combination.cards.some((card) => secondSet.cards.includes(card)) &&
          ['Đôi', 'Sám cô'].includes(combination.type)
      );
      if (combinations.length > 0) {
        thirdSet = combinations[combinations.length - 1];
        combinations = combinations.filter(
          (combination) =>
            !combination.cards.some((card) => thirdSet.cards.includes(card))
        );
      } else {
        thirdSet = { type: 'Mậu thầu', cards: [] };
      }
      while (thirdSet.cards.length < 3) {
        //filter notFullFiveCombinations that don't have any card in thirdSet
        let notFullFiveCombinations = combinations.filter(
          (combination) =>
            !combination.cards.some((card) => thirdSet.cards.includes(card)) &&
            !combination.cards.some((card) => secondSet.cards.includes(card)) &&
            !combination.cards.some((card) => firstSet.cards.includes(card)) &&
            combination.cards.length + thirdSet.cards.length <= 3
        );
        if (notFullFiveCombinations.length > 0) {
          thirdSet.cards.push(
            ...notFullFiveCombinations[notFullFiveCombinations.length - 1].cards
          );
        }
        if (notFullFiveCombinations.length == 0) {
          const cardsLeft = cards.filter(
            (card) =>
              !firstSet.cards.includes(card) &&
              !secondSet.cards.includes(card) &&
              !thirdSet.cards.includes(card)
          );
          cardsLeft.forEach((card) => {
            if (
              !combinations.some((combination) =>
                combination.cards.includes(card)
              ) &&
              thirdSet.cards.length < 3
            ) {
              thirdSet.cards.push(card);
            }
          });
          if (thirdSet.cards.length < 3)
            thirdSet.cards.push(
              ...cardsLeft.slice(0, 3 - thirdSet.cards.length)
            );
        }
      }
    } else {
      firstSet = combinations[combinations.length - 1];
      secondSet = { type: 'Mậu thầu', cards: [] };
      while (firstSet.cards.length < 5) {
        //filter notFullFiveCombinations that don't have any card in firstSet
        let notFullFiveCombinations = combinations.filter(
          (combination) =>
            !combination.cards.some((card) => firstSet.cards.includes(card)) &&
            combination.cards.length + firstSet.cards.length <= 5
        );
        if (notFullFiveCombinations.length > 0) {
          firstSet.cards.push(
            ...notFullFiveCombinations[notFullFiveCombinations.length - 1].cards
          );
          combinations = combinations.filter(
            (combination) =>
              combination.cards !==
              !combination.cards.some((card) => firstSet.cards.includes(card))
          );
          notFullFiveCombinations = notFullFiveCombinations.filter(
            (combination) =>
              !combination.cards.some((card) =>
                firstSet.cards.includes(card)
              ) && combination.cards.length + firstSet.cards.length <= 5
          );
        }
        if (notFullFiveCombinations.length == 0) {
          const cardsLeft = cards.filter(
            (card) => !firstSet.cards.includes(card)
          );
          //check if cardsLeft is in combination
          cardsLeft.forEach((card) => {
            if (
              !combinations.some((combination) =>
                combination.cards.includes(card)
              ) &&
              firstSet.cards.length < 5
            ) {
              firstSet.cards.push(card);
            }
          });
          if (firstSet.cards.length < 5)
            firstSet.cards.push(
              ...cardsLeft.slice(0, 5 - firstSet.cards.length)
            );
        }
      }
      combinations = combinations.filter(
        (combination) =>
          !combination.cards.some((card) => firstSet.cards.includes(card))
      );
      if (combinations.length > 0) {
        secondSet = combinations[combinations.length - 1];
        combinations = combinations.filter(
          (combination) =>
            !combination.cards.some((card) => secondSet.cards.includes(card))
        );
      } else {
        secondSet = { type: 'Mậu thầu', cards: [] };
      }
      while (secondSet.cards.length < 5) {
        //filter notFullFiveCombinations that don't have any card in secondSet
        let notFullFiveCombinations = combinations.filter(
          (combination) =>
            !combination.cards.some((card) => secondSet.cards.includes(card)) &&
            !combination.cards.some((card) => firstSet.cards.includes(card)) &&
            combination.cards.length + secondSet.cards.length <= 5
        );
        if (notFullFiveCombinations.length > 0) {
          secondSet.cards.push(
            ...notFullFiveCombinations[notFullFiveCombinations.length - 1].cards
          );
          combinations = combinations.filter(
            (combination) =>
              combination.cards !==
              !combination.cards.some((card) => secondSet.cards.includes(card))
          );
          notFullFiveCombinations = notFullFiveCombinations.filter(
            (combination) =>
              !combination.cards.some((card) =>
                secondSet.cards.includes(card)
              ) && combination.cards.length + secondSet.cards.length <= 5
          );
        }
        if (notFullFiveCombinations.length == 0) {
          const cardsLeft = cards.filter(
            (card) =>
              !firstSet.cards.includes(card) && !secondSet.cards.includes(card)
          );
          cardsLeft.forEach((card) => {
            if (
              !combinations.some((combination) =>
                combination.cards.includes(card)
              ) &&
              secondSet.cards.length < 5
            ) {
              secondSet.cards.push(card);
            }
          });
          if (firstSet.cards.length < 5) {
            secondSet.cards.push(
              ...cardsLeft.slice(0, 5 - secondSet.cards.length)
            );
          }
        }
      }

      combinations = combinations.filter(
        (combination) =>
          !combination.cards.some((card) => secondSet.cards.includes(card)) &&
          ['Đôi', 'Sám cô'].includes(combination.type)
      );

      if (combinations.length > 0) {
        thirdSet = combinations[combinations.length - 1];
        combinations = combinations.filter(
          (combination) =>
            !combination.cards.some((card) => thirdSet.cards.includes(card))
        );
      } else {
        thirdSet = { type: 'Mậu thầu', cards: [] };
      }
      while (thirdSet.cards.length < 3) {
        //filter notFullFiveCombinations that don't have any card in thirdSet
        let notFullFiveCombinations = combinations.filter(
          (combination) =>
            !combination.cards.some((card) => thirdSet.cards.includes(card)) &&
            !combination.cards.some((card) => secondSet.cards.includes(card)) &&
            !combination.cards.some((card) => firstSet.cards.includes(card)) &&
            combination.cards.length + thirdSet.cards.length <= 3
        );
        console.log('notFullFiveCombinations', notFullFiveCombinations);
        if (notFullFiveCombinations.length > 0) {
          thirdSet.cards.push(
            ...notFullFiveCombinations[notFullFiveCombinations.length - 1].cards
          );
        }

        if (notFullFiveCombinations.length == 0) {
          const cardsLeft = cards.filter(
            (card) =>
              !firstSet.cards.includes(card) &&
              !secondSet.cards.includes(card) &&
              !thirdSet.cards.includes(card)
          );
          thirdSet.cards.push(...cardsLeft.slice(0, 3 - thirdSet.cards.length));
        }
      }
    }

    //filter combinations that don't have any card in firstSet
    combinations = combinations.filter(
      (combination) =>
        !combination.cards.some((card) => firstSet.cards.includes(card))
    );
    console.log('Sắp xếp chi đầu với bộ:', firstSet);
    console.log('Sắp xếp chi thứ hai với bộ:', secondSet);

    // Xóa bộ đã dùng
    firstSet.cards.forEach((card) => {
      cards = cards.filter((c) => c !== card);
    });
    secondSet.cards.forEach((card) => {
      cards = cards.filter((c) => c !== card);
    });
  }

  firstSet.cards = convertToDefaultType(firstSet?.cards);
  secondSet.cards = convertToDefaultType(secondSet.cards);
  thirdSet.cards = convertToDefaultType(thirdSet?.cards);
  return {
    cards: firstSet.cards.concat(secondSet.cards).concat(thirdSet.cards),
    chi1: firstSet,
    chi2: secondSet,
    chi3: thirdSet,
    combinations: combinations2,
  };
}

function checkInstantWin(cards: any) {
  let { ranks, suits } = classifyCards(cards);

  // Kiểm tra Rồng cuốn (đồng chất từ 2 đến A)
  if (checkDragonFlush(cards)) {
    return { win: true, type: 'Rồng cuốn' };
  }
  // Kiểm tra Sảnh rồng (không đồng chất từ 2 đến A)
  if (checkStraightFlush(ranks)) {
    return { win: true, type: 'Sảnh rồng' };
  }
  // Kiểm tra Năm đôi 1 Sám cô
  if (checkFivePairsOneTrio(ranks)) {
    return { win: true, type: 'Năm đôi 1 Sám cô' };
  }
  // Kiểm tra Lục phé bôn (6 đôi)
  if (checkSixPairs(ranks)) {
    return { win: true, type: 'Lục phé bôn' };
  }
  // Kiểm tra Ba thùng và Ba sảnh
  let flushCount = countFlushes(suits);
  let straightCount = countStraights(ranks);
  if (flushCount == 3) {
    return { win: true, type: 'Ba thùng' };
  }
  if (straightCount == 3) {
    return { win: true, type: 'Ba sảnh' };
  }

  return { win: false };
}

// Các hàm hỗ trợ kiểm tra bộ bài
function checkDragonFlush(cards: any) {
  let suit = cards[0][1];
  for (let i = 1; i < cards.length; i++) {
    if (cards[i][1] !== suit) return false;
  }
  return true; // Tất cả cùng chất
}

function checkStraightFlush(ranks: any) {
  const sequence = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
    'A',
  ];
  return sequence.every((rank) => ranks[rank] && ranks[rank].length == 1);
}

function checkFivePairsOneTrio(ranks: any) {
  let pairs = 0;
  let trios = 0;
  Object.values(ranks).forEach((group: any) => {
    if (group.length == 2) pairs++;
    if (group.length == 3) trios++;
  });
  return pairs == 5 && trios == 1;
}

function checkSixPairs(ranks: any) {
  let pairs = 0;
  Object.values(ranks).forEach((group: any) => {
    if (group.length == 2) pairs++;
  });
  return pairs == 6;
}

function countFlushes(suits: any) {
  return Object.values(suits).filter((group: any) => group.length >= 5).length;
}

function countStraights(ranks: any) {
  return Object.keys(ranks).length >= 5 ? 1 : 0;
}

function classifyCards(cards: any) {
  let ranks = {} as any;
  let suits = {} as any;
  cards.forEach((card: any) => {
    let rank = card.substring(0, card.length - 1);
    let suit = card[card.length - 1];
    if (!ranks[rank]) ranks[rank] = [];
    if (!suits[suit]) suits[suit] = [];
    ranks[rank].push(card);
    suits[suit].push(card);
  });
  return { ranks, suits };
}

function findCard(cardsInput: any[]) {
  return cardsInput.map((card) => {
    return CARDS[card];
  });
}

export const setupArrangeCardHandlers = () => {
  ipcMain.on('arrange-card', (event, input, position) => {
    let cards = findCard(input).sort((a, b) => {
      return CARDS.indexOf(a) - CARDS.indexOf(b);
    });
    let result = checkInstantWin(cards);
    console.log('🞀 ~ result:', result);
    let returnCards = sortCardsForChinesePoker(cards);
    if (cards.length !== 13) {
      event.reply('arrange-card', {
        error: 'Bạn cần nhập đúng 13 số, mỗi số từ 1 đến 52.',
      });
    }
    returnCards.isInstantWin = result;

    // const result = displaySortedHands(cards);
    event.reply('arrange-card', returnCards, position);
  });
};
