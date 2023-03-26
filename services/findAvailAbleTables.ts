import { PrismaClient, Table } from "@prisma/client";
import { NextApiResponse } from "next";
import { times } from "../data";

const prisma = new PrismaClient();

interface Params {
  restaurant: {
    tables: Table[];
    open_time: string;
    close_time: string;
  };
  time: string;
  day: string;
  res: NextApiResponse;
}

export const findAvailableTables = async ({ restaurant, time, day, res }: Params) => {
  const searchTimes = times.find((t) => {
    return t.time === time
  })?.searchTimes;

  if (!searchTimes) {
    return res.status(400).json({ message: "Invalid Data" });
  };

  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${day}T${searchTimes[0]}`),
        lte: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`),
      }
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    }
  })

  const bookingTablesObject: {
    [key: string]: {
      [key: number]: boolean,
    }
  } = {};

  bookings.forEach((booking) => {
    bookingTablesObject[booking.booking_time.toISOString()] = booking.tables.reduce((obj, table) => {
      return {
        ...obj,
        [table.table_id]: true,
      };
    }, {});
  });

  const searchTimesWithTables = searchTimes.map((searchTime) => {
    return {
      date: new Date(`${day}T${searchTime}`),
      time: searchTime,
      tables: restaurant.tables,
    }
  });

  searchTimesWithTables.forEach((t) => {
    t.tables = t.tables.filter((table) => {
      if (bookingTablesObject[t.date.toISOString()]) {
        if (bookingTablesObject[t.date.toISOString()][table.id]) {
          return false;
        }
      }
      return true;
    })
  });

  return searchTimesWithTables;
}