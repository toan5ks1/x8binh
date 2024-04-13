import { useState } from 'react';
import { HandCard } from '../card/handcard';
import { MainNav } from '../layout/main-nav';

export const Home: React.FC = () => {
  const [cards, setCards] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
  ]);
  const [numPlayers, setNumPlayers] = useState(3);

  const distributeCards = () => {
    const playerHands: number[][] = Array.from(
      { length: numPlayers },
      () => []
    );

    cards.forEach((card, index) => {
      const playerIndex = index % numPlayers;
      playerHands[playerIndex].push(card);
    });

    return playerHands;
  };

  const playerHands = distributeCards();

  return (
    <div className="text-center relative">
      <div className="sticky top-0 bg-slate-600 w-full">
        <MainNav />
      </div>
      <h1 className="text-black">Nhà cái đến từ châu âu</h1>
      <div className="grid grid-cols-4 gap-5 px-[20px] bg-slate-500">
        {playerHands.map((hand, index) => (
          // Make sure your HandCard component can accept and utilize the "cards" prop correctly.
          <HandCard key={index} cardProp={hand} />
        ))}
      </div>
    </div>
  );
};
