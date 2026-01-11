'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, MessageCircle, Facebook, MessageSquare } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui';
import { formatPrice } from '@/lib/utils';

const channelIcons: Record<string, any> = {
  whatsapp: MessageCircle,
  messenger: Facebook,
  widget: MessageSquare,
};

export default function Cart() {
  const { isCartOpen, setCartOpen, cart, removeFromCart, clearCart } = useStore();
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-dark-900 border-l border-gray-200 dark:border-white/10 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-5 h-5 text-primary-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Cart</h2>
                <span className="px-2 py-0.5 bg-primary-500/20 text-primary-300 text-xs rounded-full">
                  {cart.length}
                </span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-white/70" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-white/20 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 dark:text-white/50 text-sm mb-6">
                    Add some services to get started
                  </p>
                  <Button variant="secondary" onClick={() => setCartOpen(false)}>
                    Browse Services
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.serviceId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">{item.serviceName}</h3>
                        <button
                          onClick={() => removeFromCart(item.serviceId)}
                          className="p-1 hover:bg-red-500/20 rounded-lg transition-colors group"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 dark:text-white/50 group-hover:text-red-500" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        {item.channels.map((channel) => {
                          const Icon = channelIcons[channel] || MessageSquare;
                          return (
                            <span
                              key={channel}
                              className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-white/5 rounded-lg text-xs text-gray-600 dark:text-white/70"
                            >
                              <Icon className="w-3 h-3" />
                              <span className="capitalize">{channel}</span>
                            </span>
                          );
                        })}
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatPrice(item.price)}
                        </span>
                        <span className="text-gray-500 dark:text-white/50 text-sm">/month</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-200 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="text-gray-600 dark:text-white/70">Total</span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatPrice(total)}/month</span>
                </div>
                <Link href="/checkout" onClick={() => setCartOpen(false)}>
                  <Button className="w-full">
                    Proceed to Checkout
                  </Button>
                </Link>
                <button
                  onClick={clearCart}
                  className="w-full text-center text-sm text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}
