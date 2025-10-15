import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
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

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});



