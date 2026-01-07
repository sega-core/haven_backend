// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export type AuthenticatedUser = {
  service: "telegram" | string;
  id: string | number;
  username?: string;
  first_name?: string;
  last_name?: string;
  [key: string]: any;
};

// Telegram Mini App проверка подписи
const telegramAuth = (botToken: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { query } = req;

    if (!query || !query.hash) {
      return res.status(401).json({ message: "Unauthorized: Telegram hash missing" });
    }

    const hash = query.hash as string;

    // Сортируем параметры и формируем строку для проверки
    const dataCheckString = Object.entries(query)
      .filter(([key]) => key !== "hash")
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("\n");

    const secretKey = crypto.createHmac("sha256", botToken).update("WebAppData").digest();
    const calculatedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

    if (calculatedHash !== hash) {
      return res.status(401).json({ message: "Unauthorized: Invalid Telegram signature" });
    }

    req.user = {
      service: "telegram",
      ...query,
    } as AuthenticatedUser;

    next();
  };
};

export const authMiddleware = (options: { telegramBotToken: string; vkClientId?: string; vkClientSecret?: string }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Telegram проверка
    if (req.query && req.query.hash) {
      return telegramAuth(options.telegramBotToken)(req, res, next);
    }
/* 
    if (req.headers["x-vk-token"] && options.vkClientId && options.vkClientSecret) {
      return vkAuth(options.vkClientId, options.vkClientSecret)(req, res, next);
    } */

    // Если ни один сервис не сработал
    return res.status(401).json({ message: "Unauthorized: No valid service detected" });
  };
};
