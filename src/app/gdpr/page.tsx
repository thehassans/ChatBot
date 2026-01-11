'use client';

import { motion } from 'framer-motion';
import { Navbar, Footer } from '@/components/layout';
import { Shield, Globe, Download, Trash2, UserCheck, Lock, Mail } from 'lucide-react';

const rights = [
  { icon: UserCheck, title: 'Right to Access', description: 'Request a copy of all personal data we hold about you.' },
  { icon: Download, title: 'Right to Portability', description: 'Receive your data in a structured, machine-readable format.' },
  { icon: Trash2, title: 'Right to Erasure', description: 'Request deletion of your personal data ("Right to be Forgotten").' },
  { icon: Lock, title: 'Right to Restrict', description: 'Limit how we process your personal information.' },
];

export default function GdprPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-dark-950">
      <Navbar />
      
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-purple/5" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6">
              <Globe className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-500">Compliance</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">GDPR <span className="gradient-text">Compliance</span></h1>
            <p className="text-gray-600 dark:text-white/60">Your data rights under the General Data Protection Regulation</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-2xl p-8 border border-primary-500/20 mb-12">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 bg-white dark:bg-dark-800 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-7 h-7 text-primary-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Our Commitment</h2>
                <p className="text-gray-700 dark:text-white/70">Magnetic Nobot is fully committed to GDPR compliance. We respect your privacy rights and have implemented comprehensive measures to protect your personal data in accordance with EU regulations.</p>
              </div>
            </div>
          </motion.div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Rights Under GDPR</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {rights.map((right, index) => (
              <motion.div key={right.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-white/5">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-xl flex items-center justify-center mb-4">
                  <right.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{right.title}</h3>
                <p className="text-gray-600 dark:text-white/60">{right.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-white/5 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Processing</h2>
            <div className="space-y-4 text-gray-600 dark:text-white/60">
              <p><strong className="text-gray-900 dark:text-white">Legal Basis:</strong> We process your data based on contractual necessity, legitimate interests, and your consent where required.</p>
              <p><strong className="text-gray-900 dark:text-white">Data Transfers:</strong> When transferring data outside the EU, we use Standard Contractual Clauses and ensure adequate protection.</p>
              <p><strong className="text-gray-900 dark:text-white">Retention:</strong> We retain your data only as long as necessary for the purposes outlined in our Privacy Policy.</p>
              <p><strong className="text-gray-900 dark:text-white">Sub-processors:</strong> We maintain a list of sub-processors and ensure they meet GDPR requirements.</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-white/5 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Exercise Your Rights</h2>
            <p className="text-gray-600 dark:text-white/60 mb-6">To exercise any of your GDPR rights, you can:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-white/60 space-y-2 mb-6">
              <li>Use the data export feature in your dashboard settings</li>
              <li>Submit a request through our contact form</li>
              <li>Email our Data Protection Officer directly</li>
            </ul>
            <p className="text-gray-600 dark:text-white/60">We will respond to all requests within 30 days as required by GDPR.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl p-8 text-center">
            <Mail className="w-12 h-12 text-white mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Data Protection Officer</h2>
            <p className="text-white/80 mb-4">Contact our DPO for any GDPR-related inquiries</p>
            <a href="mailto:dpo@magneticnobot.com" className="inline-block bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              dpo@magneticnobot.com
            </a>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
