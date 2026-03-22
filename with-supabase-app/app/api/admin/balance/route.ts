import { NextResponse } from 'next/server';
import { getBalance, checkBalanceAlert } from '@/lib/openrouter/balance';

/**
 * GET /api/admin/balance
 * Get OpenRouter balance and check for alerts
 * This endpoint should be protected in production (add auth check)
 */
export async function GET() {
  try {
    const balance = await getBalance();
    const alert = await checkBalanceAlert(5); // Alert if balance < $5

    return NextResponse.json({
      balance: balance.balance,
      usage: balance.usage,
      limit: balance.limit,
      alert: alert.isLow ? alert.message : null,
      formatted: {
        balance: `$${balance.balance.toFixed(2)}`,
        usage: `$${balance.usage.toFixed(2)}`,
        limit: `$${balance.limit.toFixed(2)}`,
      },
    });
  } catch (error) {
    console.error('Balance check error:', error);
    return NextResponse.json(
      { error: 'Failed to get balance' },
      { status: 500 }
    );
  }
}
