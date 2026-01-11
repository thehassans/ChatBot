'use client';

import { motion } from 'framer-motion';
import { Navbar, Footer } from '@/components/layout';
import { HelpCircle, Search, MessageCircle, BookOpen, Video, Mail, ChevronRight, ExternalLink } from 'lucide-react';

const helpCategories = [
  { icon: BookOpen, title: 'Getting Started', description: 'New to Magnetic Nobot? Start here', articles: 12 },
  { icon: MessageCircle, title: 'Channels & Integrations', description: 'Connect WhatsApp, Messenger & more', articles: 18 },
  { icon: HelpCircle, title: 'Troubleshooting', description: 'Common issues and solutions', articles: 24 },
  { icon: Video, title: 'Video Tutorials', description: 'Step-by-step visual guides', articles: 8 },
];

const popularQuestions = [
  'How do I connect my WhatsApp Business account?',
  'Can I train my bot with my own data?',
  'How does the human handoff feature work?',
  'What languages does the AI support?',
  'How do I export my conversation data?',
  'Can I customize the chat widget design?',
];

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-dark-950">
      <Navbar />
      
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-purple/5" />
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6">
              <HelpCircle className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-500">Help Center</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">How can we <span className="gradient-text">help you?</span></h1>
            <p className="text-xl text-gray-600 dark:text-white/60 mb-8">Search our knowledge base or browse categories below</p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search for answers..." className="w-full pl-12 pr-4 py-4 bg-white dark:bg-dark-800 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category, index) => (
              <motion.div key={category.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-white/5 hover:border-primary-500/50 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <category.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">{category.title}</h3>
                <p className="text-gray-600 dark:text-white/50 text-sm mb-4">{category.description}</p>
                <span className="text-sm text-primary-500 font-medium">{category.articles} articles</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-dark-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {popularQuestions.map((question, index) => (
              <motion.div key={question} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-white/5 hover:border-primary-500/50 transition-all cursor-pointer group flex items-center justify-between">
                <span className="text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">{question}</span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Still Need Help?</h2>
          <p className="text-gray-600 dark:text-white/60 mb-8">Our support team is available 24/7 to assist you</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/contact" className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-500 to-accent-purple text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity">
              <Mail className="w-5 h-5" />
              <span>Contact Support</span>
            </a>
            <a href="#" className="inline-flex items-center justify-center space-x-2 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span>Live Chat</span>
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
