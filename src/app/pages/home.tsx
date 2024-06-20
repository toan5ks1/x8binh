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

export const HomePage = (cardDeck: any) => {
  const [cards, setCards] = useState<number[][]>([]);
  const { state, crawingRoom } = useContext(AppContext);

  useEffect(() => {
    if (state.foundAt) {
      const desk = crawingRoom.cardGame;
      console.log(desk);
      const lastIndex = desk.length - 1;
      const lastGame = desk[lastIndex];

      if (lastIndex > 0 && cards.length === lastIndex - 1) {
        const mappedCard = lastGame.map((gameCard) => gameCard.cs);
        const boBai: number[] = [];

        if (mappedCard.length === 4) {
          for (let i = 0; i < 13; i++) {
            boBai.push(mappedCard[0][i]);
            boBai.push(mappedCard[1][i]);
            boBai.push(mappedCard[2][i]);
            boBai.push(mappedCard[3][i]);
          }
          setCards((pre) => [...pre, boBai]);
        }
      }
    }
  }, [state.foundAt, crawingRoom.cardGame]);

  useEffect(() => {
    if (state.shouldDisconnect) {
      setCards([]);
    }
  }, [state.shouldDisconnect]);

  const addRandomCards = () => {
    setCards((prevCards) => [...prevCards, getRandomCards()]);
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
                    className={`relative !rounded-[20px] bg-opacity-60 ${
                      index == state.currentGame.number && 'bg-[#a2a0a0]'
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
          {process.env.NODE_ENV == 'development' && (
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
          )}
        </Card>
        <div>
          <div className="sticky top-[90px]">
            <Card className="w-full flex flex-col gap-4 border-0">
              {accounts['MAIN'].map(
                (main: any, index: any) =>
                  main.isSelected && (
                    <TerminalBoard key={`main ` + index} main={main} />
                  )
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
