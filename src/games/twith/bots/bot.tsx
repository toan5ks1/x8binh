import { ScrollArea } from '../../../components/ui/scroll-area';

interface BotStatusProps {
  name: string;
  userId: string | null;
  connectionStatus: string;
  messageHistory: any;
}

export const BotStatus = ({
  name,
  userId,
  connectionStatus,
  messageHistory,
}: BotStatusProps) => {
  const outCmmp = userId ? (
    <div className="flex">
      <span className="font-bold px-4">{name}: </span>
      <div className="px-4 space-y-4">
        <p className="w-full truncate">
          {connectionStatus == 'Uninstantiated' ? userId : connectionStatus}
        </p>

        <div className="">
          <ScrollArea className="h-24 w-72 rounded-md border">
            <div className="p-4">
              <h4 className="mb-4 text-sm font-medium leading-none">
                Messages:
              </h4>
              {messageHistory.map((tag: any) => (
                <div key={tag} className="text-sm">
                  {JSON.stringify(tag)}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );

  return outCmmp;
};
