import { ScrollArea } from '../../../../components/ui/scroll-area';

interface BotCmpProps {
  name: string;
  userId: string | undefined;
  connectionStatus: string;
  messageHistory: any;
}
export const BotCmp = ({
  name,
  userId,
  connectionStatus,
  messageHistory,
}: BotCmpProps) => {
  return (
    <div className="flex">
      <div className="px-4 space-y-4">
        <div className="flex">
          <p className="w-full truncate">
            {name}:{' '}
            {connectionStatus == 'Uninstantiated' ? userId : connectionStatus}
          </p>
        </div>

        <div className="">
          <ScrollArea className="h-32 w-72 rounded-md border">
            <div className="p-4">
              <h4 className="mb-4 text-sm font-medium leading-none">
                Messages:
              </h4>
              {messageHistory.map((tag: any, index: number) => (
                <div key={index} className="text-sm">
                  {JSON.stringify(tag)}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
