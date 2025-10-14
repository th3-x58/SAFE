
import React from 'react';
import type { FinancialData } from '../../types';
import Card from '../common/Card';
import { SparklesIcon } from '../../lib/icons';
import { cn, formatCurrency } from '../../lib/utils';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// A simple markdown to HTML renderer
const MarkdownRenderer = ({ content }: { content: string }) => {
    const htmlContent = content
        .replace(/### (.*)/g, '<h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">$1</h3>')
        .replace(/## (.*)/g, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h2>')
        .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\* (.*)/g, '<li class="ml-5 list-disc">$1</li>')
        .replace(/\n- (.*)/g, '<li class="ml-5 list-disc">$1</li>')
        .replace(/\n/g, '<br />')
        .replace(/<br \s*\/?><li>/g, '<li>'); // Remove break before list item

    return <div className="prose prose-sm max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

type BudgetChartData = {
    name: string;
    value: number;
    percentage: number;
}[];

interface FinancialOutlinePageProps {
    financialData: FinancialData;
    riskProfile: 'low' | 'normal' | 'high';
    setRiskProfile: (profile: 'low' | 'normal' | 'high') => void;
    outline: string;
    isLoading: boolean;
    budgetChartData: BudgetChartData | null;
    generateOutline: () => void;
}

const FinancialOutlinePage: React.FC<FinancialOutlinePageProps> = ({ 
    financialData, 
    riskProfile,
    setRiskProfile,
    outline,
    isLoading,
    budgetChartData,
    generateOutline
}) => {
  
  const riskOptions: { id: 'low' | 'normal' | 'high'; label: string; description: string }[] = [
    { id: 'low', label: 'Low Risk', description: 'Prioritize capital protection over high returns. Suitable for conservative investors.' },
    { id: 'normal', label: 'Normal Risk', description: 'A balanced approach seeking steady growth with moderate risk.' },
    { id: 'high', label: 'High Risk', description: 'Aim for high returns, comfortable with potential volatility. For long-term goals.' },
  ];
  
  const COLORS = ['#0369a1', '#0ea5e9', '#13B9B9'];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Financial Outline</h1>
      <p className="text-gray-600">Your personalized, AI-powered guide to mastering your finances and achieving your goals.</p>
      
      <Card>
        <div className="flex items-center">
            <SparklesIcon className="w-6 h-6 text-teal-950" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">Step 1: Define Your Investment Style</h3>
        </div>
        <p className="mt-2 text-sm text-gray-500">Select the risk profile that best describes you. This will help us tailor your financial plan.</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {riskOptions.map(option => (
                <div 
                    key={option.id} 
                    onClick={() => setRiskProfile(option.id)}
                    className={cn(
                        "p-4 border rounded-lg cursor-pointer transition-all",
                        riskProfile === option.id ? 'bg-teal-100 border-teal-950 ring-2 ring-teal-950' : 'bg-white hover:bg-gray-50'
                    )}
                >
                    <h4 className="font-semibold text-gray-800">{option.label}</h4>
                    <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                </div>
            ))}
        </div>
        <div className="mt-6 text-center">
            <button
                onClick={generateOutline}
                disabled={isLoading}
                className="px-6 py-3 text-sm font-semibold text-white bg-teal-950 rounded-lg hover:bg-teal-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Generating Your Plan...' : 'Generate My Financial Outline'}
            </button>
        </div>
      </Card>

      {isLoading && (
        <Card>
            <div className="text-center py-8">
                <p className="text-gray-600 animate-pulse">Our AI is crafting your personalized financial plan...</p>
            </div>
        </Card>
      )}
      
      {outline && (
        <Card>
            {budgetChartData && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Your Budget Allocation</h2>
                    <div className="w-full h-72">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={budgetChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    innerRadius={60}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {budgetChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend formatter={(value, entry) => {
                                    const { color } = entry;
                                    const item = budgetChartData.find(d => d.name === value);
                                    return <span style={{ color }}>{value} ({item?.percentage}%)</span>;
                                }}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
          <MarkdownRenderer content={outline} />
        </Card>
      )}
    </div>
  );
};

export default FinancialOutlinePage;
