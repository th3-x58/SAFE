
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Transaction } from '../../types';
import Card from '../common/Card';
import { formatCurrency } from '../../lib/utils';

interface SpendingChartProps {
  transactions: Transaction[];
}

const COLORS = ['#13B9B9', '#0c4a6e', '#0369a1', '#0284c7', '#0ea5e9', '#38bdf8'];

const SpendingChart: React.FC<SpendingChartProps> = ({ transactions }) => {
  const chartData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const spendingByCategory = expenses.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(spendingByCategory)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  return (
    <Card>
        <h3 className="text-lg font-semibold text-gray-800">Spending Analysis</h3>
        <div className="w-full h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `₹${Number(value) / 1000}k`} tick={{ fontSize: 12 }} />
                    <Tooltip 
                        contentStyle={{
                            borderRadius: '0.5rem',
                            border: '1px solid #e2e8f0',
                            fontSize: '0.875rem'
                        }}
                        formatter={(value: number) => formatCurrency(value)} 
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                       {chartData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    </Card>
  );
};

export default SpendingChart;
