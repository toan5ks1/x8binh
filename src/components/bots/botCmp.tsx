import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

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
}: // setMessageHistory,
BotStatusProps) => {
  return (
    <Card x-chunk="dashboard-07-chunk-1" className="flex-1 p-2">
      <CardHeader className="flex flex-row justify-between items-end px-2 py-0">
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardTitle className="text-sm font-normal">
          {connectionStatus === 'Uninstantiated'
            ? userId
              ? userId
              : 'Not logged'
            : connectionStatus}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <CardDescription>
          {messageHistory.length
            ? messageHistory[messageHistory.length - 1]
            : null}
        </CardDescription>
      </CardContent>
    </Card>
  );
};
