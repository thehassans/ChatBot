import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICustomer {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  ip?: string;
  location?: {
    country?: string;
    city?: string;
    region?: string;
  };
  device?: {
    browser?: string;
    os?: string;
    device?: string;
  };
  metadata?: Record<string, any>;
  pagesViewed?: { url: string; title: string; timestamp: Date }[];
}

export interface IConversation extends Document {
  _id: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  channel: 'whatsapp' | 'messenger' | 'widget' | 'email';
  channelId: string;
  customer: ICustomer;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: mongoose.Types.ObjectId;
  tags: string[];
  subject?: string;
  lastMessageAt: Date;
  lastMessagePreview?: string;
  unreadCount: number;
  isBot: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  avatar: { type: String },
  ip: { type: String },
  location: {
    country: { type: String },
    city: { type: String },
    region: { type: String },
  },
  device: {
    browser: { type: String },
    os: { type: String },
    device: { type: String },
  },
  metadata: { type: Schema.Types.Mixed, default: {} },
  pagesViewed: [{
    url: { type: String },
    title: { type: String },
    timestamp: { type: Date },
  }],
});

const ConversationSchema = new Schema<IConversation>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    channel: {
      type: String,
      enum: ['whatsapp', 'messenger', 'widget', 'email'],
      required: true,
    },
    channelId: {
      type: String,
      required: true,
    },
    customer: { type: CustomerSchema, default: () => ({}) },
    status: {
      type: String,
      enum: ['open', 'pending', 'resolved', 'closed'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    tags: [{ type: String }],
    subject: { type: String },
    lastMessageAt: { type: Date, default: Date.now },
    lastMessagePreview: { type: String },
    unreadCount: { type: Number, default: 0 },
    isBot: { type: Boolean, default: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
  }
);

ConversationSchema.index({ workspaceId: 1, lastMessageAt: -1 });
ConversationSchema.index({ workspaceId: 1, status: 1 });
ConversationSchema.index({ channelId: 1, channel: 1 });

const Conversation: Model<IConversation> = mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);
export default Conversation;
