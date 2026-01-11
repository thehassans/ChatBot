'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Check, ExternalLink, MessageSquare, AlertCircle } from 'lucide-react';
import { Button, Input } from '@/components/ui';

interface ChannelConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: 'whatsapp' | 'messenger';
  workspaceId: string;
  onSuccess: (channel: string) => void;
}

export function ChannelConnectModal({ 
  isOpen, 
  onClose, 
  channel, 
  workspaceId,
  onSuccess 
}: ChannelConnectModalProps) {
  const [step, setStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  
  // WhatsApp credentials
  const [whatsappCredentials, setWhatsappCredentials] = useState({
    phoneNumberId: '',
    accessToken: '',
    businessAccountId: '',
  });

  // Messenger credentials
  const [messengerCredentials, setMessengerCredentials] = useState({
    pageId: '',
    pageAccessToken: '',
    appId: '',
    appSecret: '',
  });

  const handleConnect = async () => {
    setIsConnecting(true);
    setError('');

    try {
      const credentials = channel === 'whatsapp' ? whatsappCredentials : messengerCredentials;
      
      const response = await fetch(`/api/workspaces/${workspaceId}/channels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          action: 'connect',
          credentials,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Connection failed');
      }

      onSuccess(channel);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDemoConnect = async () => {
    setIsConnecting(true);
    setError('');

    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/channels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          action: 'connect',
          credentials: { demoMode: true },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Connection failed');
      }

      onSuccess(channel);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const channelConfig = {
    whatsapp: {
      name: 'WhatsApp Business',
      color: 'green',
      icon: '💬',
      docsUrl: 'https://developers.facebook.com/docs/whatsapp/cloud-api/get-started',
      steps: [
        'Create a Meta Business Account at business.facebook.com',
        'Go to Meta for Developers and create an app',
        'Add WhatsApp product to your app',
        'Get your Phone Number ID and Access Token from the WhatsApp dashboard',
        'Enter the credentials below',
      ],
    },
    messenger: {
      name: 'Facebook Messenger',
      color: 'blue',
      icon: '💬',
      docsUrl: 'https://developers.facebook.com/docs/messenger-platform/getting-started',
      steps: [
        'Go to Meta for Developers and create an app',
        'Add Messenger product to your app',
        'Connect your Facebook Page to the app',
        'Generate a Page Access Token',
        'Enter the credentials below',
      ],
    },
  };

  const config = channelConfig[channel];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-white dark:bg-dark-900 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className={`p-6 bg-${config.color}-500/10 border-b border-gray-200 dark:border-white/10`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-${config.color}-500/20 rounded-xl flex items-center justify-center`}>
                  <MessageSquare className={`w-6 h-6 text-${config.color}-500`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Connect {config.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-white/50">Step {step} of 2</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-white/50" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 1 && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Setup Instructions</h3>
                <ol className="space-y-3 mb-6">
                  {config.steps.map((stepText, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className={`flex-shrink-0 w-6 h-6 bg-${config.color}-500/20 text-${config.color}-600 dark:text-${config.color}-400 rounded-full flex items-center justify-center text-sm font-medium`}>
                        {index + 1}
                      </span>
                      <span className="text-gray-600 dark:text-white/70 text-sm">{stepText}</span>
                    </li>
                  ))}
                </ol>
                
                <a
                  href={config.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center space-x-2 text-${config.color}-600 dark:text-${config.color}-400 hover:underline text-sm`}
                >
                  <span>View official documentation</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <div className="mt-6 flex justify-end">
                  <Button onClick={() => setStep(2)}>
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Enter Credentials</h3>
                
                {error && (
                  <div className="mb-4 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {channel === 'whatsapp' && (
                  <div className="space-y-4">
                    <Input
                      label="Phone Number ID"
                      value={whatsappCredentials.phoneNumberId}
                      onChange={(e) => setWhatsappCredentials(prev => ({ ...prev, phoneNumberId: e.target.value }))}
                      placeholder="e.g., 123456789012345"
                    />
                    <Input
                      label="Access Token"
                      type="password"
                      value={whatsappCredentials.accessToken}
                      onChange={(e) => setWhatsappCredentials(prev => ({ ...prev, accessToken: e.target.value }))}
                      placeholder="Your WhatsApp Cloud API access token"
                    />
                    <Input
                      label="Business Account ID (Optional)"
                      value={whatsappCredentials.businessAccountId}
                      onChange={(e) => setWhatsappCredentials(prev => ({ ...prev, businessAccountId: e.target.value }))}
                      placeholder="e.g., 123456789012345"
                    />
                  </div>
                )}

                {channel === 'messenger' && (
                  <div className="space-y-4">
                    <Input
                      label="Page ID"
                      value={messengerCredentials.pageId}
                      onChange={(e) => setMessengerCredentials(prev => ({ ...prev, pageId: e.target.value }))}
                      placeholder="Your Facebook Page ID"
                    />
                    <Input
                      label="Page Access Token"
                      type="password"
                      value={messengerCredentials.pageAccessToken}
                      onChange={(e) => setMessengerCredentials(prev => ({ ...prev, pageAccessToken: e.target.value }))}
                      placeholder="Your page access token"
                    />
                    <Input
                      label="App ID (Optional)"
                      value={messengerCredentials.appId}
                      onChange={(e) => setMessengerCredentials(prev => ({ ...prev, appId: e.target.value }))}
                      placeholder="Your Facebook App ID"
                    />
                    <Input
                      label="App Secret (Optional)"
                      type="password"
                      value={messengerCredentials.appSecret}
                      onChange={(e) => setMessengerCredentials(prev => ({ ...prev, appSecret: e.target.value }))}
                      placeholder="Your Facebook App Secret"
                    />
                  </div>
                )}

                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl">
                  <p className="text-amber-700 dark:text-amber-400 text-sm">
                    <strong>Don't have credentials yet?</strong> You can use Demo Mode to test the integration without real API keys.
                  </p>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button variant="secondary" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <div className="flex space-x-3">
                    <Button 
                      variant="secondary"
                      onClick={handleDemoConnect} 
                      disabled={isConnecting}
                    >
                      Demo Mode
                    </Button>
                    <Button 
                      onClick={handleConnect} 
                      disabled={isConnecting}
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Connect {config.name}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
