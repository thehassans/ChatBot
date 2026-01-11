import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdminSettings extends Document {
  _id: mongoose.Types.ObjectId;
  key: string;
  geminiApiKey?: string;
  whatsappConfig: {
    token?: string;
    phoneNumberId?: string;
    verifyToken?: string;
    webhookUrl?: string;
  };
  messengerConfig: {
    appId?: string;
    appSecret?: string;
    pageAccessToken?: string;
    verifyToken?: string;
    webhookUrl?: string;
  };
  emailConfig: {
    provider?: string;
    apiKey?: string;
    fromEmail?: string;
    fromName?: string;
  };
  paymentConfig: {
    enabledProviders: string[];
    stripe: {
      enabled: boolean;
      publicKey?: string;
      secretKey?: string;
      webhookSecret?: string;
    };
    paypal: {
      enabled: boolean;
      clientId?: string;
      clientSecret?: string;
      mode: 'sandbox' | 'live';
    };
    manualPayment: {
      enabled: boolean;
      instructions?: string;
      bankDetails?: string;
    };
    currency: string;
    taxRate: number;
  };
  globalBotSettings: {
    defaultReplyDelay: number;
    defaultTypingDuration: number;
    maxReplyLength: number;
    fallbackMessage: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AdminSettingsSchema = new Schema<IAdminSettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'main',
    },
    geminiApiKey: {
      type: String,
    },
    whatsappConfig: {
      token: { type: String },
      phoneNumberId: { type: String },
      verifyToken: { type: String },
      webhookUrl: { type: String },
    },
    messengerConfig: {
      appId: { type: String },
      appSecret: { type: String },
      pageAccessToken: { type: String },
      verifyToken: { type: String },
      webhookUrl: { type: String },
    },
    emailConfig: {
      provider: { type: String },
      apiKey: { type: String },
      fromEmail: { type: String },
      fromName: { type: String },
    },
    paymentConfig: {
      enabledProviders: { type: [String], default: ['manual'] },
      stripe: {
        enabled: { type: Boolean, default: false },
        publicKey: { type: String },
        secretKey: { type: String },
        webhookSecret: { type: String },
      },
      paypal: {
        enabled: { type: Boolean, default: false },
        clientId: { type: String },
        clientSecret: { type: String },
        mode: { type: String, enum: ['sandbox', 'live'], default: 'sandbox' },
      },
      manualPayment: {
        enabled: { type: Boolean, default: true },
        instructions: { type: String, default: 'Please complete your payment via bank transfer. You will receive payment instructions via email after order confirmation.' },
        bankDetails: { type: String },
      },
      currency: { type: String, default: 'USD' },
      taxRate: { type: Number, default: 10 },
    },
    globalBotSettings: {
      defaultReplyDelay: { type: Number, default: 1500 },
      defaultTypingDuration: { type: Number, default: 2000 },
      maxReplyLength: { type: Number, default: 500 },
      fallbackMessage: { type: String, default: 'I apologize, but I am not able to help with that. Please contact our support team directly.' },
    },
  },
  {
    timestamps: true,
  }
);

const AdminSettings: Model<IAdminSettings> = mongoose.models.AdminSettings || mongoose.model<IAdminSettings>('AdminSettings', AdminSettingsSchema);
export default AdminSettings;
