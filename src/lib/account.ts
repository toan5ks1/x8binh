import { toast } from '../components/toast/use-toast';

const defaultLoginParams = {
  app_id: 'b52.club',
  os: 'OS X',
  device: 'Computer',
  browser: 'chrome',
  fg: '94c4b7799e307a8ad4b6a666bd26bd11',
};

const readValidAccount = (input: string): any => {
  return input
    .trim()
    .split('\n')
    .map((line) => {
      if (line != '') {
        const [username, password, isSelected, token] = line.trim().split('|');
        return {
          username,
          password,
          isSelected: Boolean(isSelected),
          token,
          fg: defaultLoginParams.fg,
        };
      } else {
        return;
      }
    });
};

const accountExists = (
  newAccount: any,
  currentAccounts: any,
  accountType: any
) => {
  return currentAccounts[accountType].some(
    (account: { username: any }) => account.username === newAccount.username
  );
};

const addUniqueAccounts = async (
  newAccounts: any[],
  accounts: any,
  accountType: string,
  addAccount: any
) => {
  const addAccountPromises = newAccounts.map(async (account) => {
    if (!accountExists(account, accounts, accountType)) {
      await addAccount(accountType, account);
      return { account, added: true };
    } else {
      toast({
        title: 'Warning',
        description: `Duplicate found: ${account.username} not added`,
      });
      return { account, added: false };
    }
  });

  const results = await Promise.all(addAccountPromises);

  const addedAccounts = results
    .filter((result) => result.added)
    .map((result) => result.account);

  toast({
    title: 'Task Done',
    description: `${addedAccounts.length} account(s) added successfully.`,
  });
};

const generateAccount = ({ username, password, token, isSelected }: any) => {
  return {
    username,
    password,
    isSelected: Boolean(isSelected),
    token,
    fg: defaultLoginParams.fg,
  };
};

export { accountExists, addUniqueAccounts, generateAccount, readValidAccount };
