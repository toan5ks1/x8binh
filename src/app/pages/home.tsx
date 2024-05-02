import { Plus } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import BoardCard from '../../components/card/boardCard';
import { TerminalBoard } from '../../components/terminal/terminalBoard';
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
import useAccountStore from '../../store/accountStore';

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
        setCards((pre) => [...pre, boBai]);
      }
    }
  }, [state.foundAt, state.crawingRoom]);

  const addRandomCards = () => {
    setCards((prevCards) => [...prevCards, getRandomCards()]);
    console.log(getRandomCards());
  };

  const { accounts } = useAccountStore();

  return (
    <div className="relative h-screen">
      <main className="grid flex-1 gap-4 py-4 tablet:grid-cols-3 relative">
        <Card
          className="tablet:col-span-2 text-center border"
          x-chunk="dashboard-03-chunk-0"
        >
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
        {/* <Sticky scrollElement=".scrollarea"> */}
        <div>
          <div className=" sticky top-[90px]">
            <Card className="w-full flex flex-col gap-4 border-0 ">
              {accounts['MAIN'].map(
                (main: any, index: any) =>
                  main.isSelected && <TerminalBoard key={index} main={main} />
              )}
            </Card>
          </div>
        </div>
        {/* </Sticky> */}
      </main>
    </div>
  );
};
