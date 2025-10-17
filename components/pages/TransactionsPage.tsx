import React, { useState, useMemo, useRef } from 'react';
import type { Transaction, Category } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { categories } from '../../lib/data';
import { TrashIcon, UploadIcon } from '../../lib/icons';

interface TransactionsPageProps {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addMultipleTransactions: (transactions: Omit<Transaction, 'id'>[]) => void;
  deleteTransaction: (transactionId: string) => void;
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions, addTransaction, addMultipleTransactions, deleteTransaction }) => {
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newTx, setNewTx] = useState({
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Food' as Category,
      type: 'expense' as 'income' | 'expense'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setNewTx(prev => ({...prev, [name]: value}));
  };

  const handleAddTransaction = (e: React.FormEvent) => {
      e.preventDefault();
      const amountNum = parseFloat(newTx.amount);
      if (newTx.description && !isNaN(amountNum) && amountNum > 0) {
          addTransaction({
              ...newTx,
              amount: amountNum,
          });
          setNewTx({
              description: '',
              amount: '',
              date: new Date().toISOString().split('T')[0],
              category: 'Food',
              type: 'expense'
          });
          setShowForm(false);
      }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.trim().split('\n');

      if (lines.length < 2) {
        alert("CSV file is empty or has only a header.");
        return;
      }

      const header = lines.shift()?.trim().toLowerCase();
      const expectedHeader = 'date,description,amount,category,type';
      if (header !== expectedHeader) {
        alert(`Invalid CSV header. Expected: ${expectedHeader}`);
        return;
      }

      const newTransactions: Omit<Transaction, 'id'>[] = [];
      const validCategories = new Set(categories);

      lines.forEach((line, index) => {
        const values = line.trim().split(',');
        if (values.length !== 5) {
          console.warn(`Skipping malformed row ${index + 2}: ${line}`);
          return;
        }

        const [date, description, amountStr, category, type] = values;
        
        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) {
            console.warn(`Skipping row ${index + 2} due to invalid amount: ${amountStr}`);
            return;
        }

        const txType = type.toLowerCase().trim();
        if (txType !== 'income' && txType !== 'expense') {
            console.warn(`Skipping row ${index + 2} due to invalid type: ${type}`);
            return;
        }
        
        const txCategory = category.trim() as Category;

        newTransactions.push({
            date: date.trim(),
            description: description.trim(),
            amount,
            category: validCategories.has(txCategory) ? txCategory : 'Miscellaneous',
            type: txType as 'income' | 'expense'
        });
      });

      if (newTransactions.length > 0) {
        addMultipleTransactions(newTransactions);
        alert(`${newTransactions.length} transactions imported successfully!`);
      } else {
        alert("No valid transactions found to import.");
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };


  const sortedAndFilteredTransactions = useMemo(() => {
    return transactions
      .filter(tx => tx.description.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => {
        let comparison = 0;
        if (sortKey === 'date') {
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
        } else {
          comparison = b.amount - a.amount;
        }
        return sortOrder === 'asc' ? -comparison : comparison;
      });
  }, [transactions, filter, sortKey, sortOrder]);

  const handleSort = (key: 'date' | 'amount') => {
    if (key === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const SortArrow = ({ for_key }: { for_key: string }) => {
    if (sortKey !== for_key) return null;
    return <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
        <div className="flex items-center gap-4">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileImport}
                accept=".csv"
                className="hidden"
            />
            <button 
                onClick={handleImportClick}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-sky-900 bg-sky-100 rounded-lg hover:bg-sky-200"
            >
                <UploadIcon className="w-4 h-4" />
                Import from CSV
            </button>
            <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 text-sm font-semibold text-white bg-sky-900 rounded-lg hover:bg-sky-800">
            {showForm ? 'Cancel' : 'Add Transaction'}
            </button>
        </div>
      </div>

      {showForm && (
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
            <input name="description" value={newTx.description} onChange={handleInputChange} placeholder="Description" className="p-2 border rounded" required />
            <input name="amount" value={newTx.amount} type="number" onChange={handleInputChange} placeholder="Amount" className="p-2 border rounded" required />
            <input name="date" value={newTx.date} type="date" onChange={handleInputChange} className="p-2 border rounded" required />
            <select name="category" value={newTx.category} onChange={handleInputChange} className="p-2 border rounded">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex gap-2">
                <select name="type" value={newTx.type} onChange={handleInputChange} className="p-2 border rounded w-full">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>
                <button type="submit" className="px-4 py-2 text-white bg-sky-900 rounded">Add</button>
            </div>
          </form>
        </div>
      )}

      <div className="p-6 bg-white rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Filter by description..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-sm h-10 px-4 mb-4 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm font-semibold text-gray-500 border-b">
                <th className="p-4 cursor-pointer" onClick={() => handleSort('date')}>Date <SortArrow for_key="date"/></th>
                <th className="p-4">Description</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right cursor-pointer" onClick={() => handleSort('amount')}>Amount <SortArrow for_key="amount"/></th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredTransactions.map((tx) => (
                <tr key={tx.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="p-4 text-gray-600">{formatDate(tx.date)}</td>
                  <td className="p-4 font-medium text-gray-800">{tx.description}</td>
                  <td className="p-4 text-gray-600">
                    <span className="px-2 py-1 text-xs font-medium text-sky-800 bg-sky-100 rounded-full">{tx.category}</span>
                  </td>
                  <td className={`p-4 font-semibold text-right ${tx.type === 'income' ? 'text-green-600' : 'text-gray-800'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this transaction?')) {
                          deleteTransaction(tx.id);
                        }
                      }}
                      className="p-2 text-gray-400 rounded-full hover:bg-gray-100 hover:text-red-600"
                      aria-label="Delete transaction"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;