import { NextRequest, NextResponse } from 'next/server';
import { db, payments, users } from '@/lib/db';
import { verifyNotify, parseNotify, type PaymentNotifyParams } from '@/lib/payment/zpay';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const notifyParams: PaymentNotifyParams = {
      pid: searchParams.get('pid') || '',
      trade_no: searchParams.get('trade_no') || '',
      out_trade_no: searchParams.get('out_trade_no') || '',
      type: searchParams.get('type') || '',
      name: searchParams.get('name') || '',
      money: searchParams.get('money') || '',
      trade_status: searchParams.get('trade_status') || '',
      sign: searchParams.get('sign') || '',
      sign_type: searchParams.get('sign_type') || '',
    };

    // Verify signature
    if (!verifyNotify(notifyParams)) {
      console.error('Invalid payment notification signature');
      return new NextResponse('fail', { status: 400 });
    }

    // Parse notification
    const { outTradeNo, tradeNo, amount, status } = parseNotify(notifyParams);

    if (status !== 'success') {
      console.log('Payment not successful:', status);
      return new NextResponse('success', { status: 200 });
    }

    // Find the payment record
    const paymentRecords = await db
      .select()
      .from(payments)
      .where(eq(payments.outTradeNo, outTradeNo))
      .limit(1);

    if (paymentRecords.length === 0) {
      console.error('Payment record not found:', outTradeNo);
      return new NextResponse('fail', { status: 404 });
    }

    const payment = paymentRecords[0];

    // Check if already processed
    if (payment.status === 'success') {
      console.log('Payment already processed:', outTradeNo);
      return new NextResponse('success', { status: 200 });
    }

    // Update payment and user credits in a transaction
    await db.transaction(async (tx) => {
      // Update payment status
      await tx
        .update(payments)
        .set({
          status: 'success',
          tradeNo,
          updatedAt: new Date(),
        })
        .where(eq(payments.outTradeNo, outTradeNo));

      // Get current user credits
      const userRecords = await tx
        .select()
        .from(users)
        .where(eq(users.id, payment.userId))
        .limit(1);

      if (userRecords.length > 0) {
        const currentCredits = userRecords[0].projectCredits;

        // Update user credits
        await tx
          .update(users)
          .set({
            projectCredits: currentCredits + payment.credits,
            updatedAt: new Date(),
          })
          .where(eq(users.id, payment.userId));
      }
    });

    console.log('Payment processed successfully:', outTradeNo);
    return new NextResponse('success', { status: 200 });
  } catch (error) {
    console.error('Payment webhook error:', error);
    return new NextResponse('fail', { status: 500 });
  }
}

// Also support POST for webhook
export async function POST(request: NextRequest) {
  return GET(request);
}
