import { useContext, useEffect, useState } from 'react';
import BoardCard from '../../components/card/boardCard';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Table, TableBody, TableRow } from '../../components/ui/table';
import { AppContext } from '../../renderer/providers/app';

export const HomePage: React.FC<any> = (cardDeck) => {
  const [cards, setCards] = useState<number[][]>([]);
  [
    // [
    //   0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    //   21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
    //   39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
    // ],
  ];
  // const [currentGame, setCurrentGame] = useState(2);

  const { state } = useContext(AppContext);

  // function shuffle(array: any[]) {
  //   for (let i = array.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [array[i], array[j]] = [array[j], array[i]];
  //   }
  //   return array;
  // }

  useEffect(() => {
    if (state.foundBy) {
      // if (true) {
      const desk = state.crawingRoom[state.foundBy].cardGame;
      const lastIndex = desk.length - 1;
      const lastGame = desk[lastIndex];

      if (lastIndex > 0 && cards.length === lastIndex - 1) {
        const mappedCard = lastGame.map((gameCard) => gameCard.cs);
        // const mappedCard = [
        //   [14, 10, 4, 43, 41, 50, 47, 19, 13, 5, 44, 36, 34],
        //   [46, 35, 25, 22, 17, 51, 32, 27, 18, 16, 29, 24, 21],
        //   [42, 26, 12, 39, 37, 38, 28, 15, 11, 8, 0, 45, 33],
        //   [49, 40, 31, 23, 9, 1, 48, 30, 7, 6, 20, 3, 2],
        // ];
        const boBai: number[] = [];
        for (let i = 0; i < 13; i++) {
          boBai.push(mappedCard[0][i]);
          boBai.push(mappedCard[1][i]);
          boBai.push(mappedCard[2][i]);
          boBai.push(mappedCard[3][i]);
        }
        console.log(boBai);
        setCards((pre) => [...pre, boBai]);
      }
    }
  }, [state.foundAt, state.crawingRoom]);

  // Hàm tạo mảng bài ngẫu nhiên
  // const addRandomCards = () => {
  //   var deck = [
  //     0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  //     21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
  //     39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
  //   ];
  //   shuffle(deck);
  //   console.log(deck);

  //   setCards((prevCards) => [...prevCards, deck]);
  // };

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
            <div className="text-xs text-muted-foreground">
              Showing <strong>{cards.length}</strong> of cards
            </div>
            {/* <Button onClick={addRandomCards}>Add Random Cards</Button> */}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
