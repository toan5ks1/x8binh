import React, { useState } from 'react';
import eventBar from '../../../assets/bg/event-bxh-bar.png';
import { HandCard } from '../card/handcard';

const BoardCard: React.FC = ({}) => {
  const [bookmarksChecked, setBookmarksChecked] = useState(true);
  const [urlsChecked, setUrlsChecked] = useState(false);

  const [cards, setCards] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
  ]);
  const [numPlayers, setNumPlayers] = useState(4);

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
    <div className="px-[5px] ">
      <div className="bg-[#4298d1] bg-opacity-70 pb-[20px] rounded-[25px] shadow-[4.0px_10.0px_8.0px_rgba(0,0,0,0.38)]">
        <div className="flex flex-row justify-center items-center py-[10px]">
          <div
            className="w-[50%] flex flex-row justify-center items-center"
            style={{
              backgroundImage: `url('${eventBar}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <span className="font-bold text-[25px] text-white text-shadow uppercase">
              Game
            </span>
            <p className="font-bold text-[25px] text-shadow uppercase">1</p>
          </div>
        </div>

        <div className="flex flex-row gap-[5px] px-[20px]">
          {playerHands.map((hand, index) => (
            <HandCard key={index} cardProp={hand} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
