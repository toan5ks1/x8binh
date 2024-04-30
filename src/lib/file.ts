import { toast } from '../components/toast/use-toast';

const updateFile = async (accountsUpdate: any, accountType: string) => {
  // const accountsUpdate = accounts[accountType];
  // console.log('accountsUpdate', accountsUpdate);

  const accountsText = accountsUpdate
    .map(
      (account: { isSelected: any; username: any; password: any }) =>
        `${account.username}|${account.password}|${account.isSelected}`
    )
    .join('\n');
  if (accountsText) {
    console.log('accountsText', accountsText);
    window.backend.sendMessage(
      'update-file',
      accountsText,
      [`account/${accountType.toLowerCase()}Account.txt`],
      accountType
    );

    toast({
      title: 'Updated account',
      description: `All tasks done for ${accountType.toLowerCase()} account`,
    });
  }
};

const readFile = (accountType: string) => {
  window.backend.sendMessage(
    'read-file',
    [
      // `C:/Users/PC/AppData/Local/Programs/electron-react-boilerplate/resources/account/${accountType.toLowerCase()}Account.txt`,
      `account/${accountType.toLowerCase()}Account.txt`,
    ],
    accountType
  );
};

export { readFile, updateFile };
