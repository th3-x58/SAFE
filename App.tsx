import React, { useState, useCallback, useMemo } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/pages/Dashboard';
import TransactionsPage from './components/pages/TransactionsPage';
import BudgetsPage from './components/pages/BudgetsPage';
import GoalsPage from './components/pages/GoalsPage';
import LoginPage from './components/pages/LoginPage';
import { initialTransactions, initialBudgets, initialGoals } from './lib/data';
import type { Transaction, Budget, Goal } from './types';

export type Page = 'Insights' | 'Transactions' | 'Budgets' | 'Goals';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<Page>('Insights');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  
  // Editable state for financial data
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const financialData = useMemo(() => ({
    transactions,
    budgets,
    goals
  }), [transactions, budgets, goals]);

  const updateBudget = useCallback((updatedBudget: Budget) => {
    setBudgets(prev => prev.map(b => b.id === updatedBudget.id ? updatedBudget : b));
  }, []);

  const updateGoal = useCallback((updatedGoal: Goal) => {
    setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
  }, []);

  const addTransaction = useCallback((newTransaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [...prev, { ...newTransaction, id: `t${prev.length + 1}` }]);
  }, []);

  const deleteTransaction = useCallback((transactionId: string) => {
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
  }, []);

  const handleUpdateIncome = useCallback((newIncome: number) => {
    setTransactions(prev => {
        const currentIncome = prev.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const difference = newIncome - currentIncome;
        
        if(difference === 0) return prev;

        const incomeTransactions = prev.filter(t => t.type === 'income');
        const largestIncomeTx = incomeTransactions.length > 0
            ? incomeTransactions.reduce((max, t) => (t.amount > max.amount ? t : max))
            : null;

        if (largestIncomeTx) {
            // Update the largest income transaction, ensure amount doesn't go below zero
            const newAmount = largestIncomeTx.amount + difference;
            return prev.map(t => 
                t.id === largestIncomeTx.id 
                ? { ...t, amount: newAmount > 0 ? newAmount : 0 } 
                : t
            );
        } else if (difference > 0) {
             // Or add a new income transaction if none exists
            return [...prev, {
                id: `t_adj_${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                description: 'Income Adjustment',
                amount: difference,
                category: 'Miscellaneous',
                type: 'income',
            }];
        }
        return prev;
    });
  }, []);

  const handleUpdateExpenses = useCallback((newExpenses: number) => {
      setTransactions(prev => {
          const currentExpenses = prev.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
          const difference = newExpenses - currentExpenses;

          if (difference === 0) return prev;

          const adjustment: Omit<Transaction, 'id'> = {
              date: new Date().toISOString().split('T')[0],
              category: 'Miscellaneous',
              amount: Math.abs(difference),
              description: difference > 0 ? 'Expense Adjustment' : 'Expense Correction (Refund)',
              type: difference > 0 ? 'expense' : 'income',
          };
          
          return [...prev, { ...adjustment, id: `t_adj_${Date.now()}` }];
      });
  }, []);

  const renderContent = () => {
    switch (currentPage) {
      case 'Insights':
        return <Dashboard financialData={financialData} onUpdateIncome={handleUpdateIncome} onUpdateExpenses={handleUpdateExpenses} />;
      case 'Transactions':
        return <TransactionsPage transactions={transactions} addTransaction={addTransaction} deleteTransaction={deleteTransaction} />;
      case 'Budgets':
        return <BudgetsPage budgets={budgets} transactions={transactions} updateBudget={updateBudget} />;
      case 'Goals':
        return <GoalsPage goals={goals} updateGoal={updateGoal} />;
      default:
        return <Dashboard financialData={financialData} onUpdateIncome={handleUpdateIncome} onUpdateExpenses={handleUpdateExpenses} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isCollapsed={isSidebarCollapsed} 
        setCollapsed={setSidebarCollapsed}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <Header />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;