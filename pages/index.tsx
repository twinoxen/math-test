import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';

import MultiplicationTable from '../components/MultiplicationTable';
import ProblemGenerator from '../components/ProblemGenerator';

const Home: NextPage = () => {
  const [activeTab, setActiveTab] = useState<'problems' | 'table'>('problems');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Head>
        <title>Math Practice Hub - Master Your Skills</title>
        <meta name="description" content="Interactive math practice with problem generation and multiplication tables. Perfect for students to improve their math skills." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="relative container mx-auto px-4 py-8 sm:py-12">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Math Practice Hub
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Master your math skills with interactive problems and multiplication tables. 
              Practice makes perfect! 🧮✨
            </p>
            
            {/* Tab Navigation */}
            <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20 w-full max-w-md mx-auto">
              <button
                onClick={() => setActiveTab('problems')}
                className={`flex-1 px-3 sm:px-6 py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                  activeTab === 'problems'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                <span className="hidden sm:inline">🎯 Problem Generator</span>
                <span className="sm:hidden">🎯 Problems</span>
              </button>
              <button
                onClick={() => setActiveTab('table')}
                className={`flex-1 px-3 sm:px-6 py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                  activeTab === 'table'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                <span className="hidden sm:inline">📊 Multiplication Table</span>
                <span className="sm:hidden">📊 Table</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-0 sm:px-4 pb-12">
        <div className="animate-fade-in">
          {activeTab === 'problems' && (
            <div className="animate-slide-in">
              <ProblemGenerator />
            </div>
          )}
          {activeTab === 'table' && (
            <div className="animate-slide-in">
              <MultiplicationTable />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="print-hide bg-white/50 backdrop-blur-sm border-t border-white/20 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Keep practicing and you&apos;ll become a math wizard! 🧙‍♂️✨
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
