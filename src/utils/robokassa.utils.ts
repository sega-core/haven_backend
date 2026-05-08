import * as crypto from 'crypto';

export function createRobokassaToken(
  payload: any,
  password: string,
  merchantLogin: string,
): string {
  // 1. Создаем Header
  const header = {
    typ: 'JWT',
    alg: 'MD5',
  };

  // 2. Кодируем Header и Payload в Base64Url
  const encodedHeader = Buffer.from(JSON.stringify(header))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  const encodedPayload = Buffer.from(JSON.stringify(payload))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  // 3. Создаем подпись (исправленный метод)
  const signatureString = `${encodedHeader}.${encodedPayload}`;

  const secretKey = `${merchantLogin}:${password}`;

  const hmac = crypto.createHmac('md5', secretKey);
  hmac.update(signatureString);
  const signature = hmac
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  // 4. Собираем финальный токен
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export const createSign = (signatureString: string) => {
  return crypto
    .createHash('md5')
    .update(signatureString)
    .digest('hex')
    .toUpperCase();
};
