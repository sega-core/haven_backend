import crypto from 'crypto';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

if (!BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN не установлен');
}

function extractInitData(raw: string): string {
  const params = new URLSearchParams(raw);

  // если уже нормальный формат
  if (params.has('hash')) {
    return raw;
  }

  // если это launch params
  const tgWebAppData = params.get('tgWebAppData');

  if (!tgWebAppData) {
    throw new Error('Invalid Telegram launch params');
  }

  return decodeURIComponent(tgWebAppData);
}


export function validateTelegramInitData(rawInitData: string) {
  try {
    const initData = extractInitData(rawInitData);
    const params = new URLSearchParams(initData);

    const hash = params.get('hash');
    const authDate = params.get('auth_date');

    if (!hash || !authDate) {
      return { isValid: false };
    }

    // проверка срока жизни
    const now = Math.floor(Date.now() / 1000);
    if (now - Number(authDate) > 86400) {
      return { isValid: false };
    }

    const dataCheckString = [...params.entries()]
      .filter(([key]) => key !== 'hash')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(process.env.TELEGRAM_BOT_TOKEN!)
      .digest();

    const computedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (computedHash !== hash) {
      return { isValid: false };
    }

    return {
      isValid: true,
      user: params.get('user')
        ? JSON.parse(params.get('user')!)
        : null,
    };
  } catch (e) {
    return { isValid: false };
  }
}

