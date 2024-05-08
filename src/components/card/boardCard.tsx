import React, { useContext, useEffect, useMemo } from 'react';
import { AppContext } from '../../renderer/providers/app';
import { HandCard } from '../card/handcard';
import { Label } from '../ui/label';
import { TableCell } from '../ui/table';

const BoardCard: React.FC<any> = ({
  indexProps,
  cards,
  numPlayers,
  currentGame,
}) => {
  const { state, setState } = useContext(AppContext);
  const playerHands = useMemo(() => {
    const playerHands: number[][] = Array.from(
      { length: numPlayers },
      () => []
    );
    cards.forEach((card: number, index: number) => {
      const playerIndex = index % numPlayers;
      if (playerHands[playerIndex].length < 13) {
        playerHands[playerIndex].push(card);
      }
    });

    return playerHands;
  }, [cards, numPlayers]);

  useEffect(() => {
    console.log('check sheet', state.currentGame.sheet);
  }, [state.currentGame]);

  return (
    <TableCell
      key={indexProps}
      className={`grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-4 !w-[100%] gap-[10px] py-6`}
      id={`boardCard-${indexProps}`}
    >
      <Label className="absolute top-[-10px] left-[-10px] border bg-background rounded-md p-2 z-[20]">
        {indexProps + 1}
      </Label>
      {playerHands.map((hand, index) => (
        <HandCard
          key={index}
          cardProp={hand}
          isShowPlayer={indexProps === currentGame.number}
          player={currentGame.sheet[(index + 1).toString()]}
        />
      ))}
    </TableCell>
  );
};

export default BoardCard;
