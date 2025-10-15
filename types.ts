
export type Category = 'Groceries' | 'Transport' | 'Entertainment' | 'Bills' | 'Shopping' | 'Food' | 'Health' | 'Miscellaneous' | 'Stationery' | 'Education';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: Category;
  type: 'income' | 'expense';
}

export interface Budget {
  id: string;
  category: Category;
  limit: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface FinancialData {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
}