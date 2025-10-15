
import React, { useMemo, useState } from 'react';
import type { FinancialData } from '../../types';
import { formatCurrency } from '../../lib/utils';
import OverviewCard from '../dashboard/OverviewCard';
import SpendingChart from '../dashboard/SpendingChart';
import RecentTransactions from '../dashboard/RecentTransactions';
import FinancialGoalsPreview from '../dashboard/FinancialGoalsPreview';
import AiAssistant from '../dashboard/AiAssistant';
import AiInsights from '../dashboard/AiInsights';
import { ArrowUpIcon, ArrowDownIcon } from '../../lib/icons';
import Modal from '../common/Modal';

interface DashboardProps {
  financialData: FinancialData;
  onUpdateIncome: (newIncome: number) => void;
  onUpdateExpenses: (newExpenses: number) => void;
  aiAssistantResponse: string;
  isAssistantLoading: boolean;
  onAskAssistant: (query: string) => void;
  aiInsights: string;
  isInsightsLoading: boolean;
  onGenerateInsights: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  financialData, 
  onUpdateIncome, 
  onUpdateExpenses,
  aiAssistantResponse,
  isAssistantLoading,
  onAskAssistant,
  aiInsights,
  isInsightsLoading,
  onGenerateInsights
}) => {
  const { transactions, goals } = financialData;
  const [editingMetric, setEditingMetric] = useState<{ type: 'income' | 'expenses', currentValue: number } | null>(null);

  const overview = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expenses;
    return { income, expenses, balance };
  }, [transactions]);

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingMetric) return;
    
    const newValue = parseFloat((e.currentTarget.elements.namedItem('amount') as HTMLInputElement).value);
    if (!isNaN(newValue) && newValue >= 0) {
        if (editingMetric.type === 'income') {
            onUpdateIncome(newValue);
        } else {
            onUpdateExpenses(newValue);
        }
        setEditingMetric(null);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Insights</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <OverviewCard title="Total Balance" value={formatCurrency(overview.balance)} />
        <OverviewCard 
          title="Monthly Income" 
          value={formatCurrency(overview.income)} 
          icon={<ArrowUpIcon className="w-6 h-6 text-green-500" />} 
          onEdit={() => setEditingMetric({ type: 'income', currentValue: overview.income })}
        />
        <OverviewCard 
          title="Monthly Expenses" 
          value={formatCurrency(overview.expenses)} 
          icon={<ArrowDownIcon className="w-6 h-6 text-red-500" />} 
          onEdit={() => setEditingMetric({ type: 'expenses', currentValue: overview.expenses })}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Spending Analysis & Recent Transactions */}
        <div className="space-y-8 lg:col-span-2">
          <SpendingChart transactions={transactions} />
          <RecentTransactions transactions={transactions} />
        </div>
        
        {/* Goals & AI Assistant */}
        <div className="space-y-8">
          <FinancialGoalsPreview goals={goals} />
          <AiAssistant 
            response={aiAssistantResponse}
            isLoading={isAssistantLoading}
            onAsk={onAskAssistant}
          />
        </div>
      </div>
      
      {/* AI Insights */}
      <AiInsights
        insights={aiInsights}
        isLoading={isInsightsLoading}
        onGenerate={onGenerateInsights}
      />

      {/* Modal for editing overview values */}
      {editingMetric && (
        <Modal onClose={() => setEditingMetric(null)}>
            <h2 className="text-xl font-bold mb-4">
                Edit Monthly {editingMetric.type === 'income' ? 'Income' : 'Expenses'}
            </h2>
            <form onSubmit={handleEditSubmit}>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">New Total Amount (₹)</label>
                <input
                    type="number"
                    id="amount"
                    name="amount"
                    defaultValue={editingMetric.currentValue}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    required
                    min="0"
                />
                <div className="mt-6 flex justify-end gap-4">
                    <button type="button" onClick={() => setEditingMetric(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-teal-950 rounded-md hover:bg-teal-800">Save Changes</button>
                </div>
            </form>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
