import { useContext, useMemo } from 'react';
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
  // const [cards, setGames] = useState<number[][]>([
  //   [],
  //   [
  //     1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  //     22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
  //     40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
  //   ],
  // ]);

  // setInterval(() => {
  //   setGames((pre) => [
  //     ...pre,
  //     [
  //       1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  //       21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
  //       39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
  //     ],
  //   ]);
  // }, 5000);

  const { state } = useContext(AppContext);

  const cards = useMemo(() => {
    if (state.foundBy) {
      const desk = state.crawingRoom[state.foundBy].cardDesk;
      const card = desk.map((game) => {
        const arr = Object.values(game);
        if (arr.length === 4) {
          return ([] as number[]).concat(...arr).map((item) => item + 1);
        }
        return [];
      });

      return card;
    }

    return [];
  }, [state.crawingRoom]);

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
                      numPlayers={'4'}
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
