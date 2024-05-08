import { Label } from '@radix-ui/react-label';
import { Loader, RotateCw, Star } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { DndProvider, DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { arrangCard } from '../../lib/arrangeCard';
import { getCardImageUrl } from '../../lib/card';
import CardGame from '../card/card';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
interface DraggableCardProps {
  id: number;
  imageUrl: string;
  moveCard: (dragId: number, hoverId: number) => void;
}

interface HandCardProps {
  cardProp: number[];
  key: number;
  isShowPlayer: boolean;
  player: string;
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
      <CardGame imageUrl={imageUrl} />
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

export const HandCard: React.FC<HandCardProps> = ({
  cardProp,
  isShowPlayer,
  player,
}) => {
  const [cards, setCards] = useState<number[]>(cardProp ?? []);
  const [part1, setPart1] = useState<number[]>(cards.slice(0, 5));
  const [part2, setPart2] = useState<number[]>(cards.slice(5, 10));
  const [part3, setPart3] = useState<number[]>([...cards.slice(10, 13)]);
  const [evaluation1, setEvaluation1] = useState<string>('');
  const [evaluation2, setEvaluation2] = useState<string>('');
  const [evaluation3, setEvaluation3] = useState<string>('');
  const [isInstant, setIsInstant] = useState<boolean>(false);
  const [titleInstant, setTitleInstant] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

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
        const part3 = [...newCards.slice(10, 13)];
        setPart1(part1);
        setPart2(part2);
        setPart3(part3);
      }
    },
    [cards]
  );

  function renderBackgroundColor() {
    const specialEvaluations = ['TP Sảnh', 'Tứ Quý'];
    if (isInstant) {
      return 'bg-red-500 bg-opacity-90 shadow-[0_0px_10px_rgba(255,_31,_31,_0.8)]';
    }
    if (
      specialEvaluations.includes(evaluation1) ||
      specialEvaluations.includes(evaluation2) ||
      specialEvaluations.includes(evaluation3) ||
      evaluation2 == 'Cù lũ' ||
      evaluation3 == 'Sam'
    ) {
      return 'bg-orange-500 bg-opacity-100 shadow-[0_0px_10px_rgba(255,_31,_31,_0.8)]';
    }

    return 'bg-opacity-20';
  }

  const handleArrange = (): void => {
    setLoading(true);
    const newCard = arrangCard(cardProp) as any;
    setCards(newCard.cards);
    setEvaluation1(newCard.chi1);
    setEvaluation2(newCard.chi2);
    setEvaluation3(newCard.chi3);
    setIsInstant(newCard.instant ? true : false);
    setTitleInstant(newCard.instant);
    setLoading(false);
  };

  useEffect(() => {
    if (cards) {
      setPart1(cards.slice(0, 5));
      setPart2(cards.slice(5, 10));
      setPart3([...cards.slice(10, 13)]);
    }
  }, [cards]);

  useEffect(() => {
    setCards(cardProp ?? []);
    handleArrange();
  }, [cardProp]);

  // useEffect(() => {
  //   const handleData = (newData: any, position: any) => {
  //     if (position === idHand) {
  //       setCards(newData.cards);
  //       setEvaluation1(newData.chi1);
  //       setEvaluation2(newData.chi2);
  //       setEvaluation3(newData.chi3);
  //       setIsInstant(newData.instant ? true : false);
  //       setTitleInstant(newData.instant);
  //       setLoading(false);
  //     }
  //   };

  //   window.backend.on('arrange-card', handleData);

  //   return () => {
  //     window.backend.removeListener('arrange-card', handleData);
  //   };
  // }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Card
        className={`bg-[#252424] py-[10px] rounded-[15px] px-[7px] relative ${renderBackgroundColor()}`}
      >
        {titleInstant && (
          <div className="absolute top-[-20px] left-0 right-0 flex justify-center items-center ">
            <Label className="shadow-[0_0px_10px_rgba(255,_31,_31,_0.8)] py-[5px] px-[10px] border bg-background rounded-sm z-[49] flex flex-row gap-[3px] items-center font-bold">
              <Star className="w-3.5 h-3.5"></Star>
              {titleInstant}
            </Label>
          </div>
        )}
        {!loading ? (
          <div className="flex flex-col">
            <Label
              // style={{ fontFamily: 'monospace' }}
              className={`py-2 px-[7px] mb-2 rounded-[5px] border font-semibold text-[13px] truncate bg-background `}
            >
              {evaluation1} - {evaluation2} - {evaluation3}
            </Label>

            <div className="grid grid-rows-3 gap-[5px] relative text-center font-bold text-[15px] ">
              <div className="flex flex-col gap-1.5">
                <div className="grid grid-cols-5 gap-[5px]">
                  {/* {part3.map((cardNumber, index) => renderCard(cardNumber, index))} */}
                  {part3.map((cardNumber) => (
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
                  ))}
                </div>

                {/* <Label
                style={{ fontFamily: 'monospace' }}
                className={`py-[1px] px-[7px] rounded-[5px] font-semibold ${renderBackgroundColor(
                  evaluation3
                )}`}
              >
                {evaluation3}
              </Label> */}
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="grid grid-cols-5 gap-[5px] relative">
                  {part2.map((cardNumber) => (
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
                  ))}
                </div>
                {/* <Label
                style={{ fontFamily: 'monospace' }}
                className={`py-[1px] px-[7px] rounded-[5px] font-semibold ${renderBackgroundColor(
                  evaluation2
                )}`}
              >
                {evaluation2}
              </Label> */}
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="grid grid-cols-5 gap-[5px]">
                  {part1.map((cardNumber, index) => (
                    <DropCard key={index} id={cardNumber} moveCard={moveCard}>
                      <DraggableCard
                        id={cardNumber}
                        imageUrl={getCardImageUrl(cardNumber)}
                        moveCard={moveCard}
                      />
                    </DropCard>
                  ))}
                </div>
                {/* <Label
                style={{ fontFamily: 'monospace' }}
                className={`py-[1px] px-[7px] rounded-[5px] font-semibold ${renderBackgroundColor(
                  evaluation1
                )}`}
              >
                {evaluation1}
              </Label> */}
              </div>
              {/* <div className="flex justify-center w-full items-center">
              {isShowPlayer && <p>{player}</p>}
            </div> */}
              <div className="absolute top-0 right-0">
                <Button
                  className="p-0 px-[5px]"
                  onClick={() => handleArrange()}
                >
                  <RotateCw />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <Loader className="w-6.5 h-6.5 animate-spin"></Loader>
          </div>
        )}
      </Card>
    </DndProvider>
  );
};
