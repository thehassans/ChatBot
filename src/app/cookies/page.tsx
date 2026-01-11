'use client';

import { motion } from 'framer-motion';
import { Navbar, Footer } from '@/components/layout';
import { Cookie, Settings, BarChart, Shield, ToggleRight } from 'lucide-react';

const cookieTypes = [
  { icon: Shield, name: 'Essential Cookies', description: 'Required for basic site functionality. Cannot be disabled.', examples: ['Session management', 'Security tokens', 'Load balancing'] },
  { icon: BarChart, name: 'Analytics Cookies', description: 'Help us understand how visitors interact with our platform.', examples: ['Page views', 'User journey', 'Performance metrics'] },
  { icon: Settings, name: 'Functional Cookies', description: 'Remember your preferences and settings.', examples: ['Language preferences', 'Theme settings', 'Dashboard layout'] },
  { icon: ToggleRight, name: 'Marketing Cookies', description: 'Used to deliver relevant advertisements.', examples: ['Ad targeting', 'Campaign tracking', 'Retargeting'] },
];

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-dark-950">
      <Navbar />
      
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-purple/5" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6">
              <Cookie className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-500">Legal</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Cookie <span className="gradient-text">Policy</span></h1>
            <p className="text-gray-600 dark:text-white/60">Last updated: December 15, 2024</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-white/5 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What Are Cookies?</h2>
            <p className="text-gray-600 dark:text-white/60 leading-relaxed">
              Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, analyzing site usage, and enabling certain features.
            </p>
          </motion.div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Types of Cookies We Use</h2>
          <div className="space-y-4 mb-12">
            {cookieTypes.map((type, index) => (
              <motion.div key={type.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-white/5">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <type.icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{type.name}</h3>
                    <p className="text-gray-600 dark:text-white/60 mb-3">{type.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {type.examples.map((example) => (
                        <span key={example} className="px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60 text-sm rounded-full">{example}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-white/5 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Managing Cookies</h2>
            <p className="text-gray-600 dark:text-white/60 leading-relaxed mb-4">
              You can control and manage cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-white/60 space-y-2">
              <li>View and delete existing cookies</li>
              <li>Block all or certain cookies</li>
              <li>Set preferences for specific websites</li>
              <li>Get notified when cookies are set</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-2xl p-8 border border-primary-500/20">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Questions?</h2>
            <p className="text-gray-700 dark:text-white/70 mb-2">Contact us about our cookie practices:</p>
            <p className="text-gray-900 dark:text-white font-medium">privacy@magneticnobot.com</p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
