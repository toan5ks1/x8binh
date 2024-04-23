import React, { useContext, useEffect, useState } from 'react';
import eventBar from '../../../assets/bg/event-bxh-bar.png';
import { AppContext, GameCard } from '../../renderer/providers/app';

const BoardCard: React.FC = ({}) => {
  const { state } = useContext(AppContext);
  const [gameCards, setGameCards] = useState<GameCard[]>([]);
  const froom = state.crawingRoom[state.foundBy ?? ''];

  useEffect(() => {
    if (state.foundBy && froom) {
      const gCards = froom.cardDesk;

      if (gCards.length) {
        console.log('card desk:', gCards);
        setGameCards(gCards);
      }
    }
  }, [state.foundBy, froom]);

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

        <div className="flex w-full">
          {/* {gameCards
            ? gameCards.map((gameCard, index) => (
                <div key={index} className="flex flex-row gap-[5px] px-[20px]">
                  {Object.values(gameCard).map((card, index) => (
                    <HandCard key={index} card={card} />
                  ))}
                </div>
              ))
            : null} */}
          {/* {gameCards.length ? (
            <div className="flex flex-row gap-[5px] px-[20px]">
              {Object.values(gameCards).map(
                (card, index) => (
                  <HandCard key={index} card={card} />
                )
              )}
            </div>
          ) : null} */}
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
