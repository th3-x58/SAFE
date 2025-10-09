
import React from 'react';
import type { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { ArrowDownIcon, ArrowUpIcon } from '../../lib/icons';
import Card from '../common/Card';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const isIncome = transaction.type === 'income';
    return (
        <div className="flex items-center py-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
                {isIncome ? <ArrowUpIcon className="w-5 h-5 text-green-600" /> : <ArrowDownIcon className="w-5 h-5 text-red-600" />}
            </div>
            <div className="flex-1 ml-4">
                <p className="font-medium text-gray-800">{transaction.description}</p>
                <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
            </div>
            <p className={`font-semibold ${isIncome ? 'text-green-600' : 'text-gray-800'}`}>
                {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
            </p>
        </div>
    );
};


const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const recent = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
      <div className="mt-4 -my-3 divide-y divide-gray-200">
        {recent.map(tx => <TransactionRow key={tx.id} transaction={tx} />)}
      </div>
    </Card>
  );
};

export default RecentTransactions;
