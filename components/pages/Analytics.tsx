
import React, { useState, useCallback } from 'react';
import Header from '../Header';
import { useInventory } from '../../hooks/useInventory';
import { analyzeBusinessData } from '../../services/geminiService';
import ReactMarkdown from 'react-markdown';


const Analytics: React.FC = () => {
  const { products, sales, suppliers } = useInventory();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');

  const handleAnalysis = useCallback(async (userQuery: string) => {
    setIsLoading(true);
    setAnalysis('');
    
    const dataForAnalysis = {
        products: products,
        sales: sales,
        suppliers: suppliers,
    };

    const result = await analyzeBusinessData(userQuery, dataForAnalysis);
    setAnalysis(result);
    setIsLoading(false);
  }, [products, sales, suppliers]);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(query.trim()) {
          handleAnalysis(query);
      }
  }

  const quickQueries = [
    "Which product is the most profitable?",
    "Identify sales trends over the last month.",
    "Which supplier provides the most products?",
    "Are there any products with low stock that are selling well?"
  ];

  return (
    <div>
      <Header title="Analytics Assistant (Thinking Mode)" />
      <div className="bg-card shadow-md rounded-xl p-6">
        <p className="text-text-secondary mb-4">Ask complex questions about your business. Our AI assistant, powered by Gemini 2.5 Pro, will analyze your data and provide detailed insights.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., What are my top 5 best-selling products this month?"
            className="flex-grow p-3 border rounded-lg"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading} className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400">
            {isLoading ? 'Analyzing...' : 'Ask AI'}
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mb-6">
            {quickQueries.map(q => (
                <button 
                    key={q} 
                    onClick={() => { setQuery(q); handleAnalysis(q); }} 
                    disabled={isLoading}
                    className="bg-gray-100 text-sm text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200"
                >
                    {q}
                </button>
            ))}
        </div>

        {isLoading && (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-text-secondary">Gemini is thinking... this may take a moment.</p>
          </div>
        )}

        {analysis && (
          <div className="mt-6 border-t pt-6">
             <div className="prose max-w-none">
                <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
