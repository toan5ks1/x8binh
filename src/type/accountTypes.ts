export type AccountType = 'MAIN' | 'SUB' | 'BOT';

export interface AccountInfo {
  username: string;
  password: string;
  app_id: string;
  os: string;
  device: string;
  browser: string;
  fg: string;
  time: number;
  aff_id: string;
  isSelected?: boolean;
  info?: any;
  main_balance?: any;
}

export interface AccountState {
  accounts: Record<AccountType, AccountInfo[]>;
  addAccount: (type: AccountType, account: AccountInfo) => void;
  updateAccountBalance: (username: string, main_balance: any) => void;
}
