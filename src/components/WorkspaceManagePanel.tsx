'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, FileText, MessageSquare, Code, Settings, Globe, Check, 
  Loader2, RefreshCw, Copy, Palette, Zap, Upload
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { ChannelConnectModal } from '@/components/ChannelConnectModal';
import toast from 'react-hot-toast';

interface WorkspaceManagePanelProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  workspaceName: string;
}

const manageTabs = [
  { id: 'training', title: 'Training Data', icon: FileText },
  { id: 'channels', title: 'Channels', icon: MessageSquare },
  { id: 'widget', title: 'Website Widget', icon: Code },
  { id: 'settings', title: 'Bot Settings', icon: Settings },
];

export function WorkspaceManagePanel({ isOpen, onClose, workspaceId, workspaceName }: WorkspaceManagePanelProps) {
  const [activeTab, setActiveTab] = useState('training');
  const [workspace, setWorkspace] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRetraining, setIsRetraining] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');

  // Training data state
  const [trainingType, setTrainingType] = useState<'url' | 'text' | 'file'>('url');
  const [trainingUrl, setTrainingUrl] = useState('');
  const [trainingText, setTrainingText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Channel state
  const [connectedChannels, setConnectedChannels] = useState<string[]>([]);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [connectingChannel, setConnectingChannel] = useState<'whatsapp' | 'messenger'>('whatsapp');

  // Business info state
  const [businessInfo, setBusinessInfo] = useState({
    businessName: '',
    supportEmail: '',
    welcomeMessage: 'Hi! How can I help you today?',
  });

  useEffect(() => {
    if (isOpen && workspaceId) {
      fetchWorkspace();
    }
  }, [isOpen, workspaceId]);

  const fetchWorkspace = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}`);
      if (!response.ok) throw new Error('Workspace not found');
      const data = await response.json();
      setWorkspace(data.workspace);
      
      // Load business info
      if (data.workspace.businessName) {
        setBusinessInfo({
          businessName: data.workspace.businessName,
          supportEmail: data.workspace.supportEmail || '',
          welcomeMessage: data.workspace.botSettings?.welcomeMessage || 'Hi! How can I help you today?',
        });
      }
      
      // Load training data
      if (data.workspace.trainingData?.url) {
        setTrainingUrl(data.workspace.trainingData.url);
        setTrainingType('url');
      } else if (data.workspace.trainingData?.rawContent) {
        setTrainingText(data.workspace.trainingData.rawContent);
        setTrainingType('text');
      }
      
      // Load connected channels
      const connected: string[] = [];
      if (data.workspace.channels?.whatsapp?.connected) connected.push('whatsapp');
      if (data.workspace.channels?.messenger?.connected) connected.push('messenger');
      if (data.workspace.channels?.widget?.connected) connected.push('widget');
      setConnectedChannels(connected);
    } catch (error) {
      toast.error('Failed to load workspace');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const handleRetrain = async () => {
    setIsRetraining(true);
    try {
      let content = '';
      let type = trainingType;

      // Handle file upload
      if (trainingType === 'file' && uploadedFile) {
        content = await handleFileUpload(uploadedFile);
        type = 'text'; // Send as text content
      } else if (trainingType === 'text') {
        content = trainingText;
      }

      const response = await fetch(`/api/workspaces/${workspaceId}/training`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: type === 'file' ? 'text' : type,
          url: type === 'url' ? trainingUrl : undefined,
          content: type === 'text' || type === 'file' ? content || trainingText : undefined,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Show helpful error message and auto-switch to text content if URL blocked
        toast.error(data.error || 'Failed to retrain');
        if (data.suggestion) {
          toast(data.suggestion, { icon: '💡', duration: 5000 });
          // Auto switch to text content tab
          setTrainingType('text');
        }
        return;
      }
      
      toast.success('Bot retrained successfully!');
      setUploadedFile(null);
      fetchWorkspace();
    } catch (error: any) {
      toast.error(error.message || 'Failed to retrain bot');
    } finally {
      setIsRetraining(false);
    }
  };

  const handleTestGemini = async () => {
    setIsTesting(true);
    try {
      const response = await fetch('/api/admin/test-gemini', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        setGeminiStatus('connected');
        toast.success('Gemini API connected successfully!');
      } else {
        setGeminiStatus('error');
        toast.error(data.error || 'Gemini API connection failed');
      }
    } catch (error) {
      setGeminiStatus('error');
      toast.error('Failed to test Gemini connection');
    } finally {
      setIsTesting(false);
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
          botSettings: { welcomeMessage: businessInfo.welcomeMessage },
        }),
      });

      if (!response.ok) throw new Error('Failed to update');
      
      toast.success('Settings updated!');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChannelConnectSuccess = (channel: string) => {
    setConnectedChannels(prev => [...prev, channel]);
    setConnectModalOpen(false);
    fetchWorkspace();
  };

  const handleChannelDisconnect = async (channel: string) => {
    try {
      await fetch(`/api/workspaces/${workspaceId}/channels`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel }),
      });
      setConnectedChannels(prev => prev.filter(c => c !== channel));
      toast.success(`${channel} disconnected`);
    } catch (error) {
      toast.error('Failed to disconnect channel');
    }
  };

  const getEmbedCode = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `<!-- Magnetic Nobot Chat Widget -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${origin}/widget.js';
    script.async = true;
    script.onload = function() {
      MagneticNobot.init({
        workspaceId: '${workspaceId}',
        apiBaseUrl: '${origin}'
      });
    };
    document.head.appendChild(script);
  })();
