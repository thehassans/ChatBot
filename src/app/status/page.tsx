'use client';

import { motion } from 'framer-motion';
import { Navbar, Footer } from '@/components/layout';
import { Activity, CheckCircle, Clock, AlertTriangle, Server, Globe, Database, Zap } from 'lucide-react';

const services = [
  { name: 'API', status: 'operational', uptime: '99.99%', icon: Zap },
  { name: 'Web Application', status: 'operational', uptime: '99.98%', icon: Globe },
  { name: 'WhatsApp Integration', status: 'operational', uptime: '99.97%', icon: Server },
  { name: 'Messenger Integration', status: 'operational', uptime: '99.99%', icon: Server },
  { name: 'AI Processing', status: 'operational', uptime: '99.95%', icon: Activity },
  { name: 'Database', status: 'operational', uptime: '99.99%', icon: Database },
];

const incidents = [
  { date: 'Dec 10, 2024', title: 'Scheduled Maintenance', description: 'Brief maintenance window for infrastructure upgrades. No impact to services.', status: 'resolved', duration: '15 min' },
  { date: 'Dec 5, 2024', title: 'API Latency Increase', description: 'Some users experienced increased API response times. Issue identified and resolved.', status: 'resolved', duration: '23 min' },
  { date: 'Nov 28, 2024', title: 'WhatsApp Delays', description: 'Message delivery delays on WhatsApp channel due to upstream provider issues.', status: 'resolved', duration: '45 min' },
];

const statusColors: Record<string, { bg: string; text: string; icon: typeof CheckCircle }> = {
  operational: { bg: 'bg-green-500/10', text: 'text-green-500', icon: CheckCircle },
  degraded: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', icon: AlertTriangle },
  outage: { bg: 'bg-red-500/10', text: 'text-red-500', icon: AlertTriangle },
  resolved: { bg: 'bg-green-500/10', text: 'text-green-500', icon: CheckCircle },
};

export default function StatusPage() {
  const allOperational = services.every(s => s.status === 'operational');

  return (
    <main className="min-h-screen bg-white dark:bg-dark-950">
      <Navbar />
      
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-purple/5" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6">
              <Activity className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-500">System Status</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">Service <span className="gradient-text">Status</span></h1>
            
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className={`inline-flex items-center space-x-3 px-6 py-4 rounded-2xl ${allOperational ? 'bg-green-500/10 border border-green-500/20' : 'bg-yellow-500/10 border border-yellow-500/20'}`}>
              <CheckCircle className={`w-6 h-6 ${allOperational ? 'text-green-500' : 'text-yellow-500'}`} />
              <span className={`text-lg font-semibold ${allOperational ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                {allOperational ? 'All Systems Operational' : 'Some Systems Degraded'}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Current Status</h2>
          <div className="space-y-3">
            {services.map((service, index) => (
              <motion.div key={service.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-lg flex items-center justify-center">
                    <service.icon className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{service.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-white/40">Uptime: {service.uptime}</p>
                  </div>
                </div>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusColors[service.status].bg}`}>
                  <CheckCircle className={`w-4 h-4 ${statusColors[service.status].text}`} />
                  <span className={`text-sm font-medium capitalize ${statusColors[service.status].text}`}>{service.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-dark-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Incidents</h2>
          <div className="space-y-4">
            {incidents.map((incident, index) => (
              <motion.div key={incident.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-white/5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{incident.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-white/40 flex items-center space-x-2">
                      <Clock className="w-3 h-3" />
                      <span>{incident.date} · Duration: {incident.duration}</span>
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[incident.status].bg} ${statusColors[incident.status].text}`}>
                    {incident.status}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-white/60">{incident.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
