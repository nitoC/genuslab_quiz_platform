export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isPrimary?: boolean;
}
export interface IBankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isPrimary?: boolean;
  userId?: string;
  type?: "BANK";
  provider?: string;
  providerAccountId?: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;
  token_types: string;
  scope?: string;
}

export interface BankOption {
  code: string;
  name: string;
}
