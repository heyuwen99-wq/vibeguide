/**
 * OpenRouter Balance Monitoring
 * Check credit balance and send alerts
 */

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY environment variable is not set');
}

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

/**
 * Get current OpenRouter balance
 */
export async function getBalance(): Promise<{
  balance: number;
  usage: number;
  limit: number;
}> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch balance');
    }

    const data = await response.json();

    return {
      balance: data.data?.limit_remaining || 0, // Remaining credits in USD
      usage: data.data?.usage || 0, // Total usage in USD
      limit: data.data?.limit || 0, // Credit limit in USD
    };
  } catch (error) {
    console.error('Get balance error:', error);
    throw error;
  }
}

/**
 * Check if balance is low and send alert
 */
export async function checkBalanceAlert(threshold: number = 5): Promise<{
  isLow: boolean;
  balance: number;
  message: string;
}> {
  try {
    const { balance } = await getBalance();
    const isLow = balance < threshold;

    return {
      isLow,
      balance,
      message: isLow
        ? `⚠️ OpenRouter 余额不足！当前余额：$${balance.toFixed(2)}，建议充值。`
        : `✅ OpenRouter 余额充足：$${balance.toFixed(2)}`,
    };
  } catch (error) {
    console.error('Check balance alert error:', error);
    return {
      isLow: true,
      balance: 0,
      message: '❌ 无法获取余额信息，请检查 API Key',
    };
  }
}
