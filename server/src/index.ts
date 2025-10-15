import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from './generated/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

const prisma = new PrismaClient();
async function seedIfEmpty() {
  const [txCount, budgetCount, goalCount] = await Promise.all([
    prisma.transaction.count(),
    prisma.budget.count(),
    prisma.goal.count(),
  ]);
  if (txCount === 0 && budgetCount === 0 && goalCount === 0) {
    await prisma.$transaction([
      prisma.transaction.create({ data: { date: '2025-10-01', description: 'Monthly Allowance from Parents', amount: 20000, category: 'Miscellaneous', type: 'income' } }),
      prisma.transaction.create({ data: { date: '2025-10-01', description: 'Hostel & Mess Fees', amount: 8000, category: 'Bills', type: 'expense' } }),
      prisma.transaction.create({ data: { date: '2025-10-02', description: 'Final Year Project Stationery', amount: 750, category: 'Stationery', type: 'expense' } }),
    ]);
    await prisma.$transaction([
      prisma.budget.create({ data: { category: 'Food', limit: 3000 } }),
      prisma.budget.create({ data: { category: 'Transport', limit: 1000 } }),
      prisma.budget.create({ data: { category: 'Entertainment', limit: 1000 } }),
      prisma.budget.create({ data: { category: 'Shopping', limit: 1500 } }),
      prisma.budget.create({ data: { category: 'Bills', limit: 8500 } }),
      prisma.budget.create({ data: { category: 'Groceries', limit: 1000 } }),
      prisma.budget.create({ data: { category: 'Stationery', limit: 1000 } }),
      prisma.budget.create({ data: { category: 'Education', limit: 3000 } }),
    ]);
    await prisma.$transaction([
      prisma.goal.create({ data: { name: 'New Laptop for Placements', targetAmount: 80000, currentAmount: 25000, deadline: '2026-03-31' } }),
      prisma.goal.create({ data: { name: 'Goa Trip with friends', targetAmount: 25000, currentAmount: 5000, deadline: '2026-06-30' } }),
      prisma.goal.create({ data: { name: 'Advanced Certification Fund', targetAmount: 15000, currentAmount: 7500, deadline: '2025-12-31' } }),
    ]);
  }
}

// Schemas
const transactionSchema = z.object({
  date: z.string(),
  description: z.string(),
  amount: z.number().int().nonnegative(),
  category: z.string(),
  type: z.enum(['income', 'expense'])
});

const budgetSchema = z.object({
  category: z.string(),
  limit: z.number().int().nonnegative()
});

const goalSchema = z.object({
  name: z.string(),
  targetAmount: z.number().int().nonnegative(),
  currentAmount: z.number().int().nonnegative(),
  deadline: z.string()
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Transactions
app.get('/api/transactions', async (_req, res) => {
  const items = await prisma.transaction.findMany({ orderBy: { date: 'desc' } });
  res.json(items);
});

app.post('/api/transactions', async (req, res) => {
  const parsed = transactionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const created = await prisma.transaction.create({ data: parsed.data });
  res.status(201).json(created);
});

app.delete('/api/transactions/:id', async (req, res) => {
  await prisma.transaction.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

app.post('/api/transactions/bulk', async (req, res) => {
  const items = z.array(transactionSchema).parse(req.body);
  const created = await prisma.$transaction(items.map(data => prisma.transaction.create({ data })));
  res.status(201).json(created);
});

// Budgets
app.get('/api/budgets', async (_req, res) => {
  const items = await prisma.budget.findMany();
  res.json(items);
});

app.put('/api/budgets/:id', async (req, res) => {
  const parsed = budgetSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const updated = await prisma.budget.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(updated);
});

// Goals
app.get('/api/goals', async (_req, res) => {
  const items = await prisma.goal.findMany();
  res.json(items);
});

app.put('/api/goals/:id', async (req, res) => {
  const parsed = goalSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const updated = await prisma.goal.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(updated);
});

// Auth
const registerSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
const loginSchema = registerSchema;

app.post('/api/auth/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Email already in use' });
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hash } });
  res.status(201).json({ id: user.id, email: user.email });
});

app.post('/api/auth/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
  res.json({ token });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});


