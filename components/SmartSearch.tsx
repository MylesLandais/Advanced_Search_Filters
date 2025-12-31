import React, { useState } from 'react';
import { Sparkles, Loader2, Search } from 'lucide-react';
import { parseNaturalLanguageQuery } from '../services/geminiService';
import { AIParseResult } from '../types';

interface SmartSearchProps {
  onParse: (result: AIParseResult) => void;
}

const SmartSearch: React.FC<SmartSearchProps> = ({ onParse }) => {
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsThinking(true);
    try {
      const result = await parseNaturalLanguageQuery(input);
      if (result) {
        onParse(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="w-full max-w-3xl relative">
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isThinking ? (
            <Loader2 className="h-5 w-5 text-purple-400 animate-spin" />
          ) : (
            <Sparkles className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
          )}
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-20 py-3 bg-gray-850 border border-gray-750 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all shadow-lg"
          placeholder="Ask AI: 'Show me Taylor Swift videos from Reddit with high score...'"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isThinking}
        />
        <button
          type="submit"
          disabled={isThinking || !input}
          className="absolute inset-y-1.5 right-1.5 px-4 bg-gray-750 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isThinking ? 'Thinking...' : 'Generate'}
        </button>
      </form>
    </div>
  );
};

export default SmartSearch;