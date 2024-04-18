import { Trash } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

interface BotStatusProps {
  name: string;
  userId: string | undefined;
  connectionStatus: string;
  messageHistory: string[];
  setMessageHistory: any;
}

export const BotStatus = ({
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
    <Card x-chunk="dashboard-07-chunk-1">
      <CardHeader>
        <CardTitle className="flex justify-between">
          {name}
          <Button onClick={onClearMessage} className="p-0 py-0 px-[10px]">
            <Trash className="h-3.5 w-3.5" />
          </Button>
        </CardTitle>
        <CardDescription>
          {connectionStatus === 'Uninstantiated'
            ? userId
              ? userId
              : 'Not logged'
            : connectionStatus}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messageHistory !== undefined ? (
                messageHistory.map((tag: any, index: number) => (
                  <TableRow>
                    <TableCell key={index} className="font-semibold">
                      {JSON.stringify(tag)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="font-semibold">No message</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </CardContent>
    </Card>
  );
};
