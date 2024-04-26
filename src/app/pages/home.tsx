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
      0, 7, 13, 12, 35, 17, 39, 46, 32, 4, 21, 30, 45, 38, 20, 42, 6, 36, 44,
      28, 51, 8, 43, 27, 50, 22, 11, 29, 24, 34, 16, 25, 15, 10, 19, 3, 1, 47,
      2, 18, 23, 33, 37, 9, 48, 41, 5, 40, 26, 14, 31, 49,
    ],
  ]);

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
                {cards.map((game, index) => (
                  <TableRow key={index}>
                    <BoardCard
                      cards={game}
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
              Showing <strong>1-10</strong> of <strong>32</strong> products
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
