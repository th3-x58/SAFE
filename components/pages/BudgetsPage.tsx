
import React, { useState } from 'react';
import type { Budget, Transaction } from '../../types';
import { formatCurrency } from '../../lib/utils';
import Card from '../common/Card';
import { EditIcon } from '../../lib/icons';
import Modal from '../common/Modal';

interface BudgetCardProps {
  budget: Budget;
  spent: number;
  onEdit: (budget: Budget) => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ budget, spent, onEdit }) => {
  const remaining = budget.limit - spent;
  const progress = (spent / budget.limit) * 100;
  const isExceeded = remaining < 0;

  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
            <h3 className="text-lg font-semibold text-gray-800">{budget.category}</h3>
            <p className="text-sm text-gray-500">Limit: {formatCurrency(budget.limit)}</p>
        </div>
        <button onClick={() => onEdit(budget)} className="p-2 text-gray-400 hover:text-gray-600">
            <EditIcon className="w-5 h-5"/>
        </button>
      </div>
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full ${isExceeded ? 'bg-red-500' : 'bg-sky-900'}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <p className="font-medium text-gray-600">Spent: {formatCurrency(spent)}</p>
          <p className={`font-medium ${isExceeded ? 'text-red-600' : 'text-gray-600'}`}>
            {isExceeded ? `Over by ${formatCurrency(Math.abs(remaining))}` : `Remaining: ${formatCurrency(remaining)}`}
          </p>
        </div>
      </div>
    </Card>
  );
};

interface BudgetsPageProps {
    budgets: Budget[];
    transactions: Transaction[];
    updateBudget: (budget: Budget) => void;
}

const BudgetsPage: React.FC<BudgetsPageProps> = ({ budgets, transactions, updateBudget }) => {
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

    const spentByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

    const handleSave = (newLimit: number) => {
        if(editingBudget) {
            updateBudget({ ...editingBudget, limit: newLimit });
            setEditingBudget(null);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Budgets</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgets.map(budget => (
                    <BudgetCard
                        key={budget.id}
                        budget={budget}
                        spent={spentByCategory[budget.category] || 0}
                        onEdit={setEditingBudget}
                    />
                ))}
            </div>
            {editingBudget && (
                <Modal onClose={() => setEditingBudget(null)}>
                    <h2 className="text-xl font-bold mb-4">Edit Budget for {editingBudget.category}</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const newLimit = parseFloat((e.currentTarget.elements.namedItem('limit') as HTMLInputElement).value);
                        if (!isNaN(newLimit)) handleSave(newLimit);
                    }}>
                        <label htmlFor="limit" className="block text-sm font-medium text-gray-700">New Limit (₹)</label>
                        <input
                            type="number"
                            id="limit"
                            name="limit"
                            defaultValue={editingBudget.limit}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                            required
                        />
                        <div className="mt-6 flex justify-end gap-4">
                            <button type="button" onClick={() => setEditingBudget(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-sky-900 rounded-md hover:bg-sky-800">Save Changes</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default BudgetsPage;
