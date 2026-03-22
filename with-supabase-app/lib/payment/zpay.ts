import crypto from 'crypto';

if (!process.env.ZPAY_PID || !process.env.ZPAY_KEY) {
  throw new Error('ZPAY_PID and ZPAY_KEY environment variables are required');
}

const ZPAY_PID = process.env.ZPAY_PID;
const ZPAY_KEY = process.env.ZPAY_KEY;
const ZPAY_API_URL = 'https://zpayz.cn/submit.php';

export interface CreatePaymentParams {
  outTradeNo: string; // Merchant order number
  amount: string; // Amount in yuan
  type: 'alipay' | 'wxpay'; // Payment type
  notifyUrl: string; // Webhook URL
  returnUrl: string; // Return URL after payment
}

export interface PaymentNotifyParams {
  pid: string;
  trade_no: string;
  out_trade_no: string;
  type: string;
  name: string;
  money: string;
  trade_status: string;
  param?: string;
  sign: string;
  sign_type: string;
}

/**
 * Generate MD5 signature for Zpay
 * Algorithm: Sort params by key, concatenate as key=value&key=value, append KEY, then MD5
 */
function generateSign(params: Record<string, string>): string {
  // Sort params alphabetically (a-z), exclude sign and sign_type
  const sortedKeys = Object.keys(params)
    .filter(key => key !== 'sign' && key !== 'sign_type' && params[key])
    .sort();

  // Concatenate as key=value&key=value format
  const signString = sortedKeys
    .map(key => `${key}=${params[key]}`)
    .join('&') + ZPAY_KEY;

  // MD5 hash (lowercase)
  return crypto.createHash('md5').update(signString).digest('hex').toLowerCase();
}

/**
 * Create payment URL for Zpay page redirect
 */
export async function createPaymentUrl(params: CreatePaymentParams): Promise<string> {
  const requestParams: Record<string, string> = {
    pid: ZPAY_PID,
    type: params.type,
    out_trade_no: params.outTradeNo,
    notify_url: params.notifyUrl,
    return_url: params.returnUrl,
    name: 'VibeGuide 项目点数充值',
    money: params.amount,
  };

  const sign = generateSign(requestParams);

  // Build URL with query parameters
  const urlParams = new URLSearchParams({
    ...requestParams,
    sign,
    sign_type: 'MD5',
  });

  return `${ZPAY_API_URL}?${urlParams.toString()}`;
}

/**
 * Verify payment notification signature
 */
export function verifyNotify(params: PaymentNotifyParams): boolean {
  const { sign, sign_type, ...otherParams } = params;

  if (sign_type !== 'MD5') {
    return false;
  }

  // Filter out empty values
  const filteredParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(otherParams)) {
    if (value) {
      filteredParams[key] = String(value);
    }
  }

  const expectedSign = generateSign(filteredParams);
  return sign.toLowerCase() === expectedSign.toLowerCase();
}

/**
 * Parse payment notification
 */
export function parseNotify(params: PaymentNotifyParams): {
  outTradeNo: string;
  tradeNo: string;
  amount: string;
  status: 'success' | 'failed';
} {
  return {
    outTradeNo: params.out_trade_no,
    tradeNo: params.trade_no,
    amount: params.money,
    status: params.trade_status === 'TRADE_SUCCESS' ? 'success' : 'failed',
  };
}
