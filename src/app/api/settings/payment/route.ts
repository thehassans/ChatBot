import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { AdminSettings } from '@/lib/models';

export async function GET() {
  try {
    await connectDB();
    
    const settings = await AdminSettings.findOne({ key: 'main' });
    
    if (!settings || !settings.paymentConfig) {
      return NextResponse.json({
        enabledProviders: ['manual'],
        currency: 'USD',
        taxRate: 10,
      });
    }

    const enabledProviders: string[] = [];
    if (settings.paymentConfig.stripe?.enabled) enabledProviders.push('stripe');
    if (settings.paymentConfig.paypal?.enabled) enabledProviders.push('paypal');
    if (settings.paymentConfig.manualPayment?.enabled) enabledProviders.push('manual');

    return NextResponse.json({
      enabledProviders: enabledProviders.length > 0 ? enabledProviders : ['manual'],
      currency: settings.paymentConfig.currency || 'USD',
      taxRate: settings.paymentConfig.taxRate || 10,
      stripePublicKey: settings.paymentConfig.stripe?.enabled ? settings.paymentConfig.stripe.publicKey : null,
      paypalClientId: settings.paymentConfig.paypal?.enabled ? settings.paymentConfig.paypal.clientId : null,
      paypalMode: settings.paymentConfig.paypal?.mode || 'sandbox',
      manualInstructions: settings.paymentConfig.manualPayment?.instructions,
    });
  } catch (error: any) {
    console.error('Error fetching payment settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment settings' },
      { status: 500 }
    );
  }
}
