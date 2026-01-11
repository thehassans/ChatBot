'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { Calendar, Clock, ArrowRight, BookOpen, TrendingUp, Lightbulb, Users } from 'lucide-react';

const featuredPost = {
  title: 'The Future of AI in Customer Support: 2024 and Beyond',
  excerpt: 'Discover how artificial intelligence is revolutionizing the way businesses interact with their customers, and what trends to watch for in the coming years.',
  category: 'Industry Insights',
  date: 'Dec 15, 2024',
  readTime: '8 min read',
  image: '🤖',
};

const posts = [
  {
    title: 'How to Train Your AI Chatbot for Maximum Effectiveness',
    excerpt: 'Learn the best practices for training your AI assistant to handle complex customer queries with ease.',
    category: 'Tutorials',
    date: 'Dec 12, 2024',
    readTime: '5 min read',
    icon: Lightbulb,
  },
  {
    title: '10 Ways AI Chatbots Boost Customer Satisfaction',
    excerpt: 'Real case studies showing measurable improvements in customer satisfaction scores after implementing AI support.',
    category: 'Case Studies',
    date: 'Dec 10, 2024',
    readTime: '6 min read',
    icon: TrendingUp,
  },
  {
    title: 'Building a Seamless Omnichannel Support Strategy',
    excerpt: 'How to create a unified customer experience across WhatsApp, Messenger, email, and web chat.',
    category: 'Strategy',
    date: 'Dec 8, 2024',
    readTime: '7 min read',
    icon: Users,
  },
  {
    title: 'The Psychology Behind Effective Chatbot Conversations',
    excerpt: 'Understanding how customers interact with AI and designing conversations that feel natural.',
    category: 'Research',
    date: 'Dec 5, 2024',
    readTime: '9 min read',
    icon: BookOpen,
  },
  {
    title: 'Reducing Support Costs by 60% with AI Automation',
    excerpt: 'A detailed breakdown of how one e-commerce company transformed their support operations.',
    category: 'Case Studies',
    date: 'Dec 3, 2024',
    readTime: '6 min read',
    icon: TrendingUp,
  },
  {
    title: 'Getting Started with Magnetic Nobot: A Complete Guide',
    excerpt: 'Everything you need to know to set up your first AI-powered chatbot in under 30 minutes.',
    category: 'Tutorials',
    date: 'Dec 1, 2024',
    readTime: '10 min read',
    icon: Lightbulb,
  },
];

const categories = ['All', 'Tutorials', 'Case Studies', 'Industry Insights', 'Strategy', 'Research'];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-dark-950">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-purple/5" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6">
              <BookOpen className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-500">Our Blog</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Insights & <span className="gradient-text">Resources</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-white/60">
              Expert tips, industry trends, and strategies to elevate your customer support game.
            </p>
          </motion.div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  index === 0
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-3xl p-8 md:p-12 border border-primary-500/20 overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block px-3 py-1 bg-primary-500/20 text-primary-500 text-sm font-medium rounded-full mb-4">
                  {featuredPost.category}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-500 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 dark:text-white/60 text-lg mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-white/40 mb-6">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{featuredPost.date}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPost.readTime}</span>
                  </span>
                </div>
                <span className="inline-flex items-center space-x-2 text-primary-500 font-medium group-hover:space-x-3 transition-all">
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-gradient-to-br from-primary-500 to-accent-purple rounded-3xl flex items-center justify-center text-8xl transform group-hover:scale-110 transition-transform">
                  {featuredPost.image}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-dark-800 rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden group cursor-pointer hover:border-primary-500/50 transition-all hover:shadow-xl hover:shadow-primary-500/5"
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <post.icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60 text-xs font-medium rounded-full mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary-500 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-white/50 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-white/40">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white/70 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gray-50 dark:bg-dark-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-600 dark:text-white/60 mb-8">
              Get the latest insights and tips delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-purple text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
