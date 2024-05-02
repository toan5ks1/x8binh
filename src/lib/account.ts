import { now } from 'lodash';
import { toast } from '../components/toast/use-toast';

const readValidAccount = (input: string): any => {
  // console.log('input', input);
  return input
    .trim()
    .split('\n')
    .map((line) => {
      if (line != '') {
        const [username, password, IsSelected, proxy, port] = line
          .trim()
          .split('|');
        return {
          username,
          password: password || '',
          app_id: 'rik.vip',
          os: 'Windows',
          device: 'Computer',
          browser: 'chrome',
          proxy: proxy,
          port: port,
          fg: 'fea47ac6e0fd72cd768e977d51f3dc45',
          time: now(),
          aff_id: 'hit',
          isSelected: IsSelected === 'true',
        };
      } else {
        return;
      }
    });
  // .filter((account) => account.username);
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

const generateAccount = (account: any) => {
  var cash = 0;
  // if (account.isSelected) {
  //   const data = (await accountLogin(account)) as any;
  //   cash = Array.isArray(data?.data) ? data?.data[0].main_balance : 0;
  // }

  return {
    username: account.username,
    password: account.password,
    isSelected: account.isSelected,
    app_id: 'rik.vip',
    os: 'Windows',
    device: 'Computer',
    browser: 'chrome',
    fg: 'fea47ac6e0fd72cd768e977d51f3dc45',
    proxy: account.proxy,
    port: account.port,
    time: now(),
    aff_id: 'hit',
    main_balance: 0,
  };
};

export { accountExists, addUniqueAccounts, generateAccount, readValidAccount };
