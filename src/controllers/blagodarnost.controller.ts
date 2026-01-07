import { Request, Response } from "express";
import {
  upsertTodayBlagodarnost,
} from "../services/blagodarnost.service";

export async function createBlagodarnost(req: Request, res: Response) {
  const userId = req.user.id; // из auth middleware
  const { text } = req.body;

  if (!text || text.length > 1000) {
    return res.status(400).json({ message: "Invalid text" });
  }

  const result = await upsertTodayBlagodarnost(userId, text);

  res.json(result);
}
