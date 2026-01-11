import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/magnetic-nobot';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: String, enum: ['pending', 'active', 'suspended'], default: 'active' },
}, { timestamps: true });

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  features: [{ type: String }],
  channels: [{ type: String }],
  icon: { type: String },
  popular: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const AdminSettingsSchema = new mongoose.Schema({
  key: { type: String, default: 'main' },
  geminiApiKey: { type: String },
  globalBotSettings: {
    defaultReplyDelay: { type: Number, default: 1500 },
    defaultTypingDuration: { type: Number, default: 2000 },
    fallbackMessage: { type: String, default: 'Thank you for your message. Our team will get back to you shortly.' },
  },
}, { timestamps: true });

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    const User = mongoose.model('User', UserSchema);
    const Service = mongoose.model('Service', ServiceSchema);
    const AdminSettings = mongoose.model('AdminSettings', AdminSettingsSchema);

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@magneticnobot.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await User.create({
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin',
        role: 'admin',
        status: 'active',
      });
      console.log(`Admin user created: ${adminEmail}`);
    } else {
      console.log('Admin user already exists');
    }

    // Create default services
    const services = [
      {
        name: 'WhatsApp Bot',
        slug: 'whatsapp-bot',
        description: 'AI-powered chatbot for WhatsApp Business. Respond to customers instantly 24/7 with human-like conversations.',
        shortDescription: 'Automate WhatsApp support',
        price: 49,
        originalPrice: 79,
        features: [
          'Unlimited conversations',
          'AI-powered responses',
          'Human handoff capability',
          'Analytics dashboard',
          'Custom training data',
          '24/7 availability',
        ],
        channels: ['whatsapp'],
        icon: 'MessageCircle',
        popular: false,
        order: 1,
      },
      {
        name: 'Messenger Bot',
        slug: 'messenger-bot',
        description: 'Connect with your Facebook audience through intelligent automated responses that feel human.',
        shortDescription: 'Automate Messenger support',
        price: 49,
        originalPrice: 79,
        features: [
          'Unlimited conversations',
          'AI-powered responses',
          'Human handoff capability',
          'Analytics dashboard',
          'Custom training data',
          '24/7 availability',
        ],
        channels: ['messenger'],
        icon: 'Facebook',
        popular: false,
        order: 2,
      },
      {
        name: 'All-in-One Suite',
        slug: 'all-in-one',
        description: 'Complete customer support solution with WhatsApp, Messenger, Web Widget, and Email - all managed from one inbox.',
        shortDescription: 'All channels in one place',
        price: 99,
        originalPrice: 199,
        features: [
          'All channels included',
          'Unified inbox',
          'Advanced AI training',
          'Priority support',
          'Custom integrations',
          'Team collaboration',
          'Advanced analytics',
          'White-label option',
        ],
        channels: ['whatsapp', 'messenger', 'widget', 'email'],
        icon: 'Sparkles',
        popular: true,
        order: 3,
      },
    ];

    for (const service of services) {
      const existing = await Service.findOne({ slug: service.slug });
      if (!existing) {
        await Service.create(service);
        console.log(`Service created: ${service.name}`);
      }
    }

    // Create default admin settings
    const existingSettings = await AdminSettings.findOne({ key: 'main' });
    if (!existingSettings) {
      await AdminSettings.create({ key: 'main' });
      console.log('Admin settings created');
    }

    console.log('\nSeed completed successfully!');
    console.log(`\nAdmin Login:`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('\nIMPORTANT: Change the admin password after first login!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
