'use client';

import { motion } from 'framer-motion';
import { Navbar, Footer } from '@/components/layout';
import { Shield, Lock, Eye, Database, Globe, Mail } from 'lucide-react';

const sections = [
  { id: 'collection', title: 'Information We Collect', icon: Database },
  { id: 'usage', title: 'How We Use Your Information', icon: Eye },
  { id: 'sharing', title: 'Information Sharing', icon: Globe },
  { id: 'security', title: 'Data Security', icon: Lock },
  { id: 'rights', title: 'Your Rights', icon: Shield },
  { id: 'contact', title: 'Contact Us', icon: Mail },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-dark-950">
      <Navbar />
      
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-purple/5" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6">
              <Shield className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-500">Legal</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Privacy <span className="gradient-text">Policy</span></h1>
            <p className="text-gray-600 dark:text-white/60">Last updated: December 15, 2024</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-dark-800 border border-gray-200 dark:border-white/10 rounded-full text-sm hover:border-primary-500/50 transition-colors">
                <section.icon className="w-4 h-4 text-primary-500" />
                <span className="text-gray-700 dark:text-white/70">{section.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-white/5 mb-8">
              <p className="text-gray-600 dark:text-white/60 leading-relaxed">
                At Magnetic Nobot, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered customer support platform.
              </p>
            </motion.div>

            <motion.div id="collection" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-3">
                <Database className="w-6 h-6 text-primary-500" />
                <span>Information We Collect</span>
              </h2>
              <div className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-white/5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-white/60 space-y-2 mb-6">
                  <li>Name, email address, and contact information</li>
                  <li>Account credentials and authentication data</li>
                  <li>Billing information and payment details</li>
                  <li>Company name and business information</li>
                </ul>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Usage Data</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-white/60 space-y-2">
                  <li>Conversation logs and chat history</li>
                  <li>Bot training data and custom configurations</li>
                  <li>Analytics and performance metrics</li>
                  <li>Device information and IP addresses</li>
                </ul>
              </div>
            </motion.div>

            <motion.div id="usage" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-3">
                <Eye className="w-6 h-6 text-primary-500" />
                <span>How We Use Your Information</span>
              </h2>
              <div className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-white/5">
                <ul className="list-disc list-inside text-gray-600 dark:text-white/60 space-y-2">
                  <li>Provide and maintain our AI chatbot services</li>
                  <li>Improve and personalize your experience</li>
                  <li>Process transactions and send billing information</li>
                  <li>Send service updates and marketing communications</li>
                  <li>Analyze usage patterns to enhance our platform</li>
                  <li>Detect and prevent fraud or abuse</li>
                </ul>
              </div>
            </motion.div>

            <motion.div id="security" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-3">
                <Lock className="w-6 h-6 text-primary-500" />
                <span>Data Security</span>
              </h2>
              <div className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-white/5">
                <p className="text-gray-600 dark:text-white/60 mb-4">We implement industry-standard security measures including:</p>
                <ul className="list-disc list-inside text-gray-600 dark:text-white/60 space-y-2">
                  <li>256-bit SSL/TLS encryption for all data transfers</li>
                  <li>AES-256 encryption for data at rest</li>
                  <li>SOC 2 Type II certified infrastructure</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Multi-factor authentication options</li>
                </ul>
              </div>
            </motion.div>

            <motion.div id="contact" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-3">
                <Mail className="w-6 h-6 text-primary-500" />
                <span>Contact Us</span>
              </h2>
              <div className="bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-2xl p-8 border border-primary-500/20">
                <p className="text-gray-700 dark:text-white/70 mb-4">If you have questions about this Privacy Policy, please contact us:</p>
                <p className="text-gray-900 dark:text-white font-medium">privacy@magneticnobot.com</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
