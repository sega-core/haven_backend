import { Blagodarnost } from "../db/models/blagodarnost";

import { Op } from 'sequelize';
import { startOfDay, endOfDay } from 'date-fns';



export const create = async (userId: number, text: string) => {
  const record = await Blagodarnost.create({
    userId,
    text
  });

  return record;
}
export const deleteItem = async (userId: number, text: string) => {
  const record = await Blagodarnost.create({
    userId,
    text
  });

  return record;
}