import { Telegraf } from 'telegraf';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

if (!BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN не установлен');
}

const bot = new Telegraf(BOT_TOKEN);

export const sendTelegramMessage = async (
  chatId: number | string,
  text: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    await bot.telegram.sendMessage(chatId, text, {
      parse_mode: 'HTML',
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};