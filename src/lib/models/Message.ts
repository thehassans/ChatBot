import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAttachment {
  type: 'image' | 'video' | 'audio' | 'file';
  url: string;
  name: string;
  size?: number;
  mimeType?: string;
}

export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  sender: 'customer' | 'agent' | 'bot' | 'system';
  senderId?: string;
  senderName?: string;
  content: string;
  contentType: 'text' | 'image' | 'video' | 'audio' | 'file' | 'template';
  attachments?: IAttachment[];
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  isInternal: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const AttachmentSchema = new Schema<IAttachment>({
  type: { type: String, enum: ['image', 'video', 'audio', 'file'], required: true },
  url: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: Number },
  mimeType: { type: String },
});

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    sender: {
      type: String,
      enum: ['customer', 'agent', 'bot', 'system'],
      required: true,
    },
    senderId: { type: String },
    senderName: { type: String },
    content: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      enum: ['text', 'image', 'video', 'audio', 'file', 'template'],
      default: 'text',
    },
    attachments: [AttachmentSchema],
    status: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'read', 'failed'],
      default: 'sent',
    },
    isInternal: {
      type: Boolean,
      default: false,
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({ conversationId: 1, createdAt: 1 });
MessageSchema.index({ workspaceId: 1, createdAt: -1 });

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
export default Message;
