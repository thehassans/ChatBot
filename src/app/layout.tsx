import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Magnetic Nobot - AI-Powered Customer Support Platform',
  description: 'Transform your customer support with AI-powered chatbots for WhatsApp, Messenger, and Web. Real human-like conversations powered by advanced AI.',
  keywords: 'customer support, chatbot, AI, WhatsApp bot, Messenger bot, live chat, customer service',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className="antialiased bg-white dark:bg-dark-950 text-gray-900 dark:text-white transition-colors duration-300">
        <Providers>
          <div className="min-h-screen">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
