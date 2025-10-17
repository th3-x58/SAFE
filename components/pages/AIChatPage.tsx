
import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../../App';
import Card from '../common/Card';
import { SparklesIcon, SendIcon, UserCircleIcon } from '../../lib/icons';
import { cn, formatCurrency } from '../../lib/utils';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// A simple markdown to HTML renderer
const MarkdownRenderer = ({ content }: { content: string }) => {
    const htmlContent = content
        .replace(/### (.*)/g, '<h3 class="text-xl font-semibold text-gray-800 mt-4 mb-2">$1</h3>')
        .replace(/## (.*)/g, '<h2 class="text-2xl font-bold text-gray-900 mt-6 mb-3">$1</h2>')
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

const BudgetChart = ({ data }: { data: BudgetChartData }) => {
    const COLORS = ['#0369a1', '#0ea5e9', '#13B9B9'];
    return (
        <div className="my-6 bg-white rounded-lg p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Your Budget Allocation</h2>
            <div className="w-full h-72">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            innerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend formatter={(value, entry) => {
                            const { color } = entry;
                            const item = data.find(d => d.name === value);
                            return <span style={{ color }}>{value} ({item?.percentage}%)</span>;
                        }}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

interface AIChatPageProps {
    riskProfile: 'low' | 'normal' | 'high';
    setRiskProfile: (profile: 'low' | 'normal' | 'high') => void;
    chatHistory: ChatMessage[];
    isLoading: boolean;
    generateOutline: () => void;
    sendMessage: (message: string) => void;
}

const AIChatPage: React.FC<AIChatPageProps> = ({ 
    riskProfile,
    setRiskProfile,
    chatHistory,
    isLoading,
    generateOutline,
    sendMessage
}) => {
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && !isLoading) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  const riskOptions: { id: 'low' | 'normal' | 'high'; label: string; description: string }[] = [
    { id: 'low', label: 'Low Risk', description: 'Prioritize capital protection over high returns. Suitable for conservative investors.' },
    { id: 'normal', label: 'Normal Risk', description: 'A balanced approach seeking steady growth with moderate risk.' },
    { id: 'high', label: 'High Risk', description: 'Aim for high returns, comfortable with potential volatility. For long-term goals.' },
  ];

  if (chatHistory.length === 0 && !isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">AI Chat</h1>
        <p className="text-gray-600">Your personalized, AI-powered guide to mastering your finances and achieving your goals.</p>
        <Card>
          <div className="flex items-center">
              <SparklesIcon className="w-6 h-6 text-sky-900" />
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
                          riskProfile === option.id ? 'bg-sky-100 border-sky-900 ring-2 ring-sky-900' : 'bg-white hover:bg-gray-50'
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
                  className="px-6 py-3 text-sm font-semibold text-white bg-sky-900 rounded-lg hover:bg-sky-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                  {isLoading ? 'Generating Your Plan...' : 'Generate My Financial Outline'}
              </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 px-1">AI Chat</h1>
        <div className="flex-1 overflow-y-auto pr-4 space-y-4">
            {chatHistory.map((msg, index) => (
                <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' ? "justify-end" : "justify-start")}>
                    {msg.role === 'model' && <SparklesIcon className="w-8 h-8 p-1.5 text-white bg-sky-900 rounded-full flex-shrink-0" />}
                    <div className={cn("max-w-2xl rounded-xl p-4", msg.role === 'user' ? "bg-sky-900 text-white" : "bg-white border")}>
                        {msg.chartData && <BudgetChart data={msg.chartData} />}
                        <MarkdownRenderer content={msg.parts[0].text} />
                    </div>
                    {msg.role === 'user' && <UserCircleIcon className="w-8 h-8 text-gray-400 flex-shrink-0" />}
                </div>
            ))}
            {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                    <SparklesIcon className="w-8 h-8 p-1.5 text-white bg-sky-900 rounded-full flex-shrink-0 animate-pulse" />
                    <div className="max-w-2xl rounded-xl p-4 bg-white border">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={chatEndRef} />
        </div>
        <div className="mt-4 pt-4 border-t">
            <form onSubmit={handleSend} className="relative">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ask a follow-up question..."
                    className="w-full h-12 pr-14 pl-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !newMessage.trim()}
                    className="absolute top-1/2 right-3 -translate-y-1/2 p-2 text-white bg-sky-900 rounded-full hover:bg-sky-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    aria-label="Send message"
                >
                    <SendIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
    </div>
  );
};

export default AIChatPage;
