
import React, { useState } from 'react';
import { SparklesIcon, SendIcon } from '../../lib/icons';
import Card from '../common/Card';

interface AiAssistantProps {
  response: string;
  isLoading: boolean;
  onAsk: (query: string) => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ response, isLoading, onAsk }) => {
  const [query, setQuery] = useState('');

  const handleAsk = () => {
    if (!query.trim()) return;
    onAsk(query);
  };

  return (
    <Card>
      <div className="flex items-center">
        <SparklesIcon className="w-6 h-6 text-sky-900" />
        <h3 className="ml-2 text-lg font-semibold text-gray-800">AI Assistant</h3>
      </div>
      <p className="mt-2 text-sm text-gray-500">Ask a question about your finances.</p>
      
      <div className="mt-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="e.g., How can I save more?"
            className="w-full h-12 pr-12 pl-4 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            disabled={isLoading}
          />
          <button 
            onClick={handleAsk}
            disabled={isLoading || !query.trim()}
            className="absolute top-1/2 right-3 -translate-y-1/2 p-2 text-gray-500 rounded-full hover:bg-gray-200 disabled:opacity-50"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {isLoading && <div className="mt-4 text-center text-gray-500">Thinking...</div>}
      
      {response && (
        <div className="mt-4 p-4 prose prose-sm max-w-none bg-sky-50 rounded-lg">
          <p dangerouslySetInnerHTML={{ __html: response.replace(/\n/g, '<br />') }} />
        </div>
      )}
    </Card>
  );
};

export default AiAssistant;
