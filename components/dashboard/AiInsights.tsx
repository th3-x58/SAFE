
import React, { useState, useCallback } from 'react';
import type { Transaction } from '../../types';
import { getSpendingAnalysis } from '../../services/geminiService';
import { SparklesIcon } from '../../lib/icons';
import Card from '../common/Card';

interface AiInsightsProps {
  transactions: Transaction[];
}

const AiInsights: React.FC<AiInsightsProps> = ({ transactions }) => {
  const [insights, setInsights] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateInsights = useCallback(async () => {
    setIsLoading(true);
    setInsights('');
    const analysis = await getSpendingAnalysis(transactions);
    setInsights(analysis);
    setIsLoading(false);
  }, [transactions]);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
            <SparklesIcon className="w-6 h-6 text-teal-950" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">AI Insights</h3>
        </div>
        <button
          onClick={generateInsights}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-semibold text-white bg-teal-950 rounded-lg hover:bg-teal-800 disabled:bg-gray-400"
        >
          {isLoading ? 'Generating...' : 'Generate Insights'}
        </button>
      </div>
      
      {insights ? (
        <div className="mt-4 p-4 prose prose-sm max-w-none bg-teal-50 rounded-lg" dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br />').replace(/\*/g, '•') }} />
      ) : (
        <p className="mt-4 text-sm text-gray-500">Click the button to get automated insights on your spending patterns, saving recommendations, and more.</p>
      )}
    </Card>
  );
};

export default AiInsights;
