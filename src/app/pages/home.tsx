import { useContext, useEffect, useState } from 'react';
import BoardCard from '../../components/card/boardCard';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { AppContext } from '../../renderer/providers/app';

export const HomePage: React.FC<any> = (cardDeck) => {
  const [cards, setCards] = useState<number[][]>([
    [
      18, 35, 27, 38, 17, 29, 20, 44, 41, 10, 45, 8, 50, 36, 23, 32, 25, 21, 40,
      13, 46, 7, 30, 51, 5, 24, 9, 2, 43, 12, 31, 39, 26, 15, 19, 16, 0, 28, 49,
      1, 6, 33, 37, 47, 4, 3, 42, 11, 34, 14, 22, 48,
    ],
    [
      44, 43, 14, 11, 47, 49, 13, 10, 41, 6, 51, 45, 21, 16, 19, 22, 30, 20, 3,
      2, 36, 32, 12, 50, 33, 7, 25, 1, 23, 35, 28, 29, 40, 34, 24, 39, 9, 46,
      17, 18, 27, 5, 37, 42, 0, 26, 38, 15, 8, 4, 31, 48,
    ],
    [
      46, 10, 34, 7, 0, 28, 1, 36, 51, 38, 27, 12, 26, 30, 9, 22, 37, 18, 44,
      33, 40, 8, 29, 13, 48, 5, 35, 41, 32, 6, 3, 50, 14, 42, 25, 39, 15, 45,
      49, 2, 24, 17, 4, 16, 11, 47, 19, 20, 23, 43, 31, 21,
    ],
    [
      51, 45, 36, 43, 8, 34, 10, 49, 27, 33, 35, 9, 32, 30, 7, 5, 23, 50, 41,
      21, 24, 17, 4, 26, 18, 29, 28, 46, 42, 15, 38, 12, 6, 1, 37, 39, 20, 40,
      16, 11, 14, 13, 25, 2, 3, 31, 48, 22, 0, 47, 19, 44,
    ],
    [
      28, 25, 31, 15, 9, 38, 36, 37, 50, 29, 41, 44, 2, 7, 26, 17, 11, 19, 5,
      47, 39, 14, 1, 20, 48, 43, 3, 32, 4, 23, 21, 30, 22, 24, 40, 6, 33, 8, 12,
      13, 18, 34, 35, 45, 0, 49, 51, 27, 42, 10, 16, 46,
    ],
    [
      44, 14, 45, 3, 4, 35, 39, 24, 23, 43, 22, 15, 30, 18, 29, 38, 5, 16, 42,
      6, 17, 46, 25, 51, 49, 8, 36, 2, 10, 12, 1, 19, 11, 7, 20, 0, 21, 28, 50,
      9, 32, 34, 31, 26, 27, 47, 37, 33, 48, 40, 41, 13,
    ],
    [
      24, 17, 39, 12, 2, 33, 22, 0, 16, 18, 43, 8, 14, 26, 9, 37, 34, 13, 7, 41,
      45, 49, 50, 19, 6, 20, 40, 5, 51, 42, 27, 48, 44, 23, 30, 35, 38, 3, 10,
      32, 36, 31, 46, 29, 28, 15, 21, 11, 1, 47, 4, 25,
    ],
    [
      28, 48, 21, 7, 45, 4, 50, 24, 51, 34, 8, 15, 1, 36, 22, 16, 12, 49, 30,
      23, 9, 47, 41, 3, 11, 37, 13, 0, 26, 38, 10, 20, 6, 44, 5, 43, 27, 29, 2,
      42, 32, 40, 31, 19, 39, 18, 35, 25, 33, 46, 14, 17,
    ],
    [
      12, 39, 48, 31, 46, 36, 50, 22, 23, 21, 29, 13, 38, 6, 3, 15, 45, 30, 40,
      26, 41, 16, 5, 7, 25, 28, 2, 42, 18, 37, 11, 9, 17, 47, 33, 4, 20, 35, 0,
      49, 24, 14, 1, 10, 34, 32, 27, 19, 8, 44, 43, 51,
    ],
    [
      30, 2, 39, 19, 9, 41, 26, 46, 45, 16, 10, 37, 42, 22, 4, 21, 32, 40, 35,
      50, 12, 15, 1, 24, 0, 3, 7, 33, 13, 48, 18, 20, 44, 28, 27, 51, 11, 5, 49,
      38, 17, 43, 23, 25, 36, 14, 6, 34, 29, 8, 47, 31,
    ],
    [
      51, 6, 12, 5, 17, 8, 9, 48, 22, 7, 21, 27, 50, 3, 29, 36, 39, 23, 1, 15,
      11, 35, 45, 40, 16, 2, 0, 20, 14, 34, 26, 13, 18, 19, 47, 44, 38, 37, 41,
      10, 46, 32, 42, 24, 28, 4, 49, 25, 30, 33, 31, 43,
    ],
    [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
      39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
    ],
  ]);
  const [currentGame, setCurrentGame] = useState(2);

  const { state } = useContext(AppContext);

  useEffect(() => {
    if (state.foundBy) {
      const desk = state.crawingRoom[state.foundBy].cardDesk;
      const lastIndex = desk.length - 1;
      const lastGame = desk[lastIndex];
      const lastCards = Object.values(lastGame);

      if (
        lastIndex > 0 &&
        lastCards.length === 4 &&
        cards.length === lastIndex - 1
      ) {
        const mappedCard = ([] as number[]).concat(...lastCards);
        setCards((pre) => [...pre, mappedCard]);
      }
    }
  }, [state.foundAt, state.crawingRoom]);

  // const cards = useMemo(() => {
  //   if (state.foundBy) {
  //     const desk = state.crawingRoom[state.foundBy].cardDesk;
  //     const card = desk.map((game) => {
  //       const arr = Object.values(game);
  //       if (arr.length === 4) {
  //         return ([] as number[]).concat(...arr);
  //       }
  //       return [];
  //     });

  //     return card;
  //   }

  //   return [];
  // }, [state.crawingRoom]);

  // console.log(cards);

  return (
    <div className="text-center relative">
      <div className="py-[20px]">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>All card in room</CardTitle>
            <CardDescription>
              Manage your products and view their sales performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cards.map((card, index) => (
                  <TableRow
                    key={index}
                    className={`relative !rounded-[20px] ${
                      index + 1 == currentGame &&
                      'bg-[#9c9c9c] bg-opacity-60 hover:bg-[#9c9c9c]'
                    }`}
                  >
                    <Label className=" absolute top-[5px] left-[5px] border bg-background rounded-md p-2 z-[1000]">
                      {index + 1}
                    </Label>
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
            <div className="text-xs text-muted-foreground">
              Showing <strong>{cards.length}</strong> of cards
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
