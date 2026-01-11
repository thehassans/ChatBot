'use client';

import { motion } from 'framer-motion';
import { Navbar, Footer } from '@/components/layout';
import { Users, Target, Rocket, Heart, Award, Globe, Zap, Shield } from 'lucide-react';

const team = [
  { name: 'Sarah Chen', role: 'CEO & Co-Founder', image: '👩‍💼', bio: 'Former Google AI Lead' },
  { name: 'Marcus Johnson', role: 'CTO & Co-Founder', image: '👨‍💻', bio: 'Ex-Amazon Principal Engineer' },
  { name: 'Emily Rodriguez', role: 'Head of Product', image: '👩‍🎨', bio: 'Previously at Stripe' },
  { name: 'David Kim', role: 'Head of AI', image: '🧑‍🔬', bio: 'PhD in Machine Learning' },
];

const values = [
  { icon: Heart, title: 'Customer First', description: 'Every decision starts with how it helps our customers succeed.' },
  { icon: Rocket, title: 'Innovation', description: 'We push boundaries to create AI that feels genuinely human.' },
  { icon: Shield, title: 'Trust & Privacy', description: 'Your data security is our top priority, always.' },
  { icon: Globe, title: 'Global Impact', description: 'Making premium AI support accessible to businesses worldwide.' },
];

const stats = [
  { value: '10M+', label: 'Conversations Handled' },
  { value: '5,000+', label: 'Happy Customers' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '150+', label: 'Countries Served' },
];

export default function AboutPage() {
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
              <Users className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-500">About Us</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              We're Building the Future of{' '}
              <span className="gradient-text">Customer Support</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-white/60 leading-relaxed">
              Founded in 2022, Magnetic Nobot is on a mission to transform how businesses 
              connect with their customers through AI that feels genuinely human.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-white/50">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center space-x-2 bg-accent-purple/10 border border-accent-purple/20 rounded-full px-4 py-2 mb-6">
                <Target className="w-4 h-4 text-accent-purple" />
                <span className="text-sm font-medium text-accent-purple">Our Mission</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Making AI Support Accessible to Everyone
              </h2>
              <p className="text-gray-600 dark:text-white/60 text-lg leading-relaxed mb-6">
                We believe every business, regardless of size, deserves access to enterprise-grade 
                AI customer support. Our platform democratizes advanced AI technology, making it 
                simple, affordable, and powerful.
              </p>
              <p className="text-gray-600 dark:text-white/60 text-lg leading-relaxed">
                Our AI doesn't just answer questions—it understands context, remembers preferences, 
                and delivers personalized experiences that turn first-time visitors into loyal customers.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-primary-500/20 to-accent-purple/20 rounded-3xl p-8 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl flex items-center justify-center">
                  <Zap className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-purple/20 rounded-2xl blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary-500/20 rounded-2xl blur-xl" />
            </motion.div>
          </div>
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
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
            <p className="text-gray-600 dark:text-white/60 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-white/5 hover:border-primary-500/50 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <value.icon className="w-7 h-7 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-white/50">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Meet Our Team</h2>
            <p className="text-gray-600 dark:text-white/60 text-lg max-w-2xl mx-auto">
              Passionate experts building the future of AI-powered support
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary-500/20 to-accent-purple/20 rounded-full flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                  {member.image}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-primary-500 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 dark:text-white/50 text-sm">{member.bio}</p>
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
              Ready to Transform Your Support?
            </h2>
            <p className="text-white/80 text-xl mb-8">
              Join thousands of businesses delivering exceptional customer experiences with AI.
            </p>
            <a
              href="/#pricing"
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              <span>Get Started Today</span>
              <Award className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
