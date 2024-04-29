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
      44, 43, 14, 11, 47, 49, 13, 10, 41, 6, 51, 45, 21, 16, 19, 22, 30, 20, 3,
      2, 36, 32, 12, 50, 33, 7, 25, 1, 23, 35, 28, 29, 40, 34, 24, 39, 9, 46,
      17, 18, 27, 5, 37, 42, 0, 26, 38, 15, 8, 4, 31, 48,
    ],
    [
      46, 10, 34, 7, 0, 28, 1, 36, 51, 38, 27, 12, 26, 30, 9, 22, 37, 18, 44,
      33, 40, 8, 29, 13, 48, 5, 35, 41, 32, 6, 3, 50, 14, 42, 25, 39, 15, 45,
      49, 2, 24, 17, 4, 16, 11, 47, 19, 20, 23, 43, 31, 21,
    ],
  ]);
  const [currentGame, setCurrentGame] = useState(1);

  const { state } = useContext(AppContext);

  function shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

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

  // Hàm tạo mảng bài ngẫu nhiên
  const addRandomCards = () => {
    var deck = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
      39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
    ];
    shuffle(deck);
    console.log(deck);

    setCards((prevCards) => [...prevCards, deck]);
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
            <div className="text-xs text-muted-foreground">
              Showing <strong>{cards.length}</strong> of cards
            </div>
            <Button onClick={addRandomCards}>Add Random Cards</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
