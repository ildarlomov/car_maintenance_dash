"use client"; // Required for useState and event handlers

import { useState } from 'react';

export default function Home() {
  const [userId, setUserId] = useState('');
  const [channelUsername, setChannelUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [testValue, setTestValue] = useState('');

  const checkMembership = async () => {
    if (!userId || !channelUsername) {
      setMessage('Please enter both User ID and Channel Username.');
      return;
    }
    setIsLoading(true);
    setMessage('');

    try {
      console.log('Sending request with:', { telegramId: userId, channelUsername });
      
      const response = await fetch('/api/check-membership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telegramId: userId, channelUsername }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        setMessage('Error: Invalid response from server');
        return;
      }

      if (!response.ok) {
        setMessage(`Error: ${data.error || 'Failed to check membership'}`);
      } else {
        setMessage(data.isMember ? 'User is subscribed to the channel/group.' : 'User is NOT subscribed to the channel/group.');
      }
    } catch (error) {
      console.error('Frontend Error:', error);
      setMessage('An error occurred while checking membership.');
    } finally {
      setIsLoading(false);
    }
  };

  const runTest = async () => {
    setIsLoading(true);
    setTestMessage('');

    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: Number(testValue) }),
      });

      const data = await response.json();
      if (data.success) {
        setTestMessage(data.message);
      } else {
        setTestMessage(data.message);
      }
    } catch (error) {
      console.error('Test Error:', error);
      setTestMessage('An error occurred during the test');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center text-black">Telegram Membership Check</h1>
        
        <div className="mb-4">
          <label htmlFor="userId" className="block text-sm font-medium text-black mb-1">User ID</label>
          <input
            type="text" // Keep as text to allow numeric input easily
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter Telegram User ID (e.g., 123456789)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="channelUsername" className="block text-sm font-medium text-black mb-1">Channel/Group Username or ID</label>
          <input
            type="text"
            id="channelUsername"
            value={channelUsername}
            onChange={(e) => setChannelUsername(e.target.value)}
            placeholder="Enter @username or -100... ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            required
          />
        </div>

        <button
          onClick={checkMembership}
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out mb-4"
        >
          {isLoading ? 'Checking...' : 'Check Membership'}
        </button>

        <div className="mb-4">
          <label htmlFor="testValue" className="block text-sm font-medium text-black mb-1">Test Value</label>
          <input
            type="number"
            id="testValue"
            value={testValue}
            onChange={(e) => setTestValue(e.target.value)}
            placeholder="Enter a number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
          />
        </div>

        <button
          onClick={runTest}
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          {isLoading ? 'Testing...' : 'Test'}
        </button>

        {message && (
          <p className={`mt-6 text-center text-sm ${message.startsWith('Error:') || message.includes('NOT subscribed') ? 'text-red-600' : 'text-green-600'} font-medium`}>
            {message}
          </p>
        )}

        {testMessage && (
          <p className="mt-6 text-center text-sm text-green-600 font-medium">
            {testMessage}
          </p>
        )}
      </div>
    </main>
  );
}
