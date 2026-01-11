import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User, Order, Workspace } from '@/lib/models';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, email, password, phone, company, items, subtotal, tax, total } = body;

    if (!name || !email || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    let isNewUser = false;

    if (!user) {
      if (!password) {
        return NextResponse.json(
          { error: 'Password is required for new users' },
          { status: 400 }
        );
      }

      const hashedPassword = await hashPassword(password);
      user = await User.create({
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        phone,
        role: 'user',
        status: 'pending',
      });
      isNewUser = true;
    }

    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD-${String(orderCount + 1).padStart(6, '0')}`;

    const order = await Order.create({
      userId: user._id,
      orderNumber,
      items: items.map((item: any) => ({
        serviceId: item.id || item.serviceId,
        serviceName: item.name || item.serviceName,
        price: item.price,
        channels: item.channels || [],
      })),
      subtotal,
      tax,
      total,
      status: 'pending',
      paymentStatus: 'pending',
      notes: company ? `Company: ${company}` : undefined,
    });

    const allChannels = items.flatMap((item: any) => item.channels || []);
    const uniqueChannels = Array.from(new Set(allChannels)) as string[];

    await Workspace.create({
      userId: user._id,
      orderId: order._id,
      name: company || `${name}'s Workspace`,
      businessName: company || '',
      allowedChannels: uniqueChannels,
      setupStep: 1,
      setupCompleted: false,
      status: 'pending',
    });

    const token = isNewUser ? generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    }) : null;

    const response = NextResponse.json({
      success: true,
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      isNewUser,
      message: 'Order placed successfully. Please wait for admin approval.',
    });

    if (token) {
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Checkout failed' },
      { status: 500 }
    );
  }
}
