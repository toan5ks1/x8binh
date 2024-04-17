import { Paperclip, Share } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../components/ui/tooltip';

export const SettingPage: React.FC = () => {
  const [accountDetails, setAccountDetails] = useState({
    mainAccount: '',
    subAccount: '',
  });

  const mainAccountFileInputRef = useRef(null);
  const subAccountFileInputRef = useRef(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    accountType: 'main' | 'sub'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        const [username, password] = text.split('|');
        setAccountDetails(
          (prevDetails: { mainAccount: string; subAccount: string }) => ({
            ...prevDetails,
            [accountType + 'Account']: username + ' | ' + password,
          })
        );
      }
    };
    reader.readAsText(file);
  };

  const triggerFileInputClick = (ref: any) => {
    ref.current.click();
  };

  useEffect(() => {
    const handleFileData = (_: any, data: any) => {
      console.log('File data received:', data);
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
              {/* Other inputs omitted for brevity */}
              <Textarea
                id="main-account"
                placeholder="Main account here..."
                className="min-h-[9.5rem]"
                value={accountDetails.mainAccount}
                onChange={(e) =>
                  setAccountDetails({
                    ...accountDetails,
                    mainAccount: e.target.value,
                  })
                }
              />
              <div className="flex items-center p-3 pt-0">
                {/* Hidden File Input for Main Account */}
                <input
                  type="file"
                  accept=".txt"
                  ref={mainAccountFileInputRef}
                  onChange={(e) => handleFileChange(e, 'main')}
                  style={{ display: 'none' }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => triggerFileInputClick(mainAccountFileInputRef)}
                >
                  <Paperclip className="size-4" />
                  <span className="sr-only">Attach file</span>
                </Button>
                {/* Other buttons */}
              </div>
            </fieldset>
            <fieldset className="grid gap-6 rounded-lg border p-4">
              <legend className="-ml-1 px-1 text-sm font-medium">
                Sub account
              </legend>
              <div className="grid gap-3">
                <Label htmlFor="sub-account">Account</Label>
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
