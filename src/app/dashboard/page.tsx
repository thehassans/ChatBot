'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Settings, MessageSquare, Inbox, FileText, Zap, LogOut,
  ChevronRight, Check, Clock, AlertCircle, Cog, Mail, Sun, Moon
} from 'lucide-react';
import { Button } from '@/components/ui';
import { WorkspaceManagePanel } from '@/components/WorkspaceManagePanel';
import { useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';
import toast from 'react-hot-toast';

export default function UserDashboard() {
  const router = useRouter();
  const { user, setUser, logout } = useStore();
  const { theme, toggleTheme } = useTheme();
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [managePanel, setManagePanel] = useState<{ open: boolean; workspaceId: string; workspaceName: string }>({ 
    open: false, 
    workspaceId: '', 
    workspaceName: '' 
  });

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
      if (data.user) {
        setUser(data.user);
      }
      fetchWorkspaces();
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch('/api/workspaces');
      const data = await response.json();
      setWorkspaces(data.workspaces || []);
    } catch (error) {
      toast.error('Failed to load workspaces');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (workspace: any) => {
    if (workspace.status === 'pending') {
      return { label: 'Pending Approval', color: 'yellow', icon: Clock };
    }
    if (!workspace.setupCompleted) {
      return { label: 'Setup Required', color: 'blue', icon: AlertCircle };
    }
    return { label: 'Active', color: 'green', icon: Check };
  };

  if (!user) return null;

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
            <p className="text-xs text-gray-500 dark:text-white/50">Dashboard</p>
          </div>
        </div>

        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-primary-500/20 text-primary-600 dark:text-primary-300"
          >
            <Inbox className="w-5 h-5" />
            <span>My Services</span>
          </Link>
          <Link
            href="/dashboard/inbox"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all"
          >
            <Mail className="w-5 h-5" />
            <span>Inbox</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <div className="px-4 py-3">
            <p className="text-gray-900 dark:text-white font-medium truncate">{user.name}</p>
            <p className="text-gray-500 dark:text-white/50 text-sm truncate">{user.email}</p>
          </div>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
          <button
            onClick={async () => { 
              await fetch('/api/auth/logout', { method: 'POST' });
              logout(); 
              router.push('/login'); 
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Services</h1>
          <p className="text-gray-600 dark:text-white/60">Manage your chatbot services and configurations</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
          </div>
        ) : workspaces.length === 0 ? (
          <div className="bg-white dark:bg-dark-900/50 border border-gray-200 dark:border-white/10 rounded-2xl p-12 text-center shadow-sm">
            <MessageSquare className="w-16 h-16 text-gray-300 dark:text-white/20 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No services yet</h2>
            <p className="text-gray-500 dark:text-white/50 mb-6">Your services will appear here once your order is approved.</p>
            <Link href="/#services">
              <Button>Browse Services</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {workspaces.map((workspace) => {
              const status = getStatusBadge(workspace);
              return (
                <motion.div
                  key={workspace._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-dark-900/50 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                        {workspace.businessName || workspace.name}
                      </h3>
                      <div className="flex items-center space-x-4">
                        <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-${status.color}-500/20 text-${status.color}-300`}>
                          <status.icon className="w-3 h-3" />
                          <span>{status.label}</span>
                        </span>
                        <span className="text-gray-500 dark:text-white/50 text-sm">
                          Channels: {workspace.allowedChannels?.join(', ')}
                        </span>
                      </div>
                    </div>
                    
                    {workspace.status === 'active' && (
                      <div className="flex items-center space-x-3">
                        {workspace.setupCompleted && (
                          <>
                            <Button 
                              variant="secondary"
                              onClick={() => setManagePanel({ 
                                open: true, 
                                workspaceId: workspace._id, 
                                workspaceName: workspace.businessName || workspace.name 
                              })}
                            >
                              <Cog className="w-4 h-4 mr-2" />
                              Manage
                            </Button>
                            <Link href={`/dashboard/inbox?workspace=${workspace._id}`}>
                              <Button>
                                <Mail className="w-4 h-4 mr-2" />
                                Open Inbox
                                <ChevronRight className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                          </>
                        )}
                        {!workspace.setupCompleted && (
                          <Link href={`/dashboard/workspace/${workspace._id}`}>
                            <Button>
                              Complete Setup
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>

                  {workspace.status === 'active' && !workspace.setupCompleted && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Setup Progress</h4>
                      <div className="flex items-center space-x-4">
                        {[
                          { step: 1, label: 'Training Data' },
                          { step: 2, label: 'Connect Channels' },
                          { step: 3, label: 'Business Info' },
                        ].map((item) => (
                          <div
                            key={item.step}
                            className={`flex items-center space-x-2 ${
                              workspace.setupStep > item.step
                                ? 'text-green-500 dark:text-green-400'
                                : workspace.setupStep === item.step
                                ? 'text-primary-500 dark:text-primary-400'
                                : 'text-gray-400 dark:text-white/30'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                              workspace.setupStep > item.step
                                ? 'bg-green-100 dark:bg-green-500/20'
                                : workspace.setupStep === item.step
                                ? 'bg-primary-100 dark:bg-primary-500/20'
                                : 'bg-gray-100 dark:bg-white/5'
                            }`}>
                              {workspace.setupStep > item.step ? <Check className="w-3 h-3" /> : item.step}
                            </div>
                            <span className="text-sm">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Workspace Manage Panel */}
      <WorkspaceManagePanel
        isOpen={managePanel.open}
        onClose={() => setManagePanel({ open: false, workspaceId: '', workspaceName: '' })}
        workspaceId={managePanel.workspaceId}
        workspaceName={managePanel.workspaceName}
      />
    </div>
  );
}
