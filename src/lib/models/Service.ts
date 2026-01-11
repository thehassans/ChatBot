import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IService extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  features: string[];
  channels: ('whatsapp' | 'messenger' | 'widget' | 'email')[];
  icon: string;
  popular: boolean;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
    },
    features: [{
      type: String,
    }],
    channels: [{
      type: String,
      enum: ['whatsapp', 'messenger', 'widget', 'email'],
    }],
    icon: {
      type: String,
      default: 'MessageSquare',
    },
    popular: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Service: Model<IService> = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
export default Service;
