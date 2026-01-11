'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  User, Bell, Shield, Palette, Zap, Inbox as InboxIcon,
  Save, Loader2, Check, Moon, Sun, LogOut,
  Mail, Phone, Building2, Key, Eye, EyeOff, Settings
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useTheme } from '@/lib/theme';
import { useStore } from '@/lib/store';
import toast from 'react-hot-toast';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  company: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  newConversation: boolean;
  newMessage: boolean;
  dailyDigest: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    company: '',
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    newConversation: true,
    newMessage: true,
    dailyDigest: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      setProfile({
        name: data.user.name || '',
        email: data.user.email || '',
        phone: data.user.phone || '',
        company: data.user.company || '',
      });
      setIsLoading(false);
    } catch (error) {
      router.push('/login');
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!response.ok) throw new Error('Failed to save');
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to change password');
      }

      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifications),
      });

      if (!response.ok) throw new Error('Failed to save');
      toast.success('Notification settings saved!');
    } catch (error) {
      toast.error('Failed to save notification settings');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* Dashboard Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-dark-900 border-r border-white/10 p-6 z-50">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-white">Magnetic Nobot</span>
            <p className="text-xs text-white/50">Dashboard</p>
          </div>
        </div>

        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all"
          >
            <InboxIcon className="w-5 h-5" />
            <span>My Services</span>
          </Link>
          <Link
            href="/dashboard/inbox"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all"
          >
            <Mail className="w-5 h-5" />
            <span>Inbox</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-primary-500/20 text-primary-300"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="px-4 py-3 mb-4">
            <p className="text-white font-medium truncate">{user?.name || profile.name}</p>
            <p className="text-white/50 text-sm truncate">{user?.email || profile.email}</p>
          </div>
          <button
            onClick={async () => { 
              await fetch('/api/auth/logout', { method: 'POST' });
              logout(); 
              router.push('/login'); 
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64">
        {/* Header */}
        <header className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-white/10 px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-white/60">Manage your account and preferences</p>
        </header>

        <div className="p-8">
          <div className="flex gap-8">
            {/* Settings Tabs Sidebar */}
            <div className="w-56 flex-shrink-0">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-dark-900 rounded-2xl border border-gray-200 dark:border-white/10 p-6"
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h2>
                  <div className="space-y-6">
                    <Input
                      label="Full Name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      icon={<User className="w-5 h-5" />}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      icon={<Mail className="w-5 h-5" />}
                    />
                    <Input
                      label="Phone Number"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      icon={<Phone className="w-5 h-5" />}
                    />
                    <Input
                      label="Company"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      icon={<Building2 className="w-5 h-5" />}
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleSaveProfile} disabled={isSaving}>
                        {isSaving ? (
                          <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</>
                        ) : (
                          <><Save className="w-4 h-4 mr-2" /> Save Changes</>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
                  <div className="space-y-6">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                      { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
                      { key: 'newConversation', label: 'New Conversations', desc: 'Alert when a new conversation starts' },
                      { key: 'newMessage', label: 'New Messages', desc: 'Alert for incoming messages' },
                      { key: 'dailyDigest', label: 'Daily Digest', desc: 'Daily summary of activity' },
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/10 last:border-0">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{setting.label}</h3>
                          <p className="text-sm text-gray-500 dark:text-white/50">{setting.desc}</p>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, [setting.key]: !notifications[setting.key as keyof NotificationSettings] })}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            notifications[setting.key as keyof NotificationSettings]
                              ? 'bg-primary-500'
                              : 'bg-gray-300 dark:bg-white/20'
                          }`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              notifications[setting.key as keyof NotificationSettings] ? 'translate-x-6' : ''
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                    <div className="flex justify-end pt-4">
                      <Button onClick={handleSaveNotifications} disabled={isSaving}>
                        {isSaving ? (
                          <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</>
                        ) : (
                          <><Save className="w-4 h-4 mr-2" /> Save Preferences</>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Security Settings</h2>
                  <div className="space-y-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Change Password</h3>
                    <div className="relative">
                      <Input
                        label="Current Password"
                        type={showPasswords ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        icon={<Key className="w-5 h-5" />}
                      />
                    </div>
                    <Input
                      label="New Password"
                      type={showPasswords ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      icon={<Key className="w-5 h-5" />}
                    />
                    <Input
                      label="Confirm New Password"
                      type={showPasswords ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      icon={<Key className="w-5 h-5" />}
                    />
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70"
                      >
                        {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        <span>{showPasswords ? 'Hide' : 'Show'} passwords</span>
                      </button>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleChangePassword} disabled={isSaving}>
                        {isSaving ? (
                          <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Changing...</>
                        ) : (
                          <><Shield className="w-4 h-4 mr-2" /> Change Password</>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Appearance</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-4">Theme</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setTheme('light')}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            theme === 'light'
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                              : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                              <Sun className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-gray-900 dark:text-white">Light</p>
                              <p className="text-sm text-gray-500 dark:text-white/50">Clean and bright</p>
                            </div>
                          </div>
                          {theme === 'light' && (
                            <div className="mt-3 flex items-center text-primary-500">
                              <Check className="w-4 h-4 mr-1" />
                              <span className="text-sm">Active</span>
                            </div>
                          )}
                        </button>
                        <button
                          onClick={() => setTheme('dark')}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            theme === 'dark'
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                              : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center">
                              <Moon className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-gray-900 dark:text-white">Dark</p>
                              <p className="text-sm text-gray-500 dark:text-white/50">Easy on the eyes</p>
                            </div>
                          </div>
                          {theme === 'dark' && (
                            <div className="mt-3 flex items-center text-primary-500">
                              <Check className="w-4 h-4 mr-1" />
                              <span className="text-sm">Active</span>
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
