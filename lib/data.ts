import type { Transaction, Budget, Goal, Category } from '../types';

export const categories: Category[] = ['Groceries', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Food', 'Health', 'Miscellaneous', 'Stationery', 'Education'];

export const initialTransactions: Transaction[] = [
  { id: 't1', date: '2025-10-01', description: 'Monthly Allowance from Parents', amount: 20000, category: 'Miscellaneous', type: 'income' },
  { id: 't2', date: '2025-10-01', description: 'Hostel & Mess Fees', amount: 8000, category: 'Bills', type: 'expense' },
  { id: 't3', date: '2025-10-02', description: 'Final Year Project Stationery', amount: 750, category: 'Stationery', type: 'expense' },
  { id: 't4', date: '2025-10-04', description: 'Bike Fuel', amount: 500, category: 'Transport', type: 'expense' },
  { id: 't5', date: '2025-10-05', description: 'Cloud Certification Exam Fee', amount: 2500, category: 'Education', type: 'expense' },
  { id: 't6', date: '2025-10-07', description: 'Canteen Lunch with friends', amount: 250, category: 'Food', type: 'expense' },
  { id: 't7', date: '2025-10-09', description: 'Zomato Order', amount: 400, category: 'Food', type: 'expense' },
  { id: 't8', date: '2025-10-11', description: 'Movie Ticket - "Fighter"', amount: 350, category: 'Entertainment', type: 'expense' },
  { id: 't9', date: '2025-10-12', description: 'Myntra - T-shirt', amount: 1200, category: 'Shopping', type: 'expense' },
  { id: 't10', date: '2025-10-14', description: 'Snacks & Instant Noodles', amount: 600, category: 'Groceries', type: 'expense' },
  { id: 't11', date: '2025-10-15', description: 'Phone Recharge', amount: 250, category: 'Bills', type: 'expense' },
  { id: 't12', date: '2025-10-16', description: 'Metro Card Recharge', amount: 600, category: 'Transport', type: 'expense' },
  { id: 't13', date: '2025-10-18', description: 'New Earphones', amount: 500, category: 'Shopping', type: 'expense' },
  { id: 't14', date: '2025-10-20', description: 'Textbooks for Semester', amount: 450, category: 'Stationery', type: 'expense' },
];

export const initialBudgets: Budget[] = [
  { id: 'b1', category: 'Food', limit: 3000 },
  { id: 'b2', category: 'Transport', limit: 1000 },
  { id: 'b3', category: 'Entertainment', limit: 1000 },
  { id: 'b4', category: 'Shopping', limit: 1500 },
  { id: 'b5', category: 'Bills', limit: 8500 },
  { id: 'b6', category: 'Groceries', limit: 1000 },
  { id: 'b7', category: 'Stationery', limit: 1000 },
  { id: 'b8', category: 'Education', limit: 3000 },
];

export const initialGoals: Goal[] = [
  { id: 'g1', name: 'New Laptop for Placements', targetAmount: 80000, currentAmount: 25000, deadline: '2026-03-31' },
  { id: 'g2', name: 'Goa Trip with friends', targetAmount: 25000, currentAmount: 5000, deadline: '2026-06-30' },
  { id: 'g3', name: 'Advanced Certification Fund', targetAmount: 15000, currentAmount: 7500, deadline: '2025-12-31' },
];