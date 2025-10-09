import type { Transaction, Budget, Goal, Category } from '../types';

export const categories: Category[] = ['Groceries', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Food', 'Health', 'Miscellaneous'];

export const initialTransactions: Transaction[] = [
  { id: 't1', date: '2025-10-10', description: 'Monthly Allowance', amount: 18000, category: 'Miscellaneous', type: 'income' },
  { id: 't2', date: '2025-10-09', description: 'Pizza Party with friends', amount: 950, category: 'Food', type: 'expense' },
  { id: 't3', date: '2025-10-08', description: 'Mobile Recharge', amount: 500, category: 'Bills', type: 'expense' },
  { id: 't4', date: '2025-10-07', description: 'Netflix Subscription', amount: 200, category: 'Entertainment', type: 'expense' },
  { id: 't5', date: '2025-10-06', description: 'Auto to College', amount: 150, category: 'Transport', type: 'expense' },
  { id: 't6', date: '2025-10-05', description: 'Hostel Mess Dues', amount: 3500, category: 'Bills', type: 'expense' },
  { id: 't7', date: '2025-10-04', description: 'Stationery and Books', amount: 1200, category: 'Shopping', type: 'expense' },
  { id: 't8', date: '2025-10-03', description: 'Cold Coffee at Cafe', amount: 250, category: 'Food', type: 'expense' },
  { id: 't9', date: '2025-10-02', description: 'Movie Night', amount: 600, category: 'Entertainment', type: 'expense' },
  { id: 't10', date: '2025-10-01', description: 'Zomato Chicken Roll', amount: 180, category: 'Food', type: 'expense' },
];

export const initialBudgets: Budget[] = [
  { id: 'b1', category: 'Food', limit: 4000 },
  { id: 'b2', category: 'Transport', limit: 1500 },
  { id: 'b3', category: 'Entertainment', limit: 2500 },
  { id: 'b4', category: 'Shopping', limit: 3000 },
  { id: 'b5', category: 'Bills', limit: 5000 },
];

export const initialGoals: Goal[] = [
  { id: 'g1', name: 'Goa Trip with Friends', targetAmount: 25000, currentAmount: 8000, deadline: '2026-03-31' },
  { id: 'g2', name: 'New Gaming Laptop', targetAmount: 90000, currentAmount: 22000, deadline: '2026-09-30' },
  { id: 'g3', name: 'Data Science Course', targetAmount: 15000, currentAmount: 10000, deadline: '2025-12-31' },
];