import { Blagodarnost } from "../db/models/blagodarnost";
import { formatISO } from "date-fns";

export async function upsertTodayBlagodarnost(
  userId: number,
  text: string
) {
  const today = formatISO(new Date(), { representation: "date" });

  const [record] = await Blagodarnost.upsert({
    userId,
    date: today,
    text,
  });

  return record;
}
