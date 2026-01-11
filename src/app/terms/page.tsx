'use client';

import { motion } from 'framer-motion';
import { Navbar, Footer } from '@/components/layout';
import { FileText, AlertCircle, CreditCard, Scale, XCircle, Mail } from 'lucide-react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-dark-950">
      <Navbar />
      
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-purple/5" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6">
              <FileText className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-500">Legal</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Terms of <span className="gradient-text">Service</span></h1>
            <p className="text-gray-600 dark:text-white/60">Last updated: December 15, 2024</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800 dark:text-amber-200">By accessing or using Magnetic Nobot, you agree to be bound by these Terms of Service. Please read them carefully.</p>
            </div>
          </motion.div>

          <div className="space-y-8">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-white/5">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-3">
                <Scale className="w-6 h-6 text-primary-500" />
                <span>Acceptance of Terms</span>
              </h2>
              <p className="text-gray-600 dark:text-white/60 leading-relaxed">
                These Terms of Service govern your access to and use of Magnetic Nobot's AI-powered customer support platform. By creating an account or using our services, you acknowledge that you have read, understood, and agree to be bound by these terms.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-white/5">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Service Description</h2>
              <p className="text-gray-600 dark:text-white/60 leading-relaxed mb-4">Magnetic Nobot provides:</p>
              <ul className="list-disc list-inside text-gray-600 dark:text-white/60 space-y-2">
                <li>AI-powered chatbot solutions for customer support</li>
                <li>Integration with messaging platforms (WhatsApp, Messenger, etc.)</li>
                <li>Analytics and reporting dashboards</li>
                <li>Custom AI training capabilities</li>
                <li>API access for custom integrations</li>
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-white/5">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-3">
                <CreditCard className="w-6 h-6 text-primary-500" />
                <span>Billing & Payments</span>
              </h2>
              <ul className="list-disc list-inside text-gray-600 dark:text-white/60 space-y-2">
                <li>Subscription fees are billed monthly or annually in advance</li>
                <li>All fees are non-refundable except as required by law</li>
                <li>We reserve the right to modify pricing with 30 days notice</li>
                <li>Failed payments may result in service suspension</li>
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-white/5">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-3">
                <XCircle className="w-6 h-6 text-primary-500" />
                <span>Prohibited Uses</span>
              </h2>
              <p className="text-gray-600 dark:text-white/60 mb-4">You agree not to use our services for:</p>
              <ul className="list-disc list-inside text-gray-600 dark:text-white/60 space-y-2">
                <li>Any unlawful or fraudulent purposes</li>
                <li>Harassing, abusing, or harming others</li>
                <li>Distributing malware or harmful code</li>
                <li>Attempting to gain unauthorized access</li>
                <li>Violating intellectual property rights</li>
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-2xl p-8 border border-primary-500/20">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-3">
                <Mail className="w-6 h-6 text-primary-500" />
                <span>Contact</span>
              </h2>
              <p className="text-gray-700 dark:text-white/70 mb-2">Questions about these Terms? Contact us:</p>
              <p className="text-gray-900 dark:text-white font-medium">legal@magneticnobot.com</p>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
