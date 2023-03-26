import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { times } from "../../../../data";
import { findAvailableTables } from "../../../../services/findAvailAbleTables";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { slug, day, time, partySize } = req.query as {
      slug: string;
      day: string;
      time: string;
      partySize: string;
    }

    if (!day || !time || !partySize) {
      return res.status(400).json({ message: "Invalid Data" });
    };

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
      select: {
        tables: true,
        open_time: true,
        close_time: true,
      },
    });

    if (!restaurant) {
      return res.status(400).json({ message: "Invalid Data" });
    };

    const searchTimesWithTables = await findAvailableTables({
      restaurant,
      day,
      time,
      res
    });

    if (!searchTimesWithTables) {
      return res.status(400).json({ message: "Invalid Data" });
    }



    const availabilities = searchTimesWithTables.map((t) => {
      const sumSeats = t.tables.reduce((sum, table) => {
        return sum + table.seats;
      }, 0);

      return {
        time: t.time,
        available: sumSeats >= parseInt(partySize),
      };
    }).filter((availbility) => {
      const availbilityTime = new Date(`${day}T${availbility.time}`);
      const timeIsAfterOpeningHour = availbilityTime >= new Date(`${day}T${restaurant.open_time}`);
      const timeIsBeforeClosingHour = availbilityTime <= new Date(`${day}T${restaurant.close_time}`);
      return timeIsAfterOpeningHour && timeIsBeforeClosingHour;
    });

    return res.json(availabilities)
  }
  return res.status(405).json({ message: "Method not allowed" });
}