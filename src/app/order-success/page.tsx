'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-dark-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            Order Placed Successfully!
          </h1>

          <p className="text-white/60 mb-6">
            Thank you for your order. Your account has been created and your order is now pending admin approval.
          </p>

          {orderId && (
            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <p className="text-sm text-white/50 mb-1">Order ID</p>
              <p className="text-lg font-mono text-white">{orderId}</p>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div className="flex items-start space-x-3 text-left">
              <Clock className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">Pending Approval</p>
                <p className="text-white/50 text-sm">Our team will review and approve your order within 24 hours.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-left">
              <Mail className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">Check Your Email</p>
                <p className="text-white/50 text-sm">You will receive a confirmation email with your login details.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/login" className="block">
              <Button className="w-full">
                Go to Login
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="secondary" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
