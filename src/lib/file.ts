import { toast } from '../components/toast/use-toast';

const updateFile = async (
  accountsUpdate: any,
  accountType: string,
  gameName: string
) => {
  const accountsText = accountsUpdate
    .map(
      (account: {
        username: string;
        password: string;
        token: string;
        accountType: 'main' | 'sub' | 'bot';
        isSelected: boolean;
      }) =>
        `${account.username}|${account.password}|${
          account.token
        }|${accountType.toLowerCase()}|${account.isSelected}`
    )
    .join('\n');
  if (accountsText) {
    window.backend.sendMessage(
      'update-file',
      accountsText,
      [
        `account/${gameName.toLowerCase()}/${accountType.toLowerCase()}Account.txt`,
      ],
      accountType
    );

    toast({
      title: 'Updated account',
      description: `All tasks done for ${accountType.toLowerCase()} account`,
    });
  }
};

const readFile = (accountType: string, gameName: string) => {
  window.backend.sendMessage(
    'read-file',
    [
      // `C:/Users/PC/AppData/Local/Programs/electron-react-boilerplate/resources/account/${accountType.toLowerCase()}Account.txt`,
      `account/${gameName.toLowerCase()}/${accountType.toLowerCase()}Account.txt`,
    ],
    accountType
  );
};

export { readFile, updateFile };
