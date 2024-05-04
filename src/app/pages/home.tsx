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
  const [cards, setCards] = useState<number[][]>([]);

  const { state } = useContext(AppContext);

  useEffect(() => {
    if (state.foundBy) {
      const desk = state.crawingRoom[state.foundBy].cardGame;
      const lastIndex = desk.length - 1;
      const lastGame = desk[lastIndex];

      if (lastIndex > 0 && cards.length === lastIndex - 1) {
        const mappedCard = lastGame.map((gameCard) => gameCard.cs);

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
      <main className="grid flex-1 gap-4 py-4 tablet:grid-cols-3 relative mt-[90px]">
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
                      index + 1 == state.currentGame.number &&
                      'bg-[#9c9c9c] bg-opacity-60 hover:bg-[#9c9c9c]'
                    }`}
                  >
                    <BoardCard
                      cards={card}
                      indexProps={index}
                      numPlayers={cardDeck.cardDeck}
                      currentGame={state.currentGame}
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
