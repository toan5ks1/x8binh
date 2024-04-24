import { useState } from 'react';
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

export const HomePage: React.FC<any> = (cardDeck) => {
  const [games, setGames] = useState<number[][]>([
    [
      7, 13, 12, 35, 17, 39, 46, 32, 4, 21, 30, 45, 38, 20, 42, 6, 36, 44, 28,
      51, 8, 43, 27, 50, 22, 11, 29, 24, 34, 16, 25, 15, 10, 19, 3, 1, 47, 2,
      18, 23, 33, 37, 9, 0, 48, 41, 5, 40, 26, 14, 31, 49,
    ],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  ]);

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
                {games.map((game, index) => (
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
