import { Plus } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import BoardCard from '../../components/card/boardCard';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableRow } from '../../components/ui/table';
import { getRandomCards } from '../../lib/card';
import { AppContext } from '../../renderer/providers/app';

export const HomePage: React.FC<any> = (cardDeck) => {
  const [cards, setCards] = useState<number[][]>([
    // [
    //   10, 22, 36, 44, 34, 14, 16, 37, 15, 1, 0, 33, 11, 5, 27, 35, 32, 19, 9,
    //   18, 42, 31, 17, 46, 38, 47, 49, 29, 26, 28, 8, 23, 2, 30, 6, 39, 41, 40,
    //   7, 24, 13, 21, 45, 25, 20, 43, 12, 51, 50, 3, 4, 48,
    // ],
  ]);
  const [currentGame, setCurrentGame] = useState(1);

  const { state } = useContext(AppContext);

  // useEffect(() => {
  //   if (state.foundBy) {
  //     const desk = state.crawingRoom[state.foundBy].cardGame;
  //     const lastIndex = desk.length - 1;
  //     const lastGame = desk[lastIndex];

  //     if (lastIndex > 0 && cards.length === lastIndex - 1) {
  //       const mappedCard = lastGame.map((gameCard) => gameCard.cs);
  //       setCards((pre) => [...pre, ([] as number[]).concat(...mappedCard)]);
  //     }
  //   }
  // }, [state.foundAt, state.crawingRoom]);
  useEffect(() => {
    if (state.foundBy) {
      const desk = state.crawingRoom[state.foundBy].cardGame;
      const lastIndex = desk.length - 1;
      const lastGame = desk[lastIndex];
      console.log('lasgameArray', lastGame);

      if (lastIndex > 0 && cards.length === lastIndex - 1) {
        const interleavedCards = interleaveArrays(
          lastGame.map((gameCard) => gameCard.cs)
        );
        console.log('interleavedCards', interleavedCards);
        setCards((pre) => [...pre, ...interleavedCards]);
      }
    }
  }, [state.foundAt, state.crawingRoom]);

  function interleaveArrays(arrays: any) {
    const maxLength = Math.max(...arrays.map((arr: any) => arr.length));
    let result: any = [];
    for (let i = 0; i < maxLength; i++) {
      arrays.forEach((arr: any[]) => {
        if (i < arr.length) {
          result.push(arr[i]);
        }
      });
    }
    return result;
  }

  const addRandomCards = () => {
    setCards((prevCards) => [...prevCards, getRandomCards()]);
  };

  return (
    <div className="text-center relative">
      <div className="py-[20px]">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>All card in room</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {cards.map((card, index) => (
                  <TableRow
                    key={index}
                    className={`relative !rounded-[20px] ${
                      index + 1 == state.currentGame &&
                      'bg-[#9c9c9c] bg-opacity-60 hover:bg-[#9c9c9c]'
                    }`}
                  >
                    <BoardCard
                      cards={card}
                      indexProps={index}
                      numPlayers={cardDeck.cardDeck}
                    />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground flex flex-row gap-2 items-center">
              <Label>
                Showing <strong>{cards.length}</strong> of cards
              </Label>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={addRandomCards}
              >
                <Plus />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
