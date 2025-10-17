
import React from 'react';
import { SparklesIcon } from '../../lib/icons';
import Card from '../common/Card';

interface AiInsightsProps {
  insights: string;
  isLoading: boolean;
  onGenerate: () => void;
}

const AiInsights: React.FC<AiInsightsProps> = ({ insights, isLoading, onGenerate }) => {

  const generateInsights = () => {
    onGenerate();
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
            <SparklesIcon className="w-6 h-6 text-sky-900" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">AI Insights</h3>
        </div>
        <button
          onClick={generateInsights}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-semibold text-white bg-sky-900 rounded-lg hover:bg-sky-800 disabled:bg-gray-400"
        >
          {isLoading ? 'Generating...' : insights ? 'Regenerate Insights' : 'Generate Insights'}
        </button>
      </div>
      
      {insights ? (
        <div className="mt-4 p-4 prose prose-sm max-w-none bg-sky-50 rounded-lg" dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br />').replace(/\*/g, '•') }} />
      ) : (
         isLoading ? (
            <p className="mt-4 text-sm text-center text-gray-500">Generating your personalized insights...</p>
         ) : (
            <p className="mt-4 text-sm text-gray-500">Click the button to get automated insights on your spending patterns, saving recommendations, and more.</p>
         )
      )}
    </Card>
  );
};

export default AiInsights;
