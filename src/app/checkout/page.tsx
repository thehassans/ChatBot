'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Lock, Check, Loader2, Building2 } from 'lucide-react';
import { Navbar, Footer } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const paymentMethods = [
  { id: 'stripe', name: 'Credit Card', icon: '💳', description: 'Pay securely with Stripe' },
  { id: 'paypal', name: 'PayPal', icon: '🅿️', description: 'Pay with your PayPal account' },
  { id: 'manual', name: 'Bank Transfer', icon: '🏦', description: 'Manual payment via bank transfer' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, user } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('manual');
  const [enabledPayments, setEnabledPayments] = useState<string[]>(['manual']);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    phone: '',
    company: '',
  });

  useEffect(() => {
    const fetchPaymentSettings = async () => {
      try {
        const res = await fetch('/api/settings/payment');
        if (res.ok) {
          const data = await res.json();
          if (data.enabledProviders?.length > 0) {
            setEnabledPayments(data.enabledProviders);
            setSelectedPayment(data.enabledProviders[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch payment settings');
      }
    };
    fetchPaymentSettings();
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!formData.name || !formData.email || (!user && !formData.password)) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          paymentMethod: selectedPayment,
          items: cart.map(item => ({
            serviceId: item.serviceId,
            serviceName: item.serviceName,
            price: item.price,
            channels: item.channels,
          })),
          subtotal,
          tax,
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      clearCart();
      toast.success('Order placed successfully! Please wait for admin approval.');
      router.push('/order-success?orderId=' + data.orderId);
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-20 min-h-screen">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h1>
            <p className="text-gray-600 dark:text-white/60 mb-8">Add some services to proceed with checkout.</p>
            <Link href="/#services">
              <Button>Browse Services</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Checkout Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white dark:bg-dark-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {user ? 'Contact Information' : 'Create Your Account'}
                  </h2>
                  
                  <div className="space-y-4">
                    <Input
                      label="Full Name *"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                    <Input
                      label="Email Address *"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      disabled={!!user}
                    />
                    {!user && (
                      <Input
                        label="Password *"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        required
                      />
                    )}
                    <Input
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                    />
                    <Input
                      label="Company Name"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company"
                    />
                  </div>
                </div>

                <div className="bg-white dark:bg-dark-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-gray-700 dark:text-white" />
                    Payment Method
                  </h2>
                  
                  <div className="space-y-3">
                    {paymentMethods
                      .filter(method => enabledPayments.includes(method.id))
                      .map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedPayment === method.id
                              ? 'border-primary-500 bg-primary-500/5'
                              : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={selectedPayment === method.id}
                            onChange={(e) => setSelectedPayment(e.target.value)}
                            className="sr-only"
                          />
                          <span className="text-2xl mr-4">{method.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white">{method.name}</div>
                            <div className="text-sm text-gray-500 dark:text-white/50">{method.description}</div>
                          </div>
                          {selectedPayment === method.id && (
                            <Check className="w-5 h-5 text-primary-500" />
                          )}
                        </label>
                      ))}
                  </div>

                  {selectedPayment === 'manual' && (
                    <div className="mt-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4">
                      <p className="text-amber-800 dark:text-amber-200 text-sm">
                        <strong>Note:</strong> You will receive payment instructions via email after order confirmation. Payment must be completed within 48 hours.
                      </p>
                    </div>
                  )}

                  {selectedPayment === 'stripe' && (
                    <div className="mt-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4">
                      <p className="text-blue-800 dark:text-blue-200 text-sm">
                        <strong>Secure Payment:</strong> You will be redirected to Stripe's secure checkout after placing your order.
                      </p>
                    </div>
                  )}

                  {selectedPayment === 'paypal' && (
                    <div className="mt-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4">
                      <p className="text-blue-800 dark:text-blue-200 text-sm">
                        <strong>PayPal:</strong> You will be redirected to PayPal to complete your payment securely.
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Place Order - {formatPrice(total)}
                </Button>

                <p className="text-center text-gray-500 dark:text-white/40 text-sm">
                  By placing this order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-white dark:bg-dark-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 sticky top-32 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.serviceId} className="flex items-start justify-between py-4 border-b border-gray-200 dark:border-white/10 last:border-0">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{item.serviceName}</h3>
                        <p className="text-sm text-gray-500 dark:text-white/50">
                          {item.channels.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}
                        </p>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{formatPrice(item.price)}/mo</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-white/10">
                  <div className="flex justify-between text-gray-600 dark:text-white/70">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-white/70">
                    <span>Tax (10%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-white/10">
                    <span>Total</span>
                    <span>{formatPrice(total)}/month</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-500 dark:text-white/50">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    30-day money-back guarantee
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-white/50">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Cancel anytime
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-white/50">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    24/7 customer support
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
