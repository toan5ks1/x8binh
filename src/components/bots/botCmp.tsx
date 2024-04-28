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
    <Card x-chunk="dashboard-07-chunk-1" className="flex-1 p-4">
      <CardHeader className="flex flex-row justify-between items-end px-2 py-0">
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription>
          {connectionStatus === 'Uninstantiated'
            ? userId
              ? userId
              : 'Not logged'
            : connectionStatus}
        </CardDescription>
        <Button onClick={onClearMessage} className="h-4">
          <Trash className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent className="p-2">
        <ScrollArea className="h-36 rounded-md">
          <Table>
            <TableBody>
              {(messageHistory.length ? messageHistory : ['No message']).map(
                (tag: any, index: number) => (
                  <TableRow key={index} className="h-2">
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
