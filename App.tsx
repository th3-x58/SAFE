
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
import type { Transaction, Budget, Goal } from './types';
import { getFinancialOutline, getChatResponse } from './services/geminiService';

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

  // State for InvestmentsPage
  const { monthlySavings } = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return { monthlySavings: income - expenses };
  }, [transactions]);
  
  const [monthlyInvestment, setMonthlyInvestment] = useState(monthlySavings > 0 ? Math.round(monthlySavings / 1000) * 1000 : 5000);
  const [timeHorizon, setTimeHorizon] = useState(10); // years
  const [returnRate, setReturnRate] = useState(10); // percentage
  
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
            return prev.map(t => t.id === largestIncomeTx.id ? { ...t, amount: t.amount + difference } : t);
        } else {
             return [...prev, { 
                id: `t${prev.length + 1}`,
                date: new Date().toISOString().split('T')[0],
                description: 'Monthly Income',
                amount: newIncome,
                category: 'Miscellaneous',
                type: 'income'
            }];
        }
    });
  }, []);
  
    const handleUpdateExpenses = useCallback((newExpenses: number) => {
        setTransactions(prev => {
            const currentExpenses = prev.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
            const difference = newExpenses - currentExpenses;
            
            if(difference === 0) return prev;

            // Add an adjustment transaction
            return [...prev, {
                id: `t${prev.length + 1}`,
                date: new Date().toISOString().split('T')[0],
                description: 'Expense Adjustment',
                amount: Math.abs(difference),
                category: 'Miscellaneous',
                type: difference > 0 ? 'expense' : 'income' // A negative expense is a credit/income
            }];
        });
    }, []);

    const renderPage = () => {
        switch (currentPage) {
        case 'Insights':
            return <Dashboard financialData={financialData} onUpdateIncome={handleUpdateIncome} onUpdateExpenses={handleUpdateExpenses} />;
        case 'Transactions':
            return <TransactionsPage transactions={transactions} addTransaction={addTransaction} deleteTransaction={deleteTransaction} />;
        case 'Budgets':
            return <BudgetsPage budgets={budgets} transactions={transactions} updateBudget={updateBudget} />;
        case 'Goals':
            return <GoalsPage goals={goals} updateGoal={updateGoal} />;
        case 'Investments':
            return <InvestmentsPage 
                    financialData={financialData}
                    monthlyInvestment={monthlyInvestment}
                    setMonthlyInvestment={setMonthlyInvestment}
                    timeHorizon={timeHorizon}
                    setTimeHorizon={setTimeHorizon}
                    returnRate={returnRate}
                    setReturnRate={setReturnRate}
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
            return <Dashboard financialData={financialData} onUpdateIncome={handleUpdateIncome} onUpdateExpenses={handleUpdateExpenses} />;
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
