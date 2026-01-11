'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar, Footer } from '@/components/layout';
import { Mail, Phone, MapPin, Send, MessageCircle, CheckCircle } from 'lucide-react';

const contactMethods = [
  { icon: Mail, title: 'Email Us', description: 'Response within 2 hours', value: 'support@magneticnobot.com', href: 'mailto:support@magneticnobot.com' },
  { icon: MessageCircle, title: 'Live Chat', description: 'Chat with our team', value: 'Start a conversation', href: '#' },
  { icon: Phone, title: 'Call Us', description: 'Mon-Fri 8am-6pm PST', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
];

const offices = [
  { city: 'San Francisco', address: '123 Market Street, Suite 400', country: 'United States' },
  { city: 'London', address: '45 Liverpool Street, EC2M', country: 'United Kingdom' },
  { city: 'Singapore', address: '1 Raffles Place, Tower 2', country: 'Singapore' },
];

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: '', email: '', company: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setIsSubmitted(true); };

  return (
    <main className="min-h-screen bg-white dark:bg-dark-950">
      <Navbar />
      
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-purple/5" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6">
              <Mail className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-500">Contact Us</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">Get in <span className="gradient-text">Touch</span></h1>
            <p className="text-xl text-gray-600 dark:text-white/60">Have questions? We'd love to hear from you.</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => (
              <motion.a key={method.title} href={method.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-white/5 hover:border-primary-500/50 transition-all group">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <method.icon className="w-7 h-7 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{method.title}</h3>
                <p className="text-gray-600 dark:text-white/50 text-sm mb-4">{method.description}</p>
                <span className="text-primary-500 font-medium">{method.value}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 dark:bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Send Us a Message</h2>
              {isSubmitted ? (
                <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-600 dark:text-white/60">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Full Name</label>
                      <input type="text" required value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Email Address</label>
                      <input type="email" required value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="john@company.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Subject</label>
                    <input type="text" required value={formState.subject} onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="How can we help?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Message</label>
                    <textarea required rows={5} value={formState.message} onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" placeholder="Tell us more..." />
                  </div>
                  <button type="submit" className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-500 to-accent-purple text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                    <span>Send Message</span>
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              )}
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Our Offices</h2>
              <div className="space-y-6">
                {offices.map((office) => (
                  <div key={office.city} className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-white/5">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-primary-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{office.city}</h3>
                        <p className="text-gray-600 dark:text-white/50">{office.address}</p>
                        <p className="text-gray-500 dark:text-white/40 text-sm">{office.country}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
