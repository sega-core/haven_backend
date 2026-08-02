const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

if (!BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN не установлен');
}

const TELEGRAM_API_URL = 'https://telegram-bot-api.vercel.app';

export const sendTelegramMessage = async (
  chatId: number | string,
  text: string,
) => {
  try {
    const url = `${TELEGRAM_API_URL}/bot${BOT_TOKEN}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();

    if (data.ok) {
      return { success: true };
    } else {
      return { success: false, error: data.description };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
