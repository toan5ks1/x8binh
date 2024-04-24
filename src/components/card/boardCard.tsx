import React from 'react';
import { HandCard } from '../card/handcard';
import { TableCell } from '../ui/table';

const BoardCard: React.FC<any> = ({ indexProps, cards, numPlayers }) => {
  const distributeCards = () => {
    const playerHands: number[][] = Array.from(
      { length: numPlayers },
      () => []
    );

    cards.forEach((card: number, index: number) => {
      const playerIndex = index % numPlayers;
      playerHands[playerIndex].push(card);
    });

    return playerHands;
  };

  const playerHands = distributeCards();
  console.log(playerHands);
  return (
    <TableCell
      key={indexProps}
      className={`grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-4 !w-[100%] gap-[20px]`}
    >
      {playerHands.map((hand, index) => (
        <HandCard key={index} cardProp={hand} />
      ))}
    </TableCell>
  );
};

export default BoardCard;
