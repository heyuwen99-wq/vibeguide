import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db, payments, users } from '@/lib/db';
import { createPaymentUrl } from '@/lib/payment/zpay';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { amount, credits, type } = body;

    // Validate input
    if (!amount || !credits || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (type !== 'alipay' && type !== 'wxpay') {
      return NextResponse.json({ error: 'Invalid payment type' }, { status: 400 });
    }

    // Ensure user exists in database (upsert)
    await db
      .insert(users)
      .values({
        id: user.id,
        email: user.email!,
        projectCredits: 0,
      })
      .onConflictDoNothing();

    // Generate unique order number
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const outTradeNo = `VG${timestamp}${random}`;

    // Insert payment record
    await db.insert(payments).values({
      userId: user.id,
      outTradeNo,
      amount: amount.toString(),
      credits,
      type,
      status: 'pending',
    });

    // Generate payment URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const paymentUrl = await createPaymentUrl({
      outTradeNo,
      amount: amount.toString(),
      type,
      notifyUrl: `${siteUrl}/api/payment/webhook`,
      returnUrl: `${siteUrl}/my?payment=success`,
    });

    return NextResponse.json({ paymentUrl });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
