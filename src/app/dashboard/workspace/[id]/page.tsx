'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, Check, Globe, FileText, 
  MessageSquare, Building2, Zap, Loader2, Upload, Settings,
  RefreshCw, Trash2, ExternalLink, Code, Copy, Palette
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { ChannelConnectModal } from '@/components/ChannelConnectModal';
import { useStore } from '@/lib/store';
import toast from 'react-hot-toast';

const steps = [
  { id: 1, title: 'Training Data', description: 'Teach your AI bot about your business', icon: FileText },
  { id: 2, title: 'Connect Channels', description: 'Link your messaging platforms', icon: MessageSquare },
  { id: 3, title: 'Business Info', description: 'Configure your business details', icon: Building2 },
];

const manageTabs = [
  { id: 'training', title: 'Training Data', icon: FileText },
  { id: 'channels', title: 'Channels', icon: MessageSquare },
  { id: 'widget', title: 'Website Widget', icon: Code },
  { id: 'settings', title: 'Bot Settings', icon: Settings },
];

export default function WorkspaceSetupPage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.id as string;
  const { user } = useStore();
  
  const [workspace, setWorkspace] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeManageTab, setActiveManageTab] = useState('training');
  const [isRetraining, setIsRetraining] = useState(false);

  // Training data state
  const [trainingType, setTrainingType] = useState<'url' | 'text' | 'file'>('url');
  const [trainingUrl, setTrainingUrl] = useState('');
  const [trainingText, setTrainingText] = useState('');

  // Channel connection state
  const [connectedChannels, setConnectedChannels] = useState<string[]>([]);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [connectingChannel, setConnectingChannel] = useState<'whatsapp' | 'messenger'>('whatsapp');

  // Business info state
  const [businessInfo, setBusinessInfo] = useState({
    businessName: '',
    supportEmail: '',
    timezone: 'UTC',
    welcomeMessage: 'Hi! How can I help you today?',
  });

  useEffect(() => {
    checkAuthAndFetch();
  }, [workspaceId]);

  const checkAuthAndFetch = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      fetchWorkspace();
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchWorkspace = async () => {
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}`);
      if (!response.ok) throw new Error('Workspace not found');
      const data = await response.json();
      setWorkspace(data.workspace);
      setCurrentStep(data.workspace.setupStep || 1);
      
      // Load business info
      if (data.workspace.businessName) {
        setBusinessInfo(prev => ({ 
          ...prev, 
          businessName: data.workspace.businessName,
          supportEmail: data.workspace.supportEmail || '',
          welcomeMessage: data.workspace.botSettings?.welcomeMessage || 'Hi! How can I help you today?',
        }));
      }
      
      // Load training data if exists
      if (data.workspace.trainingData?.url) {
        setTrainingUrl(data.workspace.trainingData.url);
        setTrainingType('url');
      } else if (data.workspace.trainingData?.rawContent) {
        setTrainingText(data.workspace.trainingData.rawContent);
        setTrainingType('text');
      }
      
      // Load connected channels from workspace data
      const connected: string[] = [];
      if (data.workspace.channels?.whatsapp?.connected) connected.push('whatsapp');
      if (data.workspace.channels?.messenger?.connected) connected.push('messenger');
      if (data.workspace.channels?.widget?.connected) connected.push('widget');
      setConnectedChannels(connected);
    } catch (error) {
      toast.error('Failed to load workspace');
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetrain = async () => {
    if (trainingType === 'url' && !trainingUrl.trim()) {
      toast.error('Please enter a website URL');
      return;
    }
    if (trainingType === 'text' && !trainingText.trim()) {
      toast.error('Please enter training content');
      return;
    }

    setIsRetraining(true);
    try {
      const payload: any = { type: trainingType };
      if (trainingType === 'url') payload.url = trainingUrl.trim();
      if (trainingType === 'text') payload.content = trainingText.trim();

      const response = await fetch(`/api/workspaces/${workspaceId}/training`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Training failed');
      }
      
      toast.success('Training data updated successfully!');
      fetchWorkspace(); // Reload workspace data
    } catch (error: any) {
      toast.error(error.message || 'Failed to update training data');
    } finally {
      setIsRetraining(false);
    }
  };

  const handleUpdateBusinessInfo = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: businessInfo.businessName,
          supportEmail: businessInfo.supportEmail,
          botSettings: {
            welcomeMessage: businessInfo.welcomeMessage,
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to save');
      toast.success('Settings updated successfully!');
      fetchWorkspace();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTrainingSubmit = async () => {
    // Validate input
    if (trainingType === 'url' && !trainingUrl.trim()) {
      toast.error('Please enter a website URL');
      return;
    }
    if (trainingType === 'text' && !trainingText.trim()) {
      toast.error('Please enter training content');
      return;
    }

    setIsSaving(true);
    try {
      const payload: any = { type: trainingType };
      if (trainingType === 'url') payload.url = trainingUrl.trim();
      if (trainingType === 'text') payload.content = trainingText.trim();

      const response = await fetch(`/api/workspaces/${workspaceId}/training`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Training failed');
      }
      
      toast.success(data.message || 'Training data processed successfully!');
      await updateSetupStep(2);
      setCurrentStep(2);
    } catch (error: any) {
      toast.error(error.message || 'Failed to process training data');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChannelConnect = (channel: 'whatsapp' | 'messenger') => {
    if (connectedChannels.includes(channel)) {
      // Disconnect
      handleChannelDisconnect(channel);
    } else {
      // Open connection modal
      setConnectingChannel(channel);
      setConnectModalOpen(true);
    }
  };

  const handleChannelDisconnect = async (channel: string) => {
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/channels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, action: 'disconnect' }),
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect');
      }

      setConnectedChannels(prev => prev.filter(c => c !== channel));
      toast.success(`${channel} disconnected`);
    } catch (error) {
      toast.error('Failed to disconnect channel');
    }
  };

  const handleChannelConnectSuccess = (channel: string) => {
    setConnectedChannels(prev => [...prev, channel]);
    toast.success(`${channel} connected successfully!`);
  };

  const handleContinueFromChannels = async () => {
    await updateSetupStep(3);
    setCurrentStep(3);
  };

  const handleBusinessInfoSubmit = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...businessInfo,
          setupStep: 4,
          setupCompleted: true,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');
      
      toast.success('Setup complete! Your workspace is ready.');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save business info');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetupStep = async (step: number) => {
    await fetch(`/api/workspaces/${workspaceId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ setupStep: step }),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!workspace) return null;

  // Management View for completed workspaces
  if (workspace.setupCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-white/10 bg-white dark:bg-dark-900/50 backdrop-blur-xl">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-white/20" />
              <div>
                <h1 className="font-bold text-gray-900 dark:text-white">{workspace.businessName || workspace.name}</h1>
                <p className="text-sm text-gray-500 dark:text-white/50">Manage your workspace settings</p>
              </div>
            </div>
            <Link href={`/dashboard/inbox?workspace=${workspaceId}`}>
              <Button variant="secondary">
                <MessageSquare className="w-4 h-4 mr-2" />
                Open Inbox
              </Button>
            </Link>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex gap-8">
            {/* Sidebar Tabs */}
            <div className="w-64 flex-shrink-0">
              <nav className="space-y-1">
                {manageTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveManageTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                      activeManageTab === tab.id
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.title}</span>
                  </button>
                ))}
              </nav>

              {/* Training Status */}
              {workspace.trainingData?.status && (
                <div className="mt-6 p-4 bg-gray-100 dark:bg-white/5 rounded-xl">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Training Status</p>
                  <div className={`flex items-center space-x-2 text-sm ${
                    workspace.trainingData.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                    workspace.trainingData.status === 'processing' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-gray-500 dark:text-white/50'
                  }`}>
                    {workspace.trainingData.status === 'completed' && <Check className="w-4 h-4" />}
                    {workspace.trainingData.status === 'processing' && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span className="capitalize">{workspace.trainingData.status}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              <motion.div
                key={activeManageTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-dark-900 rounded-2xl border border-gray-200 dark:border-white/10 p-6"
              >
                {/* Training Tab */}
                {activeManageTab === 'training' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Training Data</h2>
                    <p className="text-gray-600 dark:text-white/60 mb-6">
                      Update your AI bot's knowledge base by retraining with new content.
                    </p>

                    <div className="flex space-x-4 mb-6">
                      {[
                        { id: 'url', label: 'Website URL', icon: Globe },
                        { id: 'text', label: 'Text Content', icon: FileText },
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setTrainingType(type.id as 'url' | 'text')}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                            trainingType === type.id
                              ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-300'
                              : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:border-gray-300 dark:hover:border-white/20'
                          }`}
                        >
                          <type.icon className="w-5 h-5" />
                          <span>{type.label}</span>
                        </button>
                      ))}
                    </div>

                    {trainingType === 'url' && (
                      <Input
                        label="Website URL"
                        type="url"
                        value={trainingUrl}
                        onChange={(e) => setTrainingUrl(e.target.value)}
                        placeholder="https://yourwebsite.com"
                      />
                    )}

                    {trainingType === 'text' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                          Training Content
                        </label>
                        <textarea
                          value={trainingText}
                          onChange={(e) => setTrainingText(e.target.value)}
                          rows={8}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:border-primary-500/50 transition-colors resize-none"
                          placeholder="Paste your FAQ, product information, company policies..."
                        />
                      </div>
                    )}

                    <div className="mt-6 flex justify-end">
                      <Button onClick={handleRetrain} disabled={isRetraining}>
                        {isRetraining ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Retraining...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retrain Bot
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Channels Tab */}
                {activeManageTab === 'channels' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Connected Channels</h2>
                    <p className="text-gray-600 dark:text-white/60 mb-6">
                      Manage your messaging platform connections.
                    </p>

                    <div className="space-y-4">
                      {/* WhatsApp */}
                      {workspace.allowedChannels?.includes('whatsapp') && (
                        <div className={`p-6 border rounded-xl transition-colors ${
                          connectedChannels.includes('whatsapp') 
                            ? 'border-green-500 bg-green-500/10' 
                            : 'border-gray-200 dark:border-white/10'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-green-500" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">WhatsApp Business</h3>
                                <p className="text-gray-500 dark:text-white/50 text-sm">
                                  {connectedChannels.includes('whatsapp') 
                                    ? (workspace.channels?.whatsapp?.config?.demoMode ? 'Connected (Demo Mode)' : 'Connected') 
                                    : 'Not connected'}
                                </p>
                              </div>
                            </div>
                            <Button 
                              variant={connectedChannels.includes('whatsapp') ? 'secondary' : 'primary'} 
                              size="sm"
                              onClick={() => {
                                if (connectedChannels.includes('whatsapp')) {
                                  handleChannelDisconnect('whatsapp');
                                } else {
                                  setConnectingChannel('whatsapp');
                                  setConnectModalOpen(true);
                                }
                              }}
                            >
                              {connectedChannels.includes('whatsapp') ? 'Disconnect' : 'Connect'}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Messenger */}
                      {workspace.allowedChannels?.includes('messenger') && (
                        <div className={`p-6 border rounded-xl transition-colors ${
                          connectedChannels.includes('messenger') 
                            ? 'border-blue-500 bg-blue-500/10' 
                            : 'border-gray-200 dark:border-white/10'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-blue-500" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Facebook Messenger</h3>
                                <p className="text-gray-500 dark:text-white/50 text-sm">
                                  {connectedChannels.includes('messenger') 
                                    ? (workspace.channels?.messenger?.config?.demoMode ? 'Connected (Demo Mode)' : 'Connected') 
                                    : 'Not connected'}
                                </p>
                              </div>
                            </div>
                            <Button 
                              variant={connectedChannels.includes('messenger') ? 'secondary' : 'primary'} 
                              size="sm"
                              onClick={() => {
                                if (connectedChannels.includes('messenger')) {
                                  handleChannelDisconnect('messenger');
                                } else {
                                  setConnectingChannel('messenger');
                                  setConnectModalOpen(true);
                                }
                              }}
                            >
                              {connectedChannels.includes('messenger') ? 'Disconnect' : 'Connect'}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Widget */}
                      {workspace.allowedChannels?.includes('widget') && (
                        <div className="p-6 border border-green-500 bg-green-500/10 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                <Globe className="w-6 h-6 text-purple-500" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Website Widget</h3>
                                <p className="text-gray-500 dark:text-white/50 text-sm">Always enabled</p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-green-500/20 text-green-600 dark:text-green-300 rounded-full text-sm flex items-center">
                              <Check className="w-4 h-4 mr-1" /> Active
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Widget Tab */}
                {activeManageTab === 'widget' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Website Widget</h2>
                    <p className="text-gray-600 dark:text-white/60 mb-6">
                      Add the chatbot widget to your website for customer support.
                    </p>

                    {/* Embed Code Section */}
                    <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                          <Code className="w-5 h-5 mr-2 text-primary-500" />
                          Embed Code
                        </h3>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            const embedCode = `<!-- Magnetic Nobot Chat Widget -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${typeof window !== 'undefined' ? window.location.origin : ''}/widget.js';
    script.async = true;
    script.onload = function() {
      MagneticNobot.init({
        workspaceId: '${workspaceId}',
        apiBaseUrl: '${typeof window !== 'undefined' ? window.location.origin : ''}',
        primaryColor: '${workspace?.widgetSettings?.primaryColor || '#6366f1'}',
        position: '${workspace?.widgetSettings?.position || 'right'}',
        greeting: '${workspace?.widgetSettings?.greeting || 'Hi there! How can we help you today?'}',
        agentName: '${workspace?.widgetSettings?.agentName || 'Support Agent'}',
        placeholder: '${workspace?.widgetSettings?.placeholder || 'Type your message...'}'
      });
    };
    document.head.appendChild(script);
  })();
</script>`;
                            navigator.clipboard.writeText(embedCode);
                            toast.success('Embed code copied to clipboard!');
                          }}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Code
                        </Button>
                      </div>
                      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`<!-- Magnetic Nobot Chat Widget -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${typeof window !== 'undefined' ? window.location.origin : ''}/widget.js';
    script.async = true;
    script.onload = function() {
      MagneticNobot.init({
        workspaceId: '${workspaceId}',
        apiBaseUrl: '${typeof window !== 'undefined' ? window.location.origin : ''}'
      });
    };
    document.head.appendChild(script);
  })();
</script>`}
                      </pre>
                      <p className="text-gray-500 dark:text-white/50 text-sm mt-4">
                        Add this code just before the closing <code className="bg-gray-200 dark:bg-white/10 px-1 rounded">&lt;/body&gt;</code> tag of your website.
                      </p>
                    </div>

                    {/* Widget Customization */}
                    <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white flex items-center mb-4">
                        <Palette className="w-5 h-5 mr-2 text-primary-500" />
                        Widget Customization
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                            Primary Color
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={workspace?.widgetSettings?.primaryColor || '#6366f1'}
                              onChange={async (e) => {
                                try {
                                  await fetch(`/api/workspaces/${workspaceId}`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      widgetSettings: {
                                        ...workspace?.widgetSettings,
                                        primaryColor: e.target.value,
                                      }
                                    }),
                                  });
                                  setWorkspace((prev: any) => ({
                                    ...prev,
                                    widgetSettings: { ...prev?.widgetSettings, primaryColor: e.target.value }
                                  }));
                                } catch (err) {
                                  toast.error('Failed to update color');
                                }
                              }}
                              className="w-12 h-10 rounded-lg border border-gray-300 dark:border-white/10 cursor-pointer"
                            />
                            <span className="text-gray-600 dark:text-white/60 text-sm">
                              {workspace?.widgetSettings?.primaryColor || '#6366f1'}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                            Position
                          </label>
                          <select
                            value={workspace?.widgetSettings?.position || 'right'}
                            onChange={async (e) => {
                              try {
                                await fetch(`/api/workspaces/${workspaceId}`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    widgetSettings: {
                                      ...workspace?.widgetSettings,
                                      position: e.target.value,
                                    }
                                  }),
                                });
                                setWorkspace((prev: any) => ({
                                  ...prev,
                                  widgetSettings: { ...prev?.widgetSettings, position: e.target.value }
                                }));
                                toast.success('Position updated');
                              } catch (err) {
                                toast.error('Failed to update position');
                              }
                            }}
                            className="w-full px-4 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-primary-500"
                          >
                            <option value="right">Bottom Right</option>
                            <option value="left">Bottom Left</option>
                          </select>
                        </div>
                      </div>

                      <Input
                        label="Agent Name"
                        value={workspace?.widgetSettings?.agentName || 'Support Agent'}
                        onChange={async (e) => {
                          setWorkspace((prev: any) => ({
                            ...prev,
                            widgetSettings: { ...prev?.widgetSettings, agentName: e.target.value }
                          }));
                        }}
                        onBlur={async (e) => {
                          try {
                            await fetch(`/api/workspaces/${workspaceId}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                widgetSettings: {
                                  ...workspace?.widgetSettings,
                                  agentName: e.target.value,
                                }
                              }),
                            });
                            toast.success('Agent name updated');
                          } catch (err) {
                            toast.error('Failed to update');
                          }
                        }}
                        placeholder="Support Agent"
                      />

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                          Greeting Message
                        </label>
                        <textarea
                          value={workspace?.widgetSettings?.greeting || 'Hi there! How can we help you today?'}
                          onChange={(e) => {
                            setWorkspace((prev: any) => ({
                              ...prev,
                              widgetSettings: { ...prev?.widgetSettings, greeting: e.target.value }
                            }));
                          }}
                          onBlur={async (e) => {
                            try {
                              await fetch(`/api/workspaces/${workspaceId}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  widgetSettings: {
                                    ...workspace?.widgetSettings,
                                    greeting: e.target.value,
                                  }
                                }),
                              });
                              toast.success('Greeting updated');
                            } catch (err) {
                              toast.error('Failed to update');
                            }
                          }}
                          rows={2}
                          className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:border-primary-500/50 transition-colors resize-none"
                          placeholder="The greeting message shown when widget opens..."
                        />
                      </div>
                    </div>

                    {/* Test Widget */}
                    <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                      <p className="text-primary-600 dark:text-primary-300 text-sm">
                        <strong>Tip:</strong> After adding the embed code to your website, refresh the page to see the chat widget appear in the corner. Your customers can then click it to start a conversation with your AI-powered support bot.
                      </p>
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeManageTab === 'settings' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Bot Settings</h2>
                    <p className="text-gray-600 dark:text-white/60 mb-6">
                      Configure your chatbot's behavior and responses.
                    </p>

                    <div className="space-y-6">
                      <Input
                        label="Business Name"
                        value={businessInfo.businessName}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, businessName: e.target.value })}
                        placeholder="Your Company Name"
                      />

                      <Input
                        label="Support Email"
                        type="email"
                        value={businessInfo.supportEmail}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, supportEmail: e.target.value })}
                        placeholder="support@yourcompany.com"
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                          Welcome Message
                        </label>
                        <textarea
                          value={businessInfo.welcomeMessage}
                          onChange={(e) => setBusinessInfo({ ...businessInfo, welcomeMessage: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:border-primary-500/50 transition-colors resize-none"
                          placeholder="The first message visitors will see..."
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button onClick={handleUpdateBusinessInfo} disabled={isSaving}>
                          {isSaving ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Save Settings
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Channel Connect Modal */}
        <ChannelConnectModal
          isOpen={connectModalOpen}
          onClose={() => setConnectModalOpen(false)}
          channel={connectingChannel}
          workspaceId={workspaceId}
          onSuccess={handleChannelConnectSuccess}
        />
      </div>
    );
  }

  // Setup Wizard for new workspaces
  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-dark-900/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-primary-500" />
            <span className="font-semibold text-white">{workspace.name || 'Workspace Setup'}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center space-x-3 ${
                currentStep >= step.id ? 'text-primary-400' : 'text-white/30'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep > step.id 
                    ? 'bg-green-500/20 text-green-400' 
                    : currentStep === step.id 
                    ? 'bg-primary-500/20 text-primary-400' 
                    : 'bg-white/5 text-white/30'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="font-medium">{step.title}</p>
                  <p className="text-xs opacity-60">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-green-500/50' : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-900/50 border border-white/10 rounded-2xl p-8"
        >
          {/* Step 1: Training Data */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Train Your AI Bot</h2>
              <p className="text-white/60 mb-8">
                Provide information about your business so the AI can answer customer questions accurately.
              </p>

              <div className="flex space-x-4 mb-6">
                {[
                  { id: 'url', label: 'Website URL', icon: Globe },
                  { id: 'text', label: 'Text Content', icon: FileText },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setTrainingType(type.id as 'url' | 'text')}
                    className={`flex-1 flex items-center justify-center space-x-2 p-4 rounded-xl border transition-all ${
                      trainingType === type.id
                        ? 'border-primary-500 bg-primary-500/10 text-primary-300'
                        : 'border-white/10 text-white/60 hover:border-white/20'
                    }`}
                  >
                    <type.icon className="w-5 h-5" />
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>

              {trainingType === 'url' && (
                <Input
                  label="Website URL"
                  type="url"
                  value={trainingUrl}
                  onChange={(e) => setTrainingUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              )}

              {trainingType === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Training Content
                  </label>
                  <textarea
                    value={trainingText}
                    onChange={(e) => setTrainingText(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-500/50 transition-colors resize-none"
                    placeholder="Paste your FAQ, product information, company policies, or any other content you want the AI to know about..."
                  />
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <Button onClick={handleTrainingSubmit} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Connect Channels */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Connect Your Channels</h2>
              <p className="text-gray-600 dark:text-white/60 mb-8">
                Link your messaging platforms to start receiving messages.
              </p>

              <div className="space-y-4">
                {workspace.allowedChannels?.includes('whatsapp') && (
                  <div className={`p-6 border rounded-xl transition-colors ${
                    connectedChannels.includes('whatsapp') 
                      ? 'border-green-500 bg-green-500/10' 
                      : 'border-gray-200 dark:border-white/10'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                          <MessageSquare className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">WhatsApp Business</h3>
                          <p className="text-gray-500 dark:text-white/50 text-sm">Connect your WhatsApp Business account</p>
                        </div>
                      </div>
                      <Button 
                        variant={connectedChannels.includes('whatsapp') ? 'primary' : 'secondary'} 
                        size="sm"
                        onClick={() => handleChannelConnect('whatsapp')}
                      >
                        {connectedChannels.includes('whatsapp') ? (
                          <><Check className="w-4 h-4 mr-1" /> Connected</>
                        ) : 'Connect'}
                      </Button>
                    </div>
                  </div>
                )}

                {workspace.allowedChannels?.includes('messenger') && (
                  <div className={`p-6 border rounded-xl transition-colors ${
                    connectedChannels.includes('messenger') 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-gray-200 dark:border-white/10'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <MessageSquare className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">Facebook Messenger</h3>
                          <p className="text-gray-500 dark:text-white/50 text-sm">Connect your Facebook page</p>
                        </div>
                      </div>
                      <Button 
                        variant={connectedChannels.includes('messenger') ? 'primary' : 'secondary'} 
                        size="sm"
                        onClick={() => handleChannelConnect('messenger')}
                      >
                        {connectedChannels.includes('messenger') ? (
                          <><Check className="w-4 h-4 mr-1" /> Connected</>
                        ) : 'Connect'}
                      </Button>
                    </div>
                  </div>
                )}

                {workspace.allowedChannels?.includes('widget') && (
                  <div className="p-6 border border-green-500 bg-green-500/10 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                          <Globe className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">Website Widget</h3>
                          <p className="text-gray-500 dark:text-white/50 text-sm">Embed chat on your website</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-500/20 text-green-600 dark:text-green-300 rounded-full text-sm flex items-center">
                        <Check className="w-4 h-4 mr-1" /> Auto-enabled
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="secondary" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button onClick={handleContinueFromChannels}>
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Business Info */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Business Information</h2>
              <p className="text-white/60 mb-8">
                Configure your business details for a personalized experience.
              </p>

              <div className="space-y-6">
                <Input
                  label="Business Name"
                  value={businessInfo.businessName}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, businessName: e.target.value })}
                  placeholder="Your Company Name"
                />

                <Input
                  label="Support Email"
                  type="email"
                  value={businessInfo.supportEmail}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, supportEmail: e.target.value })}
                  placeholder="support@yourcompany.com"
                />

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Welcome Message
                  </label>
                  <textarea
                    value={businessInfo.welcomeMessage}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, welcomeMessage: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-500/50 transition-colors resize-none"
                    placeholder="The first message visitors will see..."
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="secondary" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button onClick={handleBusinessInfoSubmit} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <Check className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Channel Connect Modal */}
      <ChannelConnectModal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        channel={connectingChannel}
        workspaceId={workspaceId}
        onSuccess={handleChannelConnectSuccess}
      />
    </div>
  );
}
