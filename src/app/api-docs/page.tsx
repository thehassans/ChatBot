'use client';

import { motion } from 'framer-motion';
import { Navbar, Footer } from '@/components/layout';
import { Code, Copy, Check, Terminal, Zap, Lock, Globe } from 'lucide-react';
import { useState } from 'react';

const endpoints = [
  { method: 'POST', path: '/api/v1/messages', description: 'Send a message to a conversation' },
  { method: 'GET', path: '/api/v1/conversations', description: 'List all conversations' },
  { method: 'GET', path: '/api/v1/conversations/:id', description: 'Get a specific conversation' },
  { method: 'POST', path: '/api/v1/bots/train', description: 'Train your bot with new data' },
  { method: 'GET', path: '/api/v1/analytics', description: 'Retrieve analytics data' },
  { method: 'POST', path: '/api/v1/webhooks', description: 'Register a webhook endpoint' },
];

const codeExample = `const response = await fetch('https://api.magneticnobot.com/v1/messages', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    conversation_id: 'conv_123',
    message: 'Hello! How can I help you today?'
  })
});

const data = await response.json();
console.log(data);`;

const features = [
  { icon: Zap, title: 'Fast & Reliable', description: '99.99% uptime with <100ms response times' },
  { icon: Lock, title: 'Secure', description: 'OAuth 2.0, API keys, and webhook signatures' },
  { icon: Globe, title: 'Global CDN', description: 'Edge locations worldwide for low latency' },
];

export default function ApiDocsPage() {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-dark-950">
      <Navbar />
      
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-purple/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6">
              <Code className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-500">API Reference</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">Build with our <span className="gradient-text">API</span></h1>
            <p className="text-xl text-gray-600 dark:text-white/60">RESTful APIs to integrate Magnetic Nobot into your applications</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-white/5 text-center">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-white/50 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Start</h2>
              <div className="bg-gray-900 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-800">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">JavaScript</span>
                  </div>
                  <button onClick={copyCode} className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors">
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 text-sm text-gray-300 overflow-x-auto"><code>{codeExample}</code></pre>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Endpoints</h2>
              <div className="space-y-3">
                {endpoints.map((endpoint) => (
                  <div key={endpoint.path} className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-white/5 hover:border-primary-500/50 transition-all cursor-pointer">
                    <div className="flex items-center space-x-3 mb-1">
                      <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded ${endpoint.method === 'GET' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}>{endpoint.method}</span>
                      <code className="text-sm text-gray-900 dark:text-white font-mono">{endpoint.path}</code>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-white/50 ml-14">{endpoint.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-primary-500 to-accent-purple">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Building?</h2>
          <p className="text-white/80 mb-8">Get your API keys and start integrating in minutes</p>
          <a href="/dashboard" className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
            <span>Get API Keys</span>
            <Code className="w-5 h-5" />
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
