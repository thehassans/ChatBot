'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { BookOpen, Code, Zap, MessageCircle, Settings, Shield, Rocket, ArrowRight, Search } from 'lucide-react';

const categories = [
  { icon: Rocket, title: 'Getting Started', description: 'Quick start guides and tutorials', articles: ['Quick Start Guide', 'Installation', 'Your First Bot', 'Basic Configuration'] },
  { icon: MessageCircle, title: 'Channels', description: 'Connect messaging platforms', articles: ['WhatsApp Setup', 'Messenger Integration', 'Web Widget', 'Email Configuration'] },
  { icon: Code, title: 'API & Webhooks', description: 'Build custom integrations', articles: ['API Overview', 'Authentication', 'Webhooks', 'Rate Limits'] },
  { icon: Settings, title: 'Configuration', description: 'Customize your bot', articles: ['AI Training', 'Response Templates', 'Business Hours', 'Team Settings'] },
  { icon: Shield, title: 'Security', description: 'Keep your data safe', articles: ['Data Privacy', 'Encryption', 'Access Control', 'Compliance'] },
  { icon: Zap, title: 'Advanced', description: 'Power user features', articles: ['Custom Actions', 'Integrations', 'Analytics API', 'White Labeling'] },
];

const popularArticles = [
  { title: 'How to train your AI with custom data', category: 'AI Training', time: '5 min' },
  { title: 'Setting up WhatsApp Business API', category: 'Channels', time: '8 min' },
  { title: 'Understanding conversation analytics', category: 'Analytics', time: '4 min' },
  { title: 'Configuring human handoff rules', category: 'Configuration', time: '6 min' },
];

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-dark-950">
      <Navbar />
      
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-purple/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6">
              <BookOpen className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-500">Documentation</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">How can we <span className="gradient-text">help?</span></h1>
            <p className="text-xl text-gray-600 dark:text-white/60 mb-8">Everything you need to build amazing customer experiences</p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search documentation..." className="w-full pl-12 pr-4 py-4 bg-white dark:bg-dark-800 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div key={category.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-white/5 hover:border-primary-500/50 transition-all group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <category.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{category.title}</h3>
                <p className="text-gray-600 dark:text-white/50 text-sm mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.articles.map((article) => (
                    <li key={article}>
                      <Link href="#" className="text-sm text-gray-600 dark:text-white/60 hover:text-primary-500 transition-colors flex items-center space-x-2">
                        <ArrowRight className="w-3 h-3" />
                        <span>{article}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Popular Articles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {popularArticles.map((article, index) => (
              <motion.div key={article.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-white/5 hover:border-primary-500/50 transition-all cursor-pointer group flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">{article.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-white/40">{article.category} · {article.time} read</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
