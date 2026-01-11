import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IArticle extends Document {
  _id: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  views: number;
  helpfulCount: number;
  notHelpfulCount: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'General',
    },
    tags: [{ type: String }],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    views: { type: Number, default: 0 },
    helpfulCount: { type: Number, default: 0 },
    notHelpfulCount: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

ArticleSchema.index({ workspaceId: 1, slug: 1 }, { unique: true });
ArticleSchema.index({ workspaceId: 1, status: 1 });
ArticleSchema.index({ title: 'text', content: 'text' });

const Article: Model<IArticle> = mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);
export default Article;
