import type { Transaction, Budget, Goal, Category } from '../types';

export const categories: Category[] = ['Groceries', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Food', 'Health', 'Miscellaneous'];

export const initialTransactions: Transaction[] = [
  { id: 't1', date: '2025-10-01', description: 'Monthly Salary', amount: 65000, category: 'Miscellaneous', type: 'income' },
  { id: 't2', date: '2025-10-05', description: 'Apartment Rent', amount: 15000, category: 'Bills', type: 'expense' },
  { id: 't3', date: '2025-10-05', description: 'SIP Investment - Nifty 50 Index Fund', amount: 5000, category: 'Miscellaneous', type: 'expense' },
  { id: 't4', date: '2025-10-07', description: 'Electricity Bill', amount: 1200, category: 'Bills', type: 'expense' },
  { id: 't5', date: '2025-10-08', description: 'Internet Bill', amount: 800, category: 'Bills', type: 'expense' },
  { id: 't6', date: '2025-10-10', description: 'Groceries from DMart', amount: 4500, category: 'Groceries', type: 'expense' },
  { id: 't7', date: '2025-10-12', description: 'Weekend Dinner at Imperfecto', amount: 1800, category: 'Food', type: 'expense' },
  { id: 't8', date: '2025-10-15', description: 'Myntra Shopping', amount: 2500, category: 'Shopping', type: 'expense' },
  { id: 't9', date: '2025-10-18', description: 'Movie - Jawan 2', amount: 750, category: 'Entertainment', type: 'expense' },
  { id: 't10', date: '2025-10-20', description: 'Metro Card Recharge', amount: 1000, category: 'Transport', type: 'expense' },
  { id: 't11', date: '2025-10-22', description: 'Zomato Order', amount: 450, category: 'Food', type: 'expense' },
  { id: 't12', date: '2025-10-25', description: 'Amazon Order - Electronics', amount: 3200, category: 'Shopping', type: 'expense' },
  { id: 't13', date: '2025-10-28', description: 'Ola ride to airport', amount: 600, category: 'Transport', type: 'expense' },
];

export const initialBudgets: Budget[] = [
  { id: 'b1', category: 'Food', limit: 8000 },
  { id: 'b2', category: 'Transport', limit: 3000 },
  { id: 'b3', category: 'Entertainment', limit: 3500 },
  { id: 'b4', category: 'Shopping', limit: 7000 },
  { id: 'b5', category: 'Bills', limit: 18000 },
  { id: 'b6', category: 'Groceries', limit: 5000 },
];

export const initialGoals: Goal[] = [
  { id: 'g1', name: 'Emergency Fund', targetAmount: 150000, currentAmount: 40000, deadline: '2027-03-31' },
  { id: 'g2', name: 'Down payment for a Car', targetAmount: 200000, currentAmount: 65000, deadline: '2027-09-30' },
  { id: 'g3', name: 'Europe Trip', targetAmount: 250000, currentAmount: 30000, deadline: '2028-12-31' },
];