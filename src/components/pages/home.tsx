import { useCallback, useState } from 'react';
import { DndProvider, DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getCardImageUrl } from '../../lib/card';
import Card from '../card/card';
import { MainNav } from '../layout/main-nav';

interface DraggableCardProps {
  id: number;
  imageUrl: string;
  moveCard: (dragId: number, hoverId: number) => void;
}

const DraggableCard: React.FC<DraggableCardProps> = ({
  id,
  imageUrl,
  moveCard,
}) => {
  const [, drag] = useDrag({
    type: 'card',
    item: { id },
    end: (item: { id: number } | undefined, monitor: DragSourceMonitor) => {
      const dropResult = monitor.getDropResult<{ id: number }>();
      if (item && dropResult) {
        moveCard(item.id, dropResult.id);
      }
    },
  });

  return (
    <div ref={drag} className="">
      <Card imageUrl={imageUrl} />
    </div>
  );
};

interface DropCardProps {
  id: number;
  children: React.ReactNode;
  moveCard: (dragId: number, hoverId: number) => void;
}

const DropCard: React.FC<DropCardProps> = ({ id, children, moveCard }) => {
  const [, drop] = useDrop({
    accept: 'card',
    drop: () => ({ id }),
  });

  return <div ref={drop}>{children}</div>;
};

export const Home: React.FC = () => {
  const initialCards = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
  ]);
  const [cards, setCards] = initialCards;
  const [part1, setPart1] = useState<number[]>(cards.slice(0, 5));
  const [part2, setPart2] = useState<number[]>(cards.slice(5, 10));
  const [part3, setPart3] = useState<number[]>([0, ...cards.slice(10, 13), 0]);

  const moveCard = useCallback(
    (dragId: number, hoverId: number) => {
      const dragIndex = cards.indexOf(dragId);
      const hoverIndex = cards.indexOf(hoverId);

      if (dragIndex !== hoverIndex) {
        const newCards = [...cards];
        newCards[dragIndex] = cards[hoverIndex];
        newCards[hoverIndex] = cards[dragIndex];
        setCards(newCards);
        const part1 = newCards.slice(0, 5);
        const part2 = newCards.slice(5, 10);
        const part3 = [0, ...newCards.slice(10, 13), 0];
        setPart1(part1);
        setPart2(part2);
        setPart3(part3);
      }
    },
    [cards]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="text-center">
        <div className="fixed top-0 bg-slate-600 w-full">
          <MainNav />
        </div>
        <div className="flex flex-col gap-[5px] mt-[5%]">
          <div className="grid grid-cols-5 gap-[5px]">
            {part3.map((cardNumber) => (
              <>
                {cardNumber !== 0 ? (
                  <DropCard
                    key={cardNumber}
                    id={cardNumber}
                    moveCard={moveCard}
                  >
                    <DraggableCard
                      id={cardNumber}
                      imageUrl={getCardImageUrl(cardNumber)}
                      moveCard={moveCard}
                    />
                  </DropCard>
                ) : (
                  <div></div>
                )}
              </>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-[5px]">
            {part2.map((cardNumber) => (
              <DropCard key={cardNumber} id={cardNumber} moveCard={moveCard}>
                <DraggableCard
                  id={cardNumber}
                  imageUrl={getCardImageUrl(cardNumber)}
                  moveCard={moveCard}
                />
              </DropCard>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-[5px]">
            {part1.map((cardNumber) => (
              <DropCard key={cardNumber} id={cardNumber} moveCard={moveCard}>
                <DraggableCard
                  id={cardNumber}
                  imageUrl={getCardImageUrl(cardNumber)}
                  moveCard={moveCard}
                />
              </DropCard>
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};
