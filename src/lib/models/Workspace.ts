import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChannelConfig {
  enabled: boolean;
  connected: boolean;
  config: Record<string, any>;
}

export interface IBotSettings {
  enabled: boolean;
  replyDelay: number;
  typingIndicatorDuration: number;
  workingHours: {
    enabled: boolean;
    timezone: string;
    schedule: {
      [key: string]: { start: string; end: string; enabled: boolean };
    };
  };
  autoReply: {
    enabled: boolean;
    message: string;
  };
  humanHandoff: {
    enabled: boolean;
    keywords: string[];
  };
}

export interface IWorkspace extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  name: string;
  businessName: string;
  website?: string;
  supportEmail?: string;
  supportPhone?: string;
  timezone: string;
  language: string;
  channels: {
    whatsapp: IChannelConfig;
    messenger: IChannelConfig;
    widget: IChannelConfig;
    email: IChannelConfig;
  };
  allowedChannels: ('whatsapp' | 'messenger' | 'widget' | 'email')[];
  trainingData: {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    source?: 'url' | 'file' | 'text';
    sourceValue?: string;
    rawContent?: string;
    processedContent?: string;
    processedAt?: Date;
    startedAt?: Date;
    contentLength?: number;
    error?: string;
  };
  knowledgeBase?: string;
  botSettings: IBotSettings;
  widgetSettings: {
    primaryColor: string;
    position: 'left' | 'right';
    greeting: string;
    placeholder: string;
    agentName: string;
    agentAvatar?: string;
  };
  setupStep: number;
  setupCompleted: boolean;
  status: 'pending' | 'active' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

const ChannelConfigSchema = new Schema<IChannelConfig>({
  enabled: { type: Boolean, default: false },
  connected: { type: Boolean, default: false },
  config: { type: Schema.Types.Mixed, default: {} },
});

const BotSettingsSchema = new Schema<IBotSettings>({
  enabled: { type: Boolean, default: true },
  replyDelay: { type: Number, default: 1500 },
  typingIndicatorDuration: { type: Number, default: 2000 },
  workingHours: {
    enabled: { type: Boolean, default: false },
    timezone: { type: String, default: 'UTC' },
    schedule: { type: Schema.Types.Mixed, default: {} },
  },
  autoReply: {
    enabled: { type: Boolean, default: false },
    message: { type: String, default: '' },
  },
  humanHandoff: {
    enabled: { type: Boolean, default: true },
    keywords: [{ type: String }],
  },
});

const WorkspaceSchema = new Schema<IWorkspace>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    businessName: {
      type: String,
      default: '',
    },
    website: {
      type: String,
    },
    supportEmail: {
      type: String,
    },
    supportPhone: {
      type: String,
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    language: {
      type: String,
      default: 'en',
    },
    channels: {
      whatsapp: { type: ChannelConfigSchema, default: () => ({}) },
      messenger: { type: ChannelConfigSchema, default: () => ({}) },
      widget: { type: ChannelConfigSchema, default: () => ({}) },
      email: { type: ChannelConfigSchema, default: () => ({}) },
    },
    allowedChannels: [{
      type: String,
      enum: ['whatsapp', 'messenger', 'widget', 'email'],
    }],
    trainingData: {
      status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
      source: { type: String, enum: ['url', 'file', 'text'] },
      sourceValue: { type: String },
      rawContent: { type: String },
      processedContent: { type: String },
      processedAt: { type: Date },
      startedAt: { type: Date },
      contentLength: { type: Number },
      error: { type: String },
    },
    knowledgeBase: {
      type: String,
    },
    botSettings: { type: BotSettingsSchema, default: () => ({}) },
    widgetSettings: {
      primaryColor: { type: String, default: '#5a66f2' },
      position: { type: String, enum: ['left', 'right'], default: 'right' },
      greeting: { type: String, default: 'Hi there! How can we help you today?' },
      placeholder: { type: String, default: 'Type your message...' },
      agentName: { type: String, default: 'Support Agent' },
      agentAvatar: { type: String },
    },
    setupStep: {
      type: Number,
      default: 1,
    },
    setupCompleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'suspended'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Workspace: Model<IWorkspace> = mongoose.models.Workspace || mongoose.model<IWorkspace>('Workspace', WorkspaceSchema);
export default Workspace;
