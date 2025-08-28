import React, { useState } from 'react';
import { createChatSession } from '../../Service/AiModel';
import { config } from '../../config.js';

const AiTest = () => {
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const testAi = async () => {
    setIsLoading(true);
    setError('');
    setTestResult('');

    try {
      console.log('=== AI TEST START ===');
      console.log('Config:', config);
      console.log('Gemini API Key:', config.VITE_GEMINI_API_KEY);
      console.log('API Key length:', config.VITE_GEMINI_API_KEY?.length);
      
      // Test 1: Check if createChatSession works
      console.log('Testing createChatSession...');
      const chatSession = createChatSession();
      console.log('ChatSession created:', chatSession);
      
      // Test 2: Simple message
      console.log('Testing simple message...');
      const result = await chatSession.sendMessage('Say "Hello World"');
      console.log('Result:', result);
      
      const response = result.response.text();
      console.log('Response text:', response);
      
      setTestResult(`✅ AI Test Successful!\n\nResponse: ${response}`);
      
    } catch (err) {
      console.error('AI Test Error:', err);
      setError(`❌ AI Test Failed:\n\n${err.message}\n\nStack: ${err.stack}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Gemini AI Test</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Configuration:</h2>
        <div className="bg-gray-800 p-4 rounded">
          <p><strong>API Key Present:</strong> {config.VITE_GEMINI_API_KEY ? '✅ Yes' : '❌ No'}</p>
          <p><strong>API Key Length:</strong> {config.VITE_GEMINI_API_KEY?.length || 0}</p>
          <p><strong>API Key Preview:</strong> {config.VITE_GEMINI_API_KEY ? `${config.VITE_GEMINI_API_KEY.substring(0, 10)}...` : 'None'}</p>
        </div>
      </div>

      <button
        onClick={testAi}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mb-4 disabled:opacity-50"
      >
        {isLoading ? 'Testing...' : 'Test Gemini AI'}
      </button>

      {testResult && (
        <div className="bg-green-800 p-4 rounded mb-4">
          <pre className="text-white whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}

      {error && (
        <div className="bg-red-800 p-4 rounded">
          <pre className="text-white whitespace-pre-wrap">{error}</pre>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Common Issues:</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>Invalid API key format</li>
          <li>API key not activated</li>
          <li>Quota exceeded</li>
          <li>Network connectivity issues</li>
          <li>Package installation problems</li>
        </ul>
      </div>
    </div>
  );
};

export default AiTest;
