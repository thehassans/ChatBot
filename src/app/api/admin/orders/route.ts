import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order, User, Workspace } from '@/lib/models';
import { authenticateAdminRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateAdminRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const orders = await Order.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await authenticateAdminRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { orderId, status, adminNotes } = await request.json();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    order.status = status;
    if (adminNotes) order.adminNotes = adminNotes;

    if (status === 'approved') {
      order.approvedAt = new Date();
      order.approvedBy = user.userId;

      await User.findByIdAndUpdate(order.userId, { status: 'active' });
      await Workspace.findOneAndUpdate(
        { orderId: order._id },
        { status: 'active' }
      );
    }

    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
