import { debounce } from 'lodash';
import { Paperclip, Share } from 'lucide-react';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { Textarea } from '../../../components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../components/ui/tooltip';
import { BotContext } from '../../../context/BotContext';

type Account = {
  account: string;
  password: string;
};

export const SettingPage: React.FC = () => {
  const [accountDetails, setAccountDetails] = useState({
    mainAccount: '',
    subAccount: '',
  });

  const mainAccountFileInputRef = useRef(null);

  const { dispatch, state: bots } = useContext(BotContext);

  const readValidAccount = (input: any): Account[] => {
    const lines = input.split('\n');

    const accounts = lines.map(
      (line: { split: (arg0: string) => [any, any] }) => {
        const [account, password] = line.split('|');
        return { account, password };
      }
    );

    return accounts;
  };

  const updateFileDebounced = useCallback(
    debounce((newText) => {
      console.log('Update');
      window.backend.sendMessage('update-file', newText);
    }, 1000),
    []
  );

  const updateMainAccount = useCallback(
    debounce((text) => {
      console.log('Updating main account with:', text);
      window.backend.sendMessage('update-file', text, [
        'account/mainAccount.txt',
      ]);
    }, 1500),
    []
  );

  const handleMainAccountChange = (e: { target: { value: any } }) => {
    const text = e.target.value;
    setAccountDetails({ ...accountDetails, mainAccount: text });
    updateMainAccount(text);
    updateFileDebounced(text);
    dispatch({
      type: 'UPDATE_BOTS',
      payload: readValidAccount(text),
    });
  };

  const triggerFileInputClick = (ref: any) => {
    ref.current.click();
  };

  useEffect(() => {
    const handleFileUpdated = (message: any) => {
      console.log(message);
    };

    const handleFileError = (error: any) => {
      console.error('Error updating file:', error);
    };

    window.backend.on('file-updated', handleFileUpdated);
    window.backend.on('file-write-error', handleFileError);

    return () => {
      window.backend.removeListener('file-updated', handleFileUpdated);
      window.backend.removeListener('file-write-error', handleFileError);
    };
  }, []);

  useEffect(() => {
    const handleFileData = (_: any, data: any) => {
      console.log('File data received:', readValidAccount(_));
      dispatch({
        type: 'UPDATE_BOTS',
        payload: readValidAccount(_),
      });
      setAccountDetails((prevDetails) => ({
        ...prevDetails,
        mainAccount: _,
      }));
    };

    const handleFileError = (_: any, error: any) => {
      console.error('File read error:', error);
    };

    window.backend.on('read-file', handleFileData);
    window.backend.on('file-read-error', handleFileError);

    window.backend.sendMessage('read-file', ['account/mainAccount.txt']);

    return () => {
      window.backend.removeListener('read-file', handleFileData);
      window.backend.removeListener('file-read-error', handleFileError);
    };
  }, []);

  console.log(bots);

  return (
    <div className="flex flex-col">
      <header className="flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <h1 className="text-xl font-semibold">Setting</h1>
      </header>
      <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          className="relative hidden flex-col items-start gap-8 md:flex"
          x-chunk="dashboard-03-chunk-0"
        >
          <form className="grid w-full items-start gap-6">
            <fieldset className="grid gap-6 rounded-lg border p-4">
              <legend className="-ml-1 px-1 text-sm font-medium">
                Sub account
              </legend>
              <div className="grid gap-3">
                <Label htmlFor="sub-account">Accounts</Label>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      {bots
                        .getHeaderGroups()
                        .map((headerGroup: { id: any; headers: any[] }) => (
                          <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                              return (
                                <TableHead key={header.id}>
                                  {header.id}
                                  {/* {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )} */}
                                </TableHead>
                              );
                            })}
                          </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                      {bots.getRowModel().rows?.length ? (
                        bots
                          .getRowModel()
                          .rows.map(
                            (row: {
                              id: React.Key | null | undefined;
                              getIsSelected: () => any;
                              getVisibleCells: () => any[];
                            }) => (
                              <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                              >
                                {row.getVisibleCells().map((cell) => (
                                  <TableCell key={cell.id}>
                                    {/* {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )} */}
                                  </TableCell>
                                ))}
                              </TableRow>
                            )
                          )
                      ) : (
                        <TableRow>
                          <TableCell
                            // colSpan={columns.length}
                            className="h-24 text-center"
                          >
                            No results.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <ul>
                  {bots.map(
                    (bot: { account: any; password: any }, index: any) => (
                      <li key={index}>
                        Tài khoản: {bot.account} - Mật khẩu: {bot.password}
                      </li>
                    )
                  )}
                </ul>
                <Textarea
                  id="main-account"
                  placeholder="Main account here..."
                  className="min-h-[9.5rem]"
                  value={accountDetails.mainAccount}
                  onChange={(e) => handleMainAccountChange(e)}
                />
                <div className="flex items-center p-3 pt-0">
                  {/* Hidden File Input for Main Account */}
                  <input
                    type="file"
                    accept=".txt"
                    ref={mainAccountFileInputRef}
                    onChange={(e) => handleMainAccountChange(e)}
                    style={{ display: 'none' }}
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          triggerFileInputClick(mainAccountFileInputRef)
                        }
                      >
                        <Paperclip className="size-4" />
                        <span className="sr-only">Attach file</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Upload file for Main account
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Share className="size-4" />
                        <span className="sr-only">Use Microphone</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Use Microphone</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </fieldset>
            <fieldset className="grid gap-6 rounded-lg border p-4">
              <legend className="-ml-1 px-1 text-sm font-medium">
                Sub account
              </legend>
              <div className="grid gap-3">
                <Label htmlFor="sub-account">Accounts</Label>
                <Textarea
                  id="sub-account"
                  placeholder="Sub account here..."
                  className="min-h-[9.5rem]"
                />
                <div className="flex items-center p-3 pt-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Paperclip className="size-4" />
                        <span className="sr-only">Attach file</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Attach File</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Share className="size-4" />
                        <span className="sr-only">Use Microphone</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Use Microphone</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
        <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 lg:col-span-2">
          <Badge variant="outline" className="absolute right-3 top-3">
            Bot
          </Badge>
          <div className="flex-1" />
          <form
            className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
            x-chunk="dashboard-03-chunk-1"
          >
            <Label htmlFor="message" className="sr-only">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Account bot here..."
              className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
            />
            <div className="flex items-center p-3 pt-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Paperclip className="size-4" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Attach File</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Share className="size-4" />
                    <span className="sr-only">Upload bot account</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Upload bot account</TooltipContent>
              </Tooltip>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
