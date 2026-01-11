'use client';

import { motion } from 'framer-motion';
import { Navbar, Footer } from '@/components/layout';
import { Briefcase, MapPin, Clock, ArrowRight, Heart, Zap, Globe, Coffee, Dumbbell, BookOpen, DollarSign, Users } from 'lucide-react';

const positions = [
  {
    title: 'Senior AI/ML Engineer',
    department: 'Engineering',
    location: 'Remote / San Francisco',
    type: 'Full-time',
    description: 'Build and optimize our core AI models that power millions of customer conversations.',
  },
  {
    title: 'Full Stack Developer',
    department: 'Engineering',
    location: 'Remote / New York',
    type: 'Full-time',
    description: 'Create beautiful, performant interfaces for our dashboard and customer-facing products.',
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    description: 'Shape the future of AI-human interaction through thoughtful, intuitive design.',
  },
  {
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Remote / London',
    type: 'Full-time',
    description: 'Help our enterprise customers achieve their support automation goals.',
  },
  {
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Scale our infrastructure to handle billions of messages with 99.99% uptime.',
  },
  {
    title: 'Content Marketing Manager',
    department: 'Marketing',
    location: 'Remote / Austin',
    type: 'Full-time',
    description: 'Tell our story and educate the market about AI-powered customer support.',
  },
];

const benefits = [
  { icon: DollarSign, title: 'Competitive Salary', description: 'Top-tier compensation with equity packages' },
  { icon: Heart, title: 'Health & Wellness', description: 'Comprehensive medical, dental, and vision coverage' },
  { icon: Globe, title: 'Remote First', description: 'Work from anywhere in the world' },
  { icon: Coffee, title: 'Unlimited PTO', description: 'Take the time you need to recharge' },
  { icon: BookOpen, title: 'Learning Budget', description: '$2,000/year for courses and conferences' },
  { icon: Dumbbell, title: 'Wellness Stipend', description: '$100/month for gym or wellness apps' },
  { icon: Users, title: 'Team Retreats', description: 'Annual all-company gatherings worldwide' },
  { icon: Zap, title: 'Latest Tech', description: 'Top-of-the-line equipment and tools' },
];

const values = [
  { title: 'Move Fast', description: 'We ship early and iterate quickly based on real feedback.' },
  { title: 'Customer Obsessed', description: 'Every decision starts with "How does this help our customers?"' },
  { title: 'Radical Transparency', description: 'Open communication and honest feedback drive us forward.' },
  { title: 'Own Your Impact', description: 'Take initiative, make decisions, and own the outcomes.' },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-dark-950">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-purple/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6">
              <Briefcase className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-500">We're Hiring</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Build the Future of{' '}
              <span className="gradient-text">AI Support</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-white/60 leading-relaxed mb-8">
              Join a team of passionate builders creating AI that transforms how businesses 
              connect with their customers. Remote-first, impact-driven, and growing fast.
            </p>
            <a
              href="#positions"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-accent-purple text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              <span>View Open Positions</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50 dark:bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">How We Work</h2>
            <p className="text-gray-600 dark:text-white/60 text-lg">The principles that define our culture</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-white/5"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-purple rounded-lg flex items-center justify-center text-white font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-white/50">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Benefits & Perks</h2>
            <p className="text-gray-600 dark:text-white/60 text-lg">Everything you need to do your best work</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="text-center p-6 group"
              >
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-7 h-7 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-white/50 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="py-24 bg-gray-50 dark:bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Open Positions</h2>
            <p className="text-gray-600 dark:text-white/60 text-lg">Find your next opportunity</p>
          </motion.div>
          <div className="space-y-4">
            {positions.map((position, index) => (
              <motion.div
                key={position.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-white/5 hover:border-primary-500/50 transition-all cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                        {position.title}
                      </h3>
                      <span className="px-3 py-1 bg-primary-500/10 text-primary-500 text-xs font-medium rounded-full">
                        {position.department}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-white/50 mb-3">{position.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-white/40">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{position.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{position.type}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-primary-500 font-medium group-hover:space-x-3 transition-all">
                    <span>Apply Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-500 to-accent-purple relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Don't See the Right Role?
            </h2>
            <p className="text-white/80 text-xl mb-8">
              We're always looking for talented people. Send us your resume and we'll keep you in mind.
            </p>
            <a
              href="mailto:careers@magneticnobot.com"
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
