'use client';

import { motion } from 'framer-motion';
import { Navbar, Footer } from '@/components/layout';
import { Sparkles, Zap, Bug, Shield, Rocket } from 'lucide-react';

const releases = [
  {
    version: '2.5.0',
    date: 'December 2024',
    type: 'major',
    changes: [
      { type: 'feature', icon: Sparkles, text: 'Introduced GPT-4 Turbo integration for faster, smarter responses' },
      { type: 'feature', icon: Zap, text: 'New real-time analytics dashboard with live metrics' },
      { type: 'improvement', icon: Rocket, text: '40% improvement in response generation speed' },
      { type: 'fix', icon: Bug, text: 'Fixed conversation threading issues in high-volume scenarios' },
    ],
  },
  {
    version: '2.4.0',
    date: 'November 2024',
    type: 'minor',
    changes: [
      { type: 'feature', icon: Sparkles, text: 'Multi-language support: 25+ languages now available' },
      { type: 'feature', icon: Shield, text: 'Enhanced security with SOC 2 Type II compliance' },
      { type: 'improvement', icon: Rocket, text: 'Improved webhook reliability and retry logic' },
      { type: 'fix', icon: Bug, text: 'Resolved timezone issues in scheduling features' },
    ],
  },
  {
    version: '2.3.0',
    date: 'October 2024',
    type: 'minor',
    changes: [
      { type: 'feature', icon: Sparkles, text: 'Custom AI training with document uploads (PDF, DOCX, TXT)' },
      { type: 'feature', icon: Zap, text: 'Slack integration for team notifications' },
      { type: 'improvement', icon: Rocket, text: 'Redesigned conversation interface for better UX' },
      { type: 'fix', icon: Bug, text: 'Fixed edge cases in sentiment analysis scoring' },
    ],
  },
  {
    version: '2.2.0',
    date: 'September 2024',
    type: 'minor',
    changes: [
      { type: 'feature', icon: Sparkles, text: 'Introduced team collaboration features' },
      { type: 'feature', icon: Shield, text: 'GDPR-compliant data export functionality' },
      { type: 'improvement', icon: Rocket, text: 'Optimized database queries for 2x faster load times' },
    ],
  },
  {
    version: '2.1.0',
    date: 'August 2024',
    type: 'minor',
    changes: [
      { type: 'feature', icon: Sparkles, text: 'Email channel support with smart threading' },
      { type: 'feature', icon: Zap, text: 'Automated follow-up sequences' },
      { type: 'fix', icon: Bug, text: 'Fixed WhatsApp media message handling' },
    ],
  },
  {
    version: '2.0.0',
    date: 'July 2024',
    type: 'major',
    changes: [
      { type: 'feature', icon: Sparkles, text: 'Complete platform redesign with new UI' },
      { type: 'feature', icon: Zap, text: 'Unified inbox for all channels' },
      { type: 'feature', icon: Shield, text: 'Enterprise SSO support (SAML, OAuth)' },
      { type: 'improvement', icon: Rocket, text: 'New pricing tiers with more value' },
    ],
  },
];

const typeColors: Record<string, string> = {
  feature: 'text-green-500 bg-green-500/10',
  improvement: 'text-blue-500 bg-blue-500/10',
  fix: 'text-orange-500 bg-orange-500/10',
};

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-dark-950">
      <Navbar />
      
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-purple/5" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-accent-purple/10 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6">
              <Rocket className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-500">Changelog</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">What's <span className="gradient-text">New</span></h1>
            <p className="text-xl text-gray-600 dark:text-white/60">Stay up to date with the latest features, improvements, and fixes.</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500 via-accent-purple to-transparent" />
            <div className="space-y-12">
              {releases.map((release, index) => (
                <motion.div key={release.version} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="relative pl-20">
                  <div className={`absolute left-4 w-8 h-8 rounded-full flex items-center justify-center ${release.type === 'major' ? 'bg-gradient-to-br from-primary-500 to-accent-purple' : 'bg-white dark:bg-dark-800 border-2 border-primary-500'}`}>
                    {release.type === 'major' ? <Sparkles className="w-4 h-4 text-white" /> : <div className="w-2 h-2 bg-primary-500 rounded-full" />}
                  </div>
                  <div className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-white/5 hover:border-primary-500/30 transition-colors">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">v{release.version}</span>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60 text-sm rounded-full">{release.date}</span>
                      {release.type === 'major' && <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-accent-purple text-white text-sm rounded-full font-medium">Major Release</span>}
                    </div>
                    <ul className="space-y-4">
                      {release.changes.map((change, i) => (
                        <li key={i} className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[change.type]}`}>
                            <change.icon className="w-4 h-4" />
                          </div>
                          <span className="text-gray-700 dark:text-white/70 pt-1">{change.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
