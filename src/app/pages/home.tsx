import { useContext, useEffect, useState } from 'react';
import BoardCard from '../../components/card/boardCard';
import { Button } from '../../components/ui/button';
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
import { getRandomCards } from '../../lib/card';
import { AppContext } from '../../renderer/providers/app';

export const HomePage: React.FC<any> = (cardDeck) => {
  const [cards, setCards] = useState<number[][]>([
    [
      10, 22, 36, 44, 34, 14, 16, 37, 15, 1, 0, 33, 11, 5, 27, 35, 32, 19, 9,
      18, 42, 31, 17, 46, 38, 47, 49, 29, 26, 28, 8, 23, 2, 30, 6, 39, 41, 40,
      7, 24, 13, 21, 45, 25, 20, 43, 12, 51, 50, 3, 4, 48,
    ],
  ]);
  const [currentGame, setCurrentGame] = useState(1);

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
        const mappedCard = ([] as any).concat(...lastCards);
        setCards((pre) => [...pre, mappedCard]);
      }
    }
  }, [state.foundAt, state.crawingRoom]);

  const addRandomCards = () => {
    setCards((prevCards) => [...prevCards, getRandomCards()]);
  };

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
            <div className="text-xs text-muted-foreground flex flex-row gap-2">
              <Label>
                Showing <strong>{cards.length}</strong> of cards
              </Label>
              <Button onClick={addRandomCards}>Add Random Cards</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
