// import { ScrollArea } from '../../../../components/ui/scroll-area';

// interface BotCmpProps {
//   name: string;
//   userId: string | undefined;
//   connectionStatus: string;
//   messageHistory: any;
// }
// export const BotCmp = ({
//   name,
//   userId,
//   connectionStatus,
//   messageHistory,
// }: BotCmpProps) => {
//   return (
//     <div className="flex">
//       <div className="px-4 space-y-4">
//         <div className="flex">
//           <p className="w-full truncate">
//             {name}:{' '}
//             {connectionStatus == 'Uninstantiated' ? userId : connectionStatus}
//           </p>
//         </div>

//         <div className="">
//           <ScrollArea className="h-32 w-72 rounded-md border">
//             <div className="p-4">
//               <h4 className="mb-4 text-sm font-medium leading-none">
//                 Messages:
//               </h4>
//               {messageHistory.map((tag: any, index: number) => (
//                 <div key={index} className="text-sm">
//                   {JSON.stringify(tag)}
//                 </div>
//               ))}
//             </div>
//           </ScrollArea>
//         </div>
//       </div>
//     </div>
//   );
// };

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
                  <div key={index} className="text-sm">
                    {JSON.stringify(tag)}
                  </div>
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