</script>`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-4xl bg-dark-900 z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white">{workspaceName}</h2>
                <p className="text-white/50 text-sm">Manage your workspace settings</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white/50" />
              </button>
            </div>

            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              </div>
            ) : (
              <div className="flex-1 flex overflow-hidden">
                {/* Tabs Sidebar */}
                <div className="w-56 bg-dark-950/50 border-r border-white/10 p-4">
                  <nav className="space-y-1">
                    {manageTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary-500 text-white'
                            : 'text-white/60 hover:bg-white/5'
                        }`}
                      >
                        <tab.icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{tab.title}</span>
                      </button>
                    ))}
                  </nav>

                  {/* Training Status */}
                  {workspace?.trainingData?.status && (
                    <div className="mt-6 p-4 bg-dark-900 rounded-xl border border-white/10">
                      <h4 className="text-sm font-medium text-white/70 mb-2">Training Status</h4>
                      <div className={`flex items-center space-x-2 ${
                        workspace.trainingData.status === 'completed' ? 'text-green-500' : 'text-yellow-500'
                      }`}>
                        <Check className="w-4 h-4" />
                        <span className="text-sm capitalize">{workspace.trainingData.status}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {/* Training Tab */}
                  {activeTab === 'training' && (
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Training Data</h3>
                      <p className="text-white/60 mb-6">
                        Update your AI bot's knowledge base by retraining with new content.
                      </p>

                      <div className="flex flex-wrap gap-3 mb-6">
                        <button
                          onClick={() => setTrainingType('url')}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                            trainingType === 'url'
                              ? 'border-primary-500 bg-primary-500/10 text-primary-300'
                              : 'border-white/10 text-white/60'
                          }`}
                        >
                          <Globe className="w-4 h-4" />
                          <span>Website URL</span>
                        </button>
                        <button
                          onClick={() => setTrainingType('text')}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                            trainingType === 'text'
                              ? 'border-primary-500 bg-primary-500/10 text-primary-300'
                              : 'border-white/10 text-white/60'
                          }`}
                        >
                          <FileText className="w-4 h-4" />
                          <span>Text Content</span>
                        </button>
                        <button
                          onClick={() => setTrainingType('file')}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                            trainingType === 'file'
                              ? 'border-primary-500 bg-primary-500/10 text-primary-300'
                              : 'border-white/10 text-white/60'
                          }`}
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload File</span>
                        </button>
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
                            rows={10}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-500/50 resize-none"
                            placeholder="Paste your FAQ, documentation, or knowledge base content here..."
                          />
                        </div>
                      )}

                      {trainingType === 'file' && (
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Upload Training File
                          </label>
                          <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary-500/50 transition-colors">
                            <input
                              type="file"
                              accept=".txt,.md,.json,.csv,.pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setUploadedFile(file);
                                  toast.success(`File "${file.name}" selected`);
                                }
                              }}
                              className="hidden"
                              id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                              <Upload className="w-12 h-12 text-white/30 mx-auto mb-4" />
                              {uploadedFile ? (
                                <div>
                                  <p className="text-white font-medium">{uploadedFile.name}</p>
                                  <p className="text-white/50 text-sm mt-1">
                                    {(uploadedFile.size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-white/60">Click to upload or drag and drop</p>
                                  <p className="text-white/40 text-sm mt-1">
                                    Supports: .txt, .md, .json, .csv files
                                  </p>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Gemini API Status */}
                      <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              geminiStatus === 'connected' ? 'bg-green-500/20' : 
                              geminiStatus === 'error' ? 'bg-red-500/20' : 'bg-white/10'
                            }`}>
                              <Zap className={`w-5 h-5 ${
                                geminiStatus === 'connected' ? 'text-green-500' : 
                                geminiStatus === 'error' ? 'text-red-500' : 'text-white/50'
                              }`} />
                            </div>
                            <div>
                              <h4 className="font-medium text-white">Gemini AI</h4>
                              <p className="text-white/50 text-sm">
                                {geminiStatus === 'connected' ? 'Connected' : 
                                 geminiStatus === 'error' ? 'Connection failed' : 'Not tested'}
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={handleTestGemini}
                            disabled={isTesting}
                          >
                            {isTesting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              'Test Connection'
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex justify-end mt-6">
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
                  {activeTab === 'channels' && (
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Channels</h3>
                      <p className="text-white/60 mb-6">
                        Manage your messaging platform connections.
                      </p>

                      <div className="space-y-4">
                        {/* WhatsApp */}
                        {workspace?.allowedChannels?.includes('whatsapp') && (
                          <div className={`p-5 border rounded-xl ${
                            connectedChannels.includes('whatsapp') 
                              ? 'border-green-500 bg-green-500/10' 
                              : 'border-white/10'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                  <MessageSquare className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-white">WhatsApp Business</h4>
                                  <p className="text-white/50 text-sm">
                                    {connectedChannels.includes('whatsapp') ? 'Connected' : 'Not connected'}
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
                        {workspace?.allowedChannels?.includes('messenger') && (
                          <div className={`p-5 border rounded-xl ${
                            connectedChannels.includes('messenger') 
                              ? 'border-blue-500 bg-blue-500/10' 
                              : 'border-white/10'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                  <MessageSquare className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-white">Facebook Messenger</h4>
                                  <p className="text-white/50 text-sm">
                                    {connectedChannels.includes('messenger') ? 'Connected' : 'Not connected'}
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
                        {workspace?.allowedChannels?.includes('widget') && (
                          <div className="p-5 border border-green-500 bg-green-500/10 rounded-xl">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                  <Globe className="w-5 h-5 text-purple-500" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-white">Website Widget</h4>
                                  <p className="text-white/50 text-sm">Always enabled</p>
                                </div>
                              </div>
                              <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm flex items-center">
                                <Check className="w-4 h-4 mr-1" /> Active
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Widget Tab */}
                  {activeTab === 'widget' && (
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Website Widget</h3>
                      <p className="text-white/60 mb-6">
                        Add the chatbot widget to your website for customer support.
                      </p>

                      {/* Embed Code */}
                      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-white flex items-center">
                            <Code className="w-5 h-5 mr-2 text-primary-500" />
                            Embed Code
                          </h4>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(getEmbedCode());
                              toast.success('Copied to clipboard!');
                            }}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                        </div>
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                          {getEmbedCode()}
                        </pre>
                        <p className="text-white/50 text-sm mt-3">
                          Add this code before the closing <code className="bg-white/10 px-1 rounded">&lt;/body&gt;</code> tag.
                        </p>
                      </div>

                      {/* Customization */}
                      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h4 className="font-medium text-white flex items-center mb-4">
                          <Palette className="w-5 h-5 mr-2 text-primary-500" />
                          Customization
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              Primary Color
                            </label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={workspace?.widgetSettings?.primaryColor || '#6366f1'}
                                onChange={async (e) => {
                                  await fetch(`/api/workspaces/${workspaceId}`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      widgetSettings: { ...workspace?.widgetSettings, primaryColor: e.target.value }
                                    }),
                                  });
                                  setWorkspace((prev: any) => ({
                                    ...prev,
                                    widgetSettings: { ...prev?.widgetSettings, primaryColor: e.target.value }
                                  }));
                                }}
                                className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer"
                              />
                              <span className="text-white/60 text-sm">
                                {workspace?.widgetSettings?.primaryColor || '#6366f1'}
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              Position
                            </label>
                            <select
                              value={workspace?.widgetSettings?.position || 'right'}
                              onChange={async (e) => {
                                await fetch(`/api/workspaces/${workspaceId}`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    widgetSettings: { ...workspace?.widgetSettings, position: e.target.value }
                                  }),
                                });
                                setWorkspace((prev: any) => ({
                                  ...prev,
                                  widgetSettings: { ...prev?.widgetSettings, position: e.target.value }
                                }));
                                toast.success('Position updated');
                              }}
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                            >
                              <option value="right">Bottom Right</option>
                              <option value="left">Bottom Left</option>
                            </select>
                          </div>
                        </div>

                        <Input
                          label="Agent Name"
                          value={workspace?.widgetSettings?.agentName || 'Support Agent'}
                          onChange={(e) => {
                            setWorkspace((prev: any) => ({
                              ...prev,
                              widgetSettings: { ...prev?.widgetSettings, agentName: e.target.value }
                            }));
                          }}
                          onBlur={async (e) => {
                            await fetch(`/api/workspaces/${workspaceId}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                widgetSettings: { ...workspace?.widgetSettings, agentName: e.target.value }
                              }),
                            });
                            toast.success('Agent name updated');
                          }}
                          placeholder="Support Agent"
                        />
                      </div>
                    </div>
                  )}

                  {/* Settings Tab */}
                  {activeTab === 'settings' && (
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Bot Settings</h3>
                      <p className="text-white/60 mb-6">
                        Configure your chatbot's behavior and responses.
                      </p>

                      <div className="space-y-5">
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
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-500/50 resize-none"
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
                </div>
              </div>
            )}
          </motion.div>

          {/* Channel Connect Modal */}
          <ChannelConnectModal
            isOpen={connectModalOpen}
            onClose={() => setConnectModalOpen(false)}
            channel={connectingChannel}
            workspaceId={workspaceId}
            onSuccess={handleChannelConnectSuccess}
          />
        </>
      )}
    </AnimatePresence>
  );
}
