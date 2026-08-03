const PROXY_URL = process.env.PROXY_URL;
const PROXY_SECRET = process.env.PROXY_SECRET;

if (!PROXY_URL) {
  throw new Error('PROXY_URL не установлен');
}

export const sendTelegramMessage = async (
  chatId: number | string,
  text: string,
) => {
  try {
    const response = await fetch(`${PROXY_URL}/api/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PROXY_SECRET}`,
      },
      body: JSON.stringify({ chatId, text }),
    });

    const data = await response.json();

    if (data.success) {
      return { success: true };
    } else {
      return { success: false, error: data.error || 'Unknown error' };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
