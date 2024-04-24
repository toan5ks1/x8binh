import { Trash } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableRow } from '../ui/table';

interface BotStatusProps {
  name: string;
  userId: string | undefined;
  connectionStatus: string;
  messageHistory: string[];
  setMessageHistory: any;
}

export const BotCmp = ({
  name,
  userId,
  connectionStatus,
  messageHistory,
  setMessageHistory,
}: BotStatusProps) => {
  const onClearMessage = () => {
    setMessageHistory([]);
  };
  return (
    <Card x-chunk="dashboard-07-chunk-1" className="flex-1">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {name}{' '}
          <CardDescription>
            {connectionStatus === 'Uninstantiated'
              ? userId
                ? userId
                : 'Not logged'
              : connectionStatus}
          </CardDescription>
          <Button onClick={onClearMessage} className="p-0 py-0 px-[10px]">
            <Trash className="h-3.5 w-3.5" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-36 rounded-md">
          <Table>
            <TableBody>
              {(messageHistory.length ? messageHistory : ['No message']).map(
                (tag: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{JSON.stringify(tag)}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
