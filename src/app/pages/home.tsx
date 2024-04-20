import { useState } from 'react';
import { HandCard } from '../../components/card/handcard';
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';

export const HomePage: React.FC = () => {
  const [handType, setHandType] = useState('4');
  const [cards, setCards] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
  ]);
  const [numPlayers, setNumPlayers] = useState(4);

  const distributeCards = () => {
    const playerHands: number[][] = Array.from(
      { length: numPlayers },
      () => []
    );

    cards.forEach((card, index) => {
      const playerIndex = index % numPlayers;
      playerHands[playerIndex].push(card);
    });

    return playerHands;
  };
  const handleChangeHandType = (value: string) => {
    setHandType(value);
    setNumPlayers(Number(value));
  };

  const playerHands = distributeCards();

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
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  {playerHands.map((hand, index) => (
                    <TableCell key={index}>
                      <HandCard cardProp={hand} />
                    </TableCell>
                  ))}
                </TableRow>
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
