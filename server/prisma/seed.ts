import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const [txCount, budgetCount, goalCount] = await Promise.all([
    prisma.transaction.count(),
    prisma.budget.count(),
    prisma.goal.count(),
  ]);
  if (txCount === 0 && budgetCount === 0 && goalCount === 0) {
    // Seed for a working professional profile (age 25-65)
    // Monthly salary, rent, utilities, groceries, transport, subscriptions, dining, investments, emergency fund contribution
    await prisma.$transaction([
      prisma.transaction.create({ data: { date: '2025-10-01', description: 'Monthly Salary - Inhand', amount: 95000, category: 'Miscellaneous', type: 'income' } }),
      prisma.transaction.create({ data: { date: '2025-10-01', description: 'Rent - 2BHK Apartment', amount: 25000, category: 'Bills', type: 'expense' } }),
      prisma.transaction.create({ data: { date: '2025-10-03', description: 'Electricity & Water Bills', amount: 3500, category: 'Bills', type: 'expense' } }),
      prisma.transaction.create({ data: { date: '2025-10-04', description: 'Groceries - Monthly', amount: 7000, category: 'Groceries', type: 'expense' } }),
      prisma.transaction.create({ data: { date: '2025-10-05', description: 'Mobile & Internet', amount: 1200, category: 'Bills', type: 'expense' } }),
      prisma.transaction.create({ data: { date: '2025-10-06', description: 'Fuel & Local Commute', amount: 3000, category: 'Transport', type: 'expense' } }),
      prisma.transaction.create({ data: { date: '2025-10-07', description: 'Dining Out with Friends', amount: 1800, category: 'Food', type: 'expense' } }),
      prisma.transaction.create({ data: { date: '2025-10-08', description: 'Netflix + Spotify Subscriptions', amount: 999, category: 'Entertainment', type: 'expense' } }),
      prisma.transaction.create({ data: { date: '2025-10-09', description: 'SIP - Index Fund', amount: 8000, category: 'Education', type: 'expense' } }),
      prisma.transaction.create({ data: { date: '2025-10-10', description: 'Emergency Fund Contribution', amount: 5000, category: 'Shopping', type: 'expense' } }),
    ]);

    await prisma.$transaction([
      prisma.budget.create({ data: { category: 'Food', limit: 6000 } }),
      prisma.budget.create({ data: { category: 'Transport', limit: 5000 } }),
      prisma.budget.create({ data: { category: 'Entertainment', limit: 3000 } }),
      prisma.budget.create({ data: { category: 'Shopping', limit: 4000 } }),
      prisma.budget.create({ data: { category: 'Bills', limit: 32000 } }),
      prisma.budget.create({ data: { category: 'Groceries', limit: 8000 } }),
      prisma.budget.create({ data: { category: 'Stationery', limit: 1000 } }),
      prisma.budget.create({ data: { category: 'Education', limit: 9000 } }),
    ]);

    await prisma.$transaction([
      prisma.goal.create({ data: { name: 'Emergency Fund (6 months)', targetAmount: 300000, currentAmount: 65000, deadline: '2026-12-31' } }),
      prisma.goal.create({ data: { name: 'Down Payment for Car', targetAmount: 200000, currentAmount: 40000, deadline: '2026-06-30' } }),
      prisma.goal.create({ data: { name: 'Vacation to Europe', targetAmount: 250000, currentAmount: 25000, deadline: '2027-09-30' } }),
    ]);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});



