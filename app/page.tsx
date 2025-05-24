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
      const response = await fetch('/api/check-membership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telegramId: userId, channelUsername }),
      });
      
      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        setMessage('Error: Invalid response from server');
        return;
      }

      if (!response.ok) {
        setMessage(`Error: ${data.error || 'Failed to check membership'}`);
      } else {
        setMessage(data.isMember ? 'User is subscribed to the channel/group.' : 'User is NOT subscribed to the channel/group.');
      }
    } catch (error) {
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
      setTestMessage(data.message);
    } catch (error) {
      setTestMessage('An error occurred during the test');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#2481cc]">
      <div className="flex-1 p-4 max-w-md mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h1 className="text-xl font-semibold text-center text-gray-800">Car Maintenance</h1>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter Telegram User ID"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2481cc] focus:border-transparent text-gray-800 bg-gray-50"
                required
              />
            </div>

            <div>
              <label htmlFor="channelUsername" className="block text-sm font-medium text-gray-700 mb-1">Channel/Group</label>
              <input
                type="text"
                id="channelUsername"
                value={channelUsername}
                onChange={(e) => setChannelUsername(e.target.value)}
                placeholder="Enter @username or ID"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2481cc] focus:border-transparent text-gray-800 bg-gray-50"
                required
              />
            </div>

            <button
              onClick={checkMembership}
              disabled={isLoading}
              className="w-full bg-[#2481cc] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#1e6ba8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2481cc] disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
              {isLoading ? 'Checking...' : 'Check Membership'}
            </button>

            <div>
              <label htmlFor="testValue" className="block text-sm font-medium text-gray-700 mb-1">Test Value</label>
              <input
                type="number"
                id="testValue"
                value={testValue}
                onChange={(e) => setTestValue(e.target.value)}
                placeholder="Enter a number"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2481cc] focus:border-transparent text-gray-800 bg-gray-50"
              />
            </div>

            <button
              onClick={runTest}
              disabled={isLoading}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
              {isLoading ? 'Testing...' : 'Test'}
            </button>

            {message && (
              <div className={`mt-4 p-3 rounded-xl text-sm font-medium ${
                message.startsWith('Error:') || message.includes('NOT subscribed') 
                  ? 'bg-red-50 text-red-600' 
                  : 'bg-green-50 text-green-600'
              }`}>
                {message}
              </div>
            )}

            {testMessage && (
              <div className="mt-4 p-3 rounded-xl text-sm font-medium bg-green-50 text-green-600">
                {testMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
