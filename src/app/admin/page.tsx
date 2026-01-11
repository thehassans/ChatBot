'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Users, ShoppingCart, MessageSquare, Settings, 
  Check, X, Clock, TrendingUp, Zap, LogOut, Sun, Moon, Loader2, Wifi, CreditCard, DollarSign
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { formatPrice, formatDate } from '@/lib/utils';
import { useTheme } from '@/lib/theme';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const handleTestConnection = async () => {
    if (!settings?.geminiApiKey) {
      toast.error('Please enter an API key first');
      return;
    }
    
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const response = await fetch('/api/admin/test-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: settings.geminiApiKey }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTestResult({ success: true, message: 'Connection successful!' });
        toast.success('Gemini API connection successful!');
      } else {
        setTestResult({ success: false, message: data.error || 'Connection failed' });
        toast.error(data.error || 'Connection failed');
      }
    } catch (error: any) {
      setTestResult({ success: false, message: 'Connection failed' });
      toast.error('Failed to test connection');
    } finally {
      setIsTesting(false);
    }
  };

  const checkAdminAuth = async () => {
    try {
      const response = await fetch('/api/auth/admin/verify');
      if (!response.ok) {
        router.push('/admin/login');
        return;
      }
      setIsAuthenticated(true);
      fetchData();
    } catch (error) {
      router.push('/admin/login');
    }
  };

  const fetchData = async () => {
    try {
      const [ordersRes, settingsRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/settings'),
      ]);
      
      const ordersData = await ordersRes.json();
      const settingsData = await settingsRes.json();
      
      setOrders(ordersData.orders || []);
      setSettings(settingsData.settings || {});
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderAction = async (orderId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
      
      if (!response.ok) throw new Error('Failed to update order');
      
      toast.success(`Order ${status}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) throw new Error('Failed to save settings');
      
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'primary' },
    { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, icon: Clock, color: 'yellow' },
    { label: 'Approved', value: orders.filter(o => o.status === 'approved').length, icon: Check, color: 'green' },
    { label: 'Revenue', value: formatPrice(orders.filter(o => o.status === 'approved').reduce((s, o) => s + o.total, 0)), icon: TrendingUp, color: 'purple' },
  ];

  const tabs = [
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'payments', label: 'Payment Settings', icon: CreditCard },
    { id: 'settings', label: 'API Settings', icon: Settings },
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 transition-colors">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-white/10 p-6 transition-colors">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-gray-900 dark:text-white">Magnetic Nobot</span>
            <p className="text-xs text-gray-500 dark:text-white/50">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary-500/20 text-primary-600 dark:text-primary-300' 
                  : 'text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
          <button
            onClick={async () => { 
              await fetch('/api/auth/admin/logout', { method: 'POST' });
              router.push('/admin/login'); 
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {activeTab === 'orders' ? 'Order Management' : activeTab === 'payments' ? 'Payment Settings' : 'API Settings'}
          </h1>
          <p className="text-gray-600 dark:text-white/60">
            {activeTab === 'orders' 
              ? 'Approve or reject customer orders' 
              : activeTab === 'payments'
              ? 'Configure payment providers and pricing'
              : 'Configure API keys and bot settings'}
          </p>
        </div>

        {/* Stats */}
        {activeTab === 'orders' && (
          <div className="grid grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-dark-900/50 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-6 h-6 text-${stat.color}-500 dark:text-${stat.color}-400`} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-gray-500 dark:text-white/50 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-dark-900/50 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-transparent">
                <tr className="text-left text-gray-500 dark:text-white/50 text-sm">
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Services</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900 dark:text-white">{order.userId?.name}</p>
                      <p className="text-gray-500 dark:text-white/50 text-sm">{order.userId?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      {order.items?.map((item: any) => (
                        <span key={item.serviceId} className="inline-block px-2 py-1 bg-gray-100 dark:bg-white/5 rounded text-xs text-gray-600 dark:text-white/70 mr-1">
                          {item.serviceName}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'approved' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300' :
                        order.status === 'rejected' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300' :
                        'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-white/50">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4">
                      {order.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOrderAction(order._id, 'approved')}
                            className="p-2 bg-green-100 dark:bg-green-500/20 hover:bg-green-200 dark:hover:bg-green-500/30 rounded-lg transition-colors"
                          >
                            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </button>
                          <button
                            onClick={() => handleOrderAction(order._id, 'rejected')}
                            className="p-2 bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Payment Settings Tab */}
        {activeTab === 'payments' && settings && (
          <div className="space-y-8">
            {/* Payment Providers */}
            <div className="bg-white dark:bg-dark-900/50 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Providers
              </h2>
              
              <div className="space-y-6">
                {/* Stripe */}
                <div className="border border-gray-200 dark:border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💳</span>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Stripe</h3>
                        <p className="text-sm text-gray-500 dark:text-white/50">Accept credit card payments</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.paymentConfig?.stripe?.enabled || false}
                        onChange={(e) => setSettings({
                          ...settings,
                          paymentConfig: {
                            ...settings.paymentConfig,
                            stripe: { ...settings.paymentConfig?.stripe, enabled: e.target.checked }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                  {settings.paymentConfig?.stripe?.enabled && (
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-white/10">
                      <Input
                        label="Publishable Key"
                        value={settings.paymentConfig?.stripe?.publicKey || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          paymentConfig: {
                            ...settings.paymentConfig,
                            stripe: { ...settings.paymentConfig?.stripe, publicKey: e.target.value }
                          }
                        })}
                        placeholder="pk_live_..."
                      />
                      <Input
                        label="Secret Key"
                        type="password"
                        value={settings.paymentConfig?.stripe?.secretKey || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          paymentConfig: {
                            ...settings.paymentConfig,
                            stripe: { ...settings.paymentConfig?.stripe, secretKey: e.target.value }
                          }
                        })}
                        placeholder="sk_live_..."
                      />
                      <Input
                        label="Webhook Secret"
                        type="password"
                        value={settings.paymentConfig?.stripe?.webhookSecret || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          paymentConfig: {
                            ...settings.paymentConfig,
                            stripe: { ...settings.paymentConfig?.stripe, webhookSecret: e.target.value }
                          }
                        })}
                        placeholder="whsec_..."
                      />
                    </div>
                  )}
                </div>

                {/* PayPal */}
                <div className="border border-gray-200 dark:border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🅿️</span>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">PayPal</h3>
                        <p className="text-sm text-gray-500 dark:text-white/50">Accept PayPal payments</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.paymentConfig?.paypal?.enabled || false}
                        onChange={(e) => setSettings({
                          ...settings,
                          paymentConfig: {
                            ...settings.paymentConfig,
                            paypal: { ...settings.paymentConfig?.paypal, enabled: e.target.checked }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                  {settings.paymentConfig?.paypal?.enabled && (
                    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/10">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Client ID"
                          value={settings.paymentConfig?.paypal?.clientId || ''}
                          onChange={(e) => setSettings({
                            ...settings,
                            paymentConfig: {
                              ...settings.paymentConfig,
                              paypal: { ...settings.paymentConfig?.paypal, clientId: e.target.value }
                            }
                          })}
                          placeholder="Your PayPal Client ID"
                        />
                        <Input
                          label="Client Secret"
                          type="password"
                          value={settings.paymentConfig?.paypal?.clientSecret || ''}
                          onChange={(e) => setSettings({
                            ...settings,
                            paymentConfig: {
                              ...settings.paymentConfig,
                              paypal: { ...settings.paymentConfig?.paypal, clientSecret: e.target.value }
                            }
                          })}
                          placeholder="Your PayPal Client Secret"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Mode</label>
                        <select
                          value={settings.paymentConfig?.paypal?.mode || 'sandbox'}
                          onChange={(e) => setSettings({
                            ...settings,
                            paymentConfig: {
                              ...settings.paymentConfig,
                              paypal: { ...settings.paymentConfig?.paypal, mode: e.target.value }
                            }
                          })}
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500"
                        >
                          <option value="sandbox">Sandbox (Testing)</option>
                          <option value="live">Live (Production)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Manual Payment */}
                <div className="border border-gray-200 dark:border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🏦</span>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Bank Transfer / Manual</h3>
                        <p className="text-sm text-gray-500 dark:text-white/50">Accept manual payments</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.paymentConfig?.manualPayment?.enabled !== false}
                        onChange={(e) => setSettings({
                          ...settings,
                          paymentConfig: {
                            ...settings.paymentConfig,
                            manualPayment: { ...settings.paymentConfig?.manualPayment, enabled: e.target.checked }
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                  {settings.paymentConfig?.manualPayment?.enabled !== false && (
                    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/10">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Payment Instructions</label>
                        <textarea
                          value={settings.paymentConfig?.manualPayment?.instructions || ''}
                          onChange={(e) => setSettings({
                            ...settings,
                            paymentConfig: {
                              ...settings.paymentConfig,
                              manualPayment: { ...settings.paymentConfig?.manualPayment, instructions: e.target.value }
                            }
                          })}
                          rows={3}
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500"
                          placeholder="Instructions shown to customers..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Bank Details</label>
                        <textarea
                          value={settings.paymentConfig?.manualPayment?.bankDetails || ''}
                          onChange={(e) => setSettings({
                            ...settings,
                            paymentConfig: {
                              ...settings.paymentConfig,
                              manualPayment: { ...settings.paymentConfig?.manualPayment, bankDetails: e.target.value }
                            }
                          })}
                          rows={3}
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500"
                          placeholder="Bank name, account number, routing number..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing Settings */}
            <div className="bg-white dark:bg-dark-900/50 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Pricing Settings
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Currency</label>
                  <select
                    value={settings.paymentConfig?.currency || 'USD'}
                    onChange={(e) => setSettings({
                      ...settings,
                      paymentConfig: { ...settings.paymentConfig, currency: e.target.value }
                    })}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                    <option value="PKR">PKR - Pakistani Rupee</option>
                  </select>
                </div>
                <Input
                  label="Tax Rate (%)"
                  type="number"
                  value={settings.paymentConfig?.taxRate || 10}
                  onChange={(e) => setSettings({
                    ...settings,
                    paymentConfig: { ...settings.paymentConfig, taxRate: parseFloat(e.target.value) }
                  })}
                  placeholder="10"
                />
              </div>
            </div>

            <Button onClick={handleSaveSettings}>Save Payment Settings</Button>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && settings && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-dark-900/50 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Gemini AI Configuration</h2>
              <div className="space-y-4">
                <Input
                  label="Gemini API Key"
                  type="password"
                  value={settings.geminiApiKey || ''}
                  onChange={(e) => { setSettings({ ...settings, geminiApiKey: e.target.value }); setTestResult(null); }}
                  placeholder="Enter your Gemini API key"
                />
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-xl text-gray-700 dark:text-white transition-colors disabled:opacity-50"
                  >
                    {isTesting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Wifi className="w-4 h-4" />
                    )}
                    <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                  </button>
                  {testResult && (
                    <span className={`flex items-center space-x-1 text-sm ${testResult.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {testResult.success ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      <span>{testResult.message}</span>
                    </span>
                  )}
                </div>
                <p className="text-gray-500 dark:text-white/40 text-sm">
                  Get your API key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Google AI Studio</a>. This is used for AI-powered bot responses.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-900/50 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Global Bot Settings</h2>
              <div className="grid grid-cols-2 gap-6">
                <Input
                  label="Default Reply Delay (ms)"
                  type="number"
                  value={settings.globalBotSettings?.defaultReplyDelay || 1500}
                  onChange={(e) => setSettings({
                    ...settings,
                    globalBotSettings: { ...settings.globalBotSettings, defaultReplyDelay: parseInt(e.target.value) }
                  })}
                />
                <Input
                  label="Typing Duration (ms)"
                  type="number"
                  value={settings.globalBotSettings?.defaultTypingDuration || 2000}
                  onChange={(e) => setSettings({
                    ...settings,
                    globalBotSettings: { ...settings.globalBotSettings, defaultTypingDuration: parseInt(e.target.value) }
                  })}
                />
              </div>
            </div>

            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </div>
        )}
      </main>
    </div>
  );
}
