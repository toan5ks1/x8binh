import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/card';
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table';

interface BotStatusProps {
  name: string;
  userId: string | undefined;
  connectionStatus: string;
  messageHistory: any;
}

export const BotStatus = ({
  name,
  userId,
  connectionStatus,
  messageHistory,
}: BotStatusProps) => {
  return (
    <Card x-chunk="dashboard-07-chunk-1">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {connectionStatus === 'Uninstantiated' ? userId : connectionStatus}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardHeader>
          <CardTitle>Stock</CardTitle>
          <CardDescription>
            Lipsum dolor sit amet, consectetur adipiscing elit
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableRow>
              {Array.isArray(messageHistory) ? (
                messageHistory.map((tag: any, index: number) => (
                  <TableCell key={index} className="font-semibold">
                    {JSON.stringify(tag)}
                  </TableCell>
                ))
              ) : (
                <TableCell>No messages found</TableCell>
              )}
            </TableRow>
          </Table>
        </CardContent>
      </CardContent>
    </Card>
  );
};
