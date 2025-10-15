import React, { useState, useCallback, useMemo } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/pages/Dashboard';
import TransactionsPage from './components/pages/TransactionsPage';
import BudgetsPage from './components/pages/BudgetsPage';
import GoalsPage from './components/pages/GoalsPage';
import InvestmentsPage from './components/pages/InvestmentsPage';
import AIChatPage from './components/pages/AIChatPage';
import LoginPage from './components/pages/LoginPage';
import { initialTransactions, initialBudgets, initialGoals } from './lib/data';
import { apiBaseUrl } from './lib/utils';
import type { Transaction, Budget, Goal } from './types';
import { getFinancialOutline, getChatResponse, getFinancialAdvice, getSpendingAnalysis } from './services/geminiService';

export type Page = 'Insights' | 'Transactions' | 'Budgets' | 'Goals' | 'Investments' | 'AI Chat';

type BudgetChartData = {
    name: string;
    value: number;
    percentage: number;
}[];

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
  chartData?: BudgetChartData | null;
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<Page>('Insights');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  
  // Editable state for financial data
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  React.useEffect(() => {
    const loadAll = async () => {
      try {
        const [txRes, bRes, gRes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/transactions`),
          fetch(`${apiBaseUrl}/api/budgets`),
          fetch(`${apiBaseUrl}/api/goals`),
        ]);
        if (txRes.ok) setTransactions(await txRes.json());
        if (bRes.ok) setBudgets(await bRes.json());
        if (gRes.ok) setGoals(await gRes.json());
      } catch (e) {
        console.error('Failed to load from API, using in-memory defaults', e);
      }
    };
    loadAll();
  }, []);

  // State for AI components on Dashboard
  const [aiAssistantResponse, setAiAssistantResponse] = useState('');
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState('');
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentPage('Insights'); // Reset to default page on logout
  }, []);

  const financialData = useMemo(() => ({
    transactions,
    budgets,
    goals
  }), [transactions, budgets, goals]);
  
    // State for InvestmentsPage - Lifted to preserve user input across navigation
    const { initialInvestment, monthlySavings } = useMemo(() => {
        const initial = goals.reduce((acc, g) => acc + g.currentAmount, 0);
        const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        const savings = income - expenses;
        return { initialInvestment: initial, monthlySavings: savings };
    }, [goals, transactions]);

    const [principal, setPrincipal] = useState(initialInvestment > 0 ? initialInvestment : 50000);
    const [monthlyContribution, setMonthlyContribution] = useState(monthlySavings > 1000 ? Math.round(monthlySavings / 1000) * 1000 : 5000);
    const [timeInYears, setTimeInYears] = useState(10);
    const [annualRate, setAnnualRate] = useState(12);
    const [contributionTiming, setContributionTiming] = useState<'beginning' | 'end'>('beginning');
    const [annualIncrease, setAnnualIncrease] = useState(5);

  // AI Dashboard Handlers
  const handleAskAssistant = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setIsAssistantLoading(true);
    setAiAssistantResponse('');
    const advice = await getFinancialAdvice(query, financialData);
    setAiAssistantResponse(advice);
    setIsAssistantLoading(false);
  }, [financialData]);

  const handleGenerateInsights = useCallback(async () => {
    setIsInsightsLoading(true);
    setAiInsights('');
    const analysis = await getSpendingAnalysis(financialData.transactions);
    setAiInsights(analysis);
    setIsInsightsLoading(false);
  }, [financialData.transactions]);
  
  // State for AIChatPage
  const [riskProfile, setRiskProfile] = useState<'low' | 'normal' | 'high'>('normal');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isAiResponding, setIsAiResponding] = useState(false);

  const generateInitialOutline = useCallback(async () => {
    setIsAiResponding(true);
    setChatHistory([]);
    const rawResponse = await getFinancialOutline(financialData, riskProfile);

    const jsonRegex = /BUDGET_JSON_START([\s\S]*?)BUDGET_JSON_END/;
    const match = rawResponse.match(jsonRegex);
    
    let chartData: BudgetChartData | null = null;
    if (match && match[1]) {
        try {
            const parsedJson = JSON.parse(match[1]);
            chartData = [
                { name: 'Needs', value: parsedJson.needs.amount, percentage: parsedJson.needs.percentage },
                { name: 'Wants', value: parsedJson.wants.amount, percentage: parsedJson.wants.percentage },
                { name: 'Savings', value: parsedJson.savings.amount, percentage: parsedJson.savings.percentage },
            ];
        } catch (e) {
            console.error("Failed to parse budget JSON", e);
        }
    }
    
    const cleanText = rawResponse.replace(jsonRegex, '').trim();
    setChatHistory([{
        role: 'model',
        parts: [{ text: cleanText }],
        chartData: chartData
    }]);

    setIsAiResponding(false);
  }, [financialData, riskProfile]);
  
  const handleSendMessage = useCallback(async (message: string) => {
    const newUserMessage: ChatMessage = {
      role: 'user',
      parts: [{ text: message }],
    };
    
    const currentChatHistory = [...chatHistory, newUserMessage];
    setChatHistory(currentChatHistory);
    setIsAiResponding(true);

    const historyForApi = currentChatHistory.map(({ chartData, ...msg }) => msg);
    const aiResponseText = await getChatResponse(historyForApi, financialData);

    const newAiMessage: ChatMessage = {
      role: 'model',
      parts: [{ text: aiResponseText }],
    };
    setChatHistory([...currentChatHistory, newAiMessage]);
    setIsAiResponding(false);
  }, [chatHistory, financialData]);


  const updateBudget = useCallback(async (updatedBudget: Budget) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/budgets/${updatedBudget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: updatedBudget.category, limit: updatedBudget.limit })
      });
      if (res.ok) {
        const saved = await res.json();
        setBudgets(prev => prev.map(b => b.id === saved.id ? saved : b));
      }
    } catch (e) {
      console.error('Failed to update budget', e);
    }
  }, []);

  const updateGoal = useCallback(async (updatedGoal: Goal) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/goals/${updatedGoal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: updatedGoal.name, targetAmount: updatedGoal.targetAmount, currentAmount: updatedGoal.currentAmount, deadline: updatedGoal.deadline })
      });
      if (res.ok) {
        const saved = await res.json();
        setGoals(prev => prev.map(g => g.id === saved.id ? saved : g));
      }
    } catch (e) {
      console.error('Failed to update goal', e);
    }
  }, []);

  const addTransaction = useCallback(async (newTransaction: Omit<Transaction, 'id'>) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction)
      });
      if (res.ok) {
        const created = await res.json();
        setTransactions(prev => [...prev, created]);
      }
    } catch (e) {
      console.error('Failed to add transaction', e);
    }
  }, []);

  const addMultipleTransactions = useCallback(async (newTransactions: Omit<Transaction, 'id'>[]) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/transactions/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransactions)
      });
      if (res.ok) {
        const created = await res.json();
        setTransactions(prev => [...prev, ...created]);
      }
    } catch (e) {
      console.error('Failed to import transactions', e);
    }
  }, []);

  const deleteTransaction = useCallback(async (transactionId: string) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/transactions/${transactionId}`, { method: 'DELETE' });
      if (res.ok || res.status === 204) {
        setTransactions(prev => prev.filter(t => t.id !== transactionId));
      }
    } catch (e) {
      console.error('Failed to delete transaction', e);
    }
  }, []);

  const handleUpdateIncome = useCallback((newIncome: number) => {
    setTransactions(prevTxs => {
        const oldIncome = prevTxs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);

        if (oldIncome > 0 && newIncome > 0) {
            const scalingFactor = newIncome / oldIncome;
            
            setBudgets(prevBudgets => 
                prevBudgets.map(budget => ({
                    ...budget,
                    limit: Math.round(budget.limit * scalingFactor)
                }))
            );

            return prevTxs.map(tx => 
                tx.type === 'income' 
                ? { ...tx, amount: Math.round(tx.amount * scalingFactor) }
                : tx
            );
        } else if (newIncome > 0) { // Handles case where oldIncome is 0
            return [
                ...prevTxs.filter(tx => tx.type !== 'income'),
                {
                    id: 't-income-summary',
                    date: new Date().toISOString().split('T')[0],
                    description: 'Total Monthly Income',
                    amount: newIncome,
                    category: 'Miscellaneous' as const,
                    type: 'income' as const
                }
            ];
        }
        // if newIncome is 0 or less, remove all income transactions
        return prevTxs.filter(tx => tx.type !== 'income');
    });
  }, [setTransactions, setBudgets]);
  
    const handleUpdateExpenses = useCallback((newExpenses: number) => {
        setTransactions(prevTxs => {
            const oldExpenses = prevTxs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

            if (oldExpenses > 0 && newExpenses > 0) {
                const scalingFactor = newExpenses / oldExpenses;
                return prevTxs.map(tx => 
                    tx.type === 'expense'
                    ? { ...tx, amount: Math.round(tx.amount * scalingFactor) }
                    : tx
                );
            } else if (newExpenses > 0) { // Handles case where oldExpenses is 0
                return [
                    ...prevTxs.filter(tx => tx.type !== 'expense'),
                    {
                        id: 't-expense-summary',
                        date: new Date().toISOString().split('T')[0],
                        description: 'Total Monthly Expenses',
                        amount: newExpenses,
                        category: 'Miscellaneous' as const,
                        type: 'expense' as const
                    }
                ];
            }
            // if newExpenses is 0 or less, remove all expense transactions
            return prevTxs.filter(tx => tx.type !== 'expense');
        });
    }, [setTransactions]);

    const renderPage = () => {
        const dashboardProps = {
            financialData,
            onUpdateIncome: handleUpdateIncome,
            onUpdateExpenses: handleUpdateExpenses,
            aiAssistantResponse,
            isAssistantLoading,
            onAskAssistant: handleAskAssistant,
            aiInsights,
            isInsightsLoading,
            onGenerateInsights: handleGenerateInsights
        };

        switch (currentPage) {
        case 'Insights':
            return <Dashboard {...dashboardProps} />;
        case 'Transactions':
            return <TransactionsPage transactions={transactions} addTransaction={addTransaction} addMultipleTransactions={addMultipleTransactions} deleteTransaction={deleteTransaction} />;
        case 'Budgets':
            return <BudgetsPage budgets={budgets} transactions={transactions} updateBudget={updateBudget} />;
        case 'Goals':
            return <GoalsPage goals={goals} updateGoal={updateGoal} />;
        case 'Investments':
            return <InvestmentsPage 
                    financialData={financialData}
                    principal={principal}
                    setPrincipal={setPrincipal}
                    monthlyContribution={monthlyContribution}
                    setMonthlyContribution={setMonthlyContribution}
                    timeInYears={timeInYears}
                    setTimeInYears={setTimeInYears}
                    annualRate={annualRate}
                    setAnnualRate={setAnnualRate}
                    contributionTiming={contributionTiming}
                    setContributionTiming={setContributionTiming}
                    annualIncrease={annualIncrease}
                    setAnnualIncrease={setAnnualIncrease}
                    />;
        case 'AI Chat':
            return <AIChatPage
                    riskProfile={riskProfile}
                    setRiskProfile={setRiskProfile}
                    chatHistory={chatHistory}
                    isLoading={isAiResponding}
                    generateOutline={generateInitialOutline}
                    sendMessage={handleSendMessage}
                    />;
        default:
            return <Dashboard {...dashboardProps} />;
        }
    };

    if (!isAuthenticated) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div className="flex h-screen bg-gray-50">
        <Sidebar 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isCollapsed={isSidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            onLogout={handleLogout}
        />
        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
            <Header />
            <main className="flex-1 overflow-y-auto p-8">
            {renderPage()}
            </main>
        </div>
        </div>
    );
};

export default App;