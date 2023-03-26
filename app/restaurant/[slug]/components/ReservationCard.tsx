"use client";

import Link from 'next/link'
import { CircularProgress } from "@mui/material";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { partySize as partySizes, times } from "../../../../data";
import useAvailabilities from "../../../../hooks/useAvailabilities";
import useInput from "../../../../hooks/useInput";
import { convertToDisplayTime } from '../../../../utils/convertToDisplayTime';

interface Props {
  openTime: string,
  closeTime: string,
  slug: string,
}

export default function ReservationCard({
  openTime, closeTime, slug
}: Props) {
  const { loading, data, error, fetchAvailabilities } = useAvailabilities();
  const [date, setDate] = useState<Date>(new Date());
  const [time, onChangeTime] = useInput(openTime);
  const [partySize, onChangePartySize] = useInput("2");

  const handleChangeDate = (date: Date) => {
    if (date) {
      return setDate(date)
    }
  }

  const handleClick = () => {
    fetchAvailabilities({
      slug,
      day: date.toISOString().split("T")[0],
      time,
      partySize,
    });
  }

  const filterTimesByRestaurantOpenWindow = () => {
    const timeWithInWindow: typeof times = [];
    let isWithInWindow = false;

    times.forEach((time) => {
      if (time.time === openTime) {
        isWithInWindow = true;
      };
      if (isWithInWindow) {
        timeWithInWindow.push(time);
      };
      if (time.time === closeTime) {
        isWithInWindow = false;
      }
    })

    return timeWithInWindow;
  }

  return (
    <div className="fixed w-[15%] bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select name="" className="py-3 border-b font-light bg-white" id="" value={partySize} onChange={onChangePartySize}>
          {partySizes.map((size) => (
            <option key={size.value} value={size.value}>{size.label}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%] bg-white">
          <label htmlFor="">Date</label>
          <DatePicker
            selected={date}
            onChange={handleChangeDate}
            className="py-3 border-b font-light text-reg w-24"
            dateFormat="MMMM d"
            wrapperClassName="w-[48%]"
          />
        </div>
        <div className="flex flex-col w-[48%] bg-white">
          <label htmlFor="">Time</label>
          <select name="" id="" className="py-3 border-b font-light bg-white" value={time} onChange={onChangeTime}>
            {filterTimesByRestaurantOpenWindow().map((time) => (
              <option key={time.time} value={time.time}>{time.displayTime}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button
          className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? <CircularProgress color="inherit" /> : "Find a Time"}
        </button>
        {(data && data.length) && (
          <div className="mt-4">
            <div className="text-reg">Select a Time</div>
            <div className="flex flex-wrap mt-2">
              {data.map((time) => {
                if (time.available) {
                  return (
                    <Link
                      href={`/reserve/${slug}?date=${date.toISOString().split("T")[0]}T${time.time}&partySize=${partySize}`}
                      className="bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 rounded mr-3"
                    >
                      <p className="text-sm font-bold">
                        {convertToDisplayTime(time.time)}
                      </p>
                    </Link>
                  )
                }
                return (
                  <p className="bg-gray-200 p-2 w-24 rounded mr-3">
                    {""}
                  </p>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
