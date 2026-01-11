'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MessageSquare, Search, Filter, 
  User, Clock, CheckCircle, Circle, Loader2,
  Send, Paperclip, MoreVertical, Star, Archive, RefreshCw
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import toast from 'react-hot-toast';

interface Conversation {
  _id: string;
  customer: {
    name?: string;
    avatar?: string;
    phone?: string;
    email?: string;
  };
  channel: 'whatsapp' | 'messenger' | 'widget';
  lastMessagePreview?: string;
  lastMessageAt: string;
  unreadCount: number;
  status: 'open' | 'resolved' | 'pending' | 'closed';
  workspaceId: any;
}

interface Message {
  _id: string;
  content: string;
  sender: 'customer' | 'bot' | 'agent' | 'system';
  createdAt: string;
  status?: 'sent' | 'delivered' | 'read' | 'pending' | 'failed';
}

export default function InboxPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [workspaceName, setWorkspaceName] = useState<string>('');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      loadConversations();
    } catch (error) {
      router.push('/login');
    }
  };

  const loadConversations = async () => {
    try {
      const workspaceId = searchParams.get('workspace');
      let url = '/api/conversations';
      if (workspaceId) {
        url += `?workspaceId=${workspaceId}`;
        // Load workspace details
        const wsResponse = await fetch(`/api/workspaces/${workspaceId}`);
        if (wsResponse.ok) {
          const wsData = await wsResponse.json();
          setWorkspaceName(wsData.workspace?.businessName || wsData.workspace?.name || '');
        }
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load conversations');
      
      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Load conversations error:', error);
      // Show empty state instead of error
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsLoadingMessages(true);
    
    try {
      const response = await fetch(`/api/conversations/${conversation._id}/messages`);
      if (!response.ok) throw new Error('Failed to load messages');
      
      const data = await response.json();
      setMessages(data.messages || []);
      
      // Update unread count locally
      setConversations(prev => prev.map(c => 
        c._id === conversation._id ? { ...c, unreadCount: 0 } : c
      ));
    } catch (error) {
      console.error('Load messages error:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    setIsSending(true);
    const messageContent = newMessage;
    setNewMessage('');

    // Optimistically add message
    const tempMessage: Message = {
      _id: `temp_${Date.now()}`,
      content: messageContent,
      sender: 'agent',
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const response = await fetch(`/api/conversations/${selectedConversation._id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageContent, sender: 'agent' }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const data = await response.json();
      
      // Replace temp message with real one
      setMessages(prev => prev.map(m => 
        m._id === tempMessage._id ? { ...data.message, status: 'sent' } : m
      ));

      // Update conversation preview
      setConversations(prev => prev.map(c => 
        c._id === selectedConversation._id 
          ? { ...c, lastMessagePreview: messageContent, lastMessageAt: new Date().toISOString() } 
          : c
      ));
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
      // Remove failed message
      setMessages(prev => prev.filter(m => m._id !== tempMessage._id));
      setNewMessage(messageContent);
    } finally {
      setIsSending(false);
    }
  };

  const updateConversationStatus = async (status: string) => {
    if (!selectedConversation) return;

    try {
      const response = await fetch(`/api/conversations/${selectedConversation._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      setSelectedConversation({ ...selectedConversation, status: status as any });
      setConversations(prev => prev.map(c => 
        c._id === selectedConversation._id ? { ...c, status: status as any } : c
      ));
      
      toast.success(`Conversation marked as ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center"><MessageSquare className="w-4 h-4 text-green-500" /></div>;
      case 'messenger':
        return <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center"><MessageSquare className="w-4 h-4 text-blue-500" /></div>;
      default:
        return <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center"><MessageSquare className="w-4 h-4 text-purple-500" /></div>;
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations.filter(conv => {
    if (filter !== 'all' && conv.status !== filter) return false;
    if (searchQuery && conv.customer?.name && !conv.customer.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* Header */}
      <header className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-white/60" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {workspaceName ? `${workspaceName} - Inbox` : 'Inbox'}
              </h1>
              {workspaceName && (
                <p className="text-sm text-gray-500 dark:text-white/50">
                  Conversations for this workspace
                </p>
              )}
            </div>
            <span className="px-2 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium">
              {conversations.filter(c => c.unreadCount > 0).length} unread
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={loadConversations}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-gray-600 dark:text-white/60" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Conversation List */}
        <div className="w-96 border-r border-gray-200 dark:border-white/10 bg-white dark:bg-dark-900 flex flex-col">
          {/* Search & Filter */}
          <div className="p-4 border-b border-gray-200 dark:border-white/10">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
            </div>
            <div className="flex space-x-2">
              {(['all', 'open', 'resolved'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === f
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/20'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 dark:text-white/20 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-white/50">No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <motion.div
                  key={conv._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => loadMessages(conv)}
                  className={`p-4 border-b border-gray-100 dark:border-white/5 cursor-pointer transition-colors ${
                    selectedConversation?._id === conv._id
                      ? 'bg-primary-50 dark:bg-primary-500/10'
                      : 'hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {getChannelIcon(conv.channel)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {conv.customer?.name || 'Unknown Customer'}
                        </h3>
                        <span className="text-xs text-gray-400 dark:text-white/40">
                          {formatTime(conv.lastMessageAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-white/50 truncate mt-1">
                        {conv.lastMessagePreview || 'No messages yet'}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          conv.status === 'open' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                          conv.status === 'resolved' ? 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/50' :
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                        }`}>
                          {conv.status}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-dark-950">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-white/10 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getChannelIcon(selectedConversation.channel)}
                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-white">
                        {selectedConversation.customer?.name || 'Unknown Customer'}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-white/50">
                        {selectedConversation.customer.phone || selectedConversation.customer.email || selectedConversation.channel}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateConversationStatus(selectedConversation.status === 'resolved' ? 'open' : 'resolved')}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <CheckCircle className={`w-5 h-5 ${selectedConversation.status === 'resolved' ? 'text-green-500' : 'text-gray-400'}`} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                      <Archive className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-white/50">
                    No messages yet
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-md px-4 py-3 rounded-2xl ${
                        msg.sender === 'customer'
                          ? 'bg-white dark:bg-dark-800 text-gray-900 dark:text-white shadow-sm'
                          : msg.sender === 'bot'
                          ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-900 dark:text-purple-100'
                          : 'bg-primary-500 text-white'
                      }`}>
                        <p>{msg.content}</p>
                        <div className={`text-xs mt-1 ${
                          msg.sender === 'customer' ? 'text-gray-400' : msg.sender === 'bot' ? 'text-purple-500 dark:text-purple-300' : 'text-white/70'
                        }`}>
                          {msg.sender === 'bot' && <span className="mr-2">🤖 Bot</span>}
                          {msg.sender === 'agent' && <span className="mr-2">👤 You</span>}
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-white/10 px-6 py-4">
                <div className="flex items-center space-x-4">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                    <Paperclip className="w-5 h-5 text-gray-400" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 dark:text-white/20 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500 dark:text-white/50">
                  Choose a conversation from the list to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
