'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Zap, MessageCircle, Facebook, MessageSquare, Mail, 
  Bot, Users, BarChart3, Shield, Clock, Globe,
  Check, ArrowRight, Star, Sparkles
} from 'lucide-react';
import { Navbar, Footer, Cart } from '@/components/layout';
import { Button } from '@/components/ui';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';

const services = [
  {
    id: 'whatsapp-bot',
    name: 'WhatsApp Bot',
    description: 'AI-powered chatbot for WhatsApp Business. Respond to customers instantly 24/7.',
    shortDescription: 'Automate WhatsApp support',
    price: 49,
    originalPrice: 79,
    icon: MessageCircle,
    color: '#25D366',
    channels: ['whatsapp'],
    features: [
      'Unlimited conversations',
      'AI-powered responses',
      'Human handoff',
      'Analytics dashboard',
      'Custom training',
    ],
    popular: false,
  },
  {
    id: 'messenger-bot',
    name: 'Messenger Bot',
    description: 'Connect with your Facebook audience through intelligent automated responses.',
    shortDescription: 'Automate Messenger support',
    price: 49,
    originalPrice: 79,
    icon: Facebook,
    color: '#0084FF',
    channels: ['messenger'],
    features: [
      'Unlimited conversations',
      'AI-powered responses',
      'Human handoff',
      'Analytics dashboard',
      'Custom training',
    ],
    popular: false,
  },
  {
    id: 'all-in-one',
    name: 'All-in-One Suite',
    description: 'Complete customer support solution with WhatsApp, Messenger, Web Widget, and Email.',
    shortDescription: 'All channels in one place',
    price: 99,
    originalPrice: 199,
    icon: Sparkles,
    color: '#a855f7',
    channels: ['whatsapp', 'messenger', 'widget', 'email'],
    features: [
      'All channels included',
      'Unified inbox',
      'Advanced AI training',
      'Priority support',
      'Custom integrations',
      'Team collaboration',
      'Advanced analytics',
    ],
    popular: true,
  },
];

const features = [
  {
    icon: Bot,
    title: 'Human-Like AI',
    description: 'Our AI responds like a real support agent, never revealing its artificial nature.',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Never miss a customer inquiry. Your bot works around the clock.',
  },
  {
    icon: Users,
    title: 'Easy Training',
    description: 'Train your bot with your website, documents, or custom knowledge base.',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    description: 'Track conversations, response times, and customer satisfaction.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Enterprise-grade security with full data encryption.',
  },
  {
    icon: Globe,
    title: 'Multi-Language',
    description: 'Support customers in their preferred language automatically.',
  },
];

export default function HomePage() {
  const { addToCart, isInCart, setCartOpen } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (service: typeof services[0]) => {
    if (!isInCart(service.id)) {
      addToCart({
        serviceId: service.id,
        serviceName: service.name,
        price: service.price,
        channels: service.channels,
        icon: service.icon.name || 'MessageSquare',
      });
      setCartOpen(true);
    }
  };

  return (
    <>
      <Navbar />
      <Cart />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-600 dark:text-primary-300 text-sm mb-8">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Customer Support
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            >
              Customer Support That
              <br />
              <span className="gradient-text">Feels Human</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-white/60 max-w-2xl mx-auto mb-10"
            >
              Deploy AI chatbots on WhatsApp, Messenger, and your website that respond like real humans. 
              Train them with your knowledge base and watch them handle support 24/7.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="#services">
                <Button size="lg" className="group">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button variant="secondary" size="lg">
                  Watch Demo
                </Button>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-16 flex items-center justify-center gap-8 text-gray-500 dark:text-white/40"
            >
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-white/10" />
              <div>500+ Businesses</div>
              <div className="hidden sm:block w-px h-6 bg-white/10" />
              <div>1M+ Messages/month</div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Choose Your <span className="gradient-text">Solution</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-white/60 max-w-2xl mx-auto">
                Select the channels you need and start automating your customer support today.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-white dark:bg-dark-900/50 backdrop-blur-xl border rounded-2xl p-8 shadow-sm ${
                    service.popular 
                      ? 'border-primary-500/50 shadow-lg shadow-primary-500/10' 
                      : 'border-gray-200 dark:border-white/10'
                  }`}
                >
                  {service.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-500 to-accent-purple rounded-full text-white text-sm font-medium">
                      Most Popular
                    </div>
                  )}

                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${service.color}20` }}
                  >
                    <service.icon className="w-7 h-7" style={{ color: service.color }} />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{service.name}</h3>
                  <p className="text-gray-600 dark:text-white/60 mb-6">{service.description}</p>

                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{formatPrice(service.price)}</span>
                    <span className="text-gray-500 dark:text-white/50">/month</span>
                    {service.originalPrice && (
                      <span className="text-gray-400 dark:text-white/40 line-through text-sm">
                        {formatPrice(service.originalPrice)}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-gray-700 dark:text-white/70">
                        <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleAddToCart(service)}
                    variant={service.popular ? 'primary' : 'secondary'}
                    className="w-full"
                    disabled={mounted && isInCart(service.id)}
                  >
                    {mounted && isInCart(service.id) ? 'Added to Cart' : 'Add to Cart'}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-gray-50 dark:bg-dark-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Why <span className="gradient-text">Magnetic Nobot</span>?
              </h2>
              <p className="text-xl text-gray-600 dark:text-white/60 max-w-2xl mx-auto">
                Everything you need to deliver exceptional customer support at scale.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-8 hover:border-primary-500/50 transition-all duration-300 shadow-sm"
                >
                  <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-white/60">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-purple/10" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Ready to Transform Your
                <br />
                <span className="gradient-text">Customer Support?</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-white/60 mb-10">
                Join 500+ businesses already using Magnetic Nobot to delight their customers.
              </p>
              <Link href="#services">
                <Button size="lg" className="group">
                  Get Started Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
