"use client";

import { useState, useEffect } from "react";
import { Alert } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import useInput from "../../../../hooks/useInput";
import useReservation from "../../../../hooks/useReservation";

interface Props {
  slug: string;
  partySize: string;
  date: string;
}

export default function Form({
  slug,
  partySize,
  date,
}: Props) {
  const [firstName, onFirstNameChange] = useInput();
  const [lastName, onLastNameChange] = useInput();
  const [phone, onPhoneChange] = useInput();
  const [email, onEmailChange] = useInput();
  const [ocassion, onOcassionChange] = useInput();
  const [request, onRequestChange] = useInput();

  const { loading, error, createReservation } = useReservation();
  const [didBook, setDidBook] = useState(false);
  const [disable, setDisable] = useState(true);
  const [day, time] = date.split("T");
  console.log(error)
  useEffect(() => {
    if (
      firstName && lastName && phone && email
    ) {
      setDisable(false)
    } else {
      setDisable(true)
    }
  }, [firstName, lastName, phone, email])

  const handleClick = async () => {
    await createReservation({
      slug,
      partySize,
      day,
      time,
      firstName,
      lastName,
      phone,
      email,
      ocassion,
      request,
      setDidBook
    })
  };

  if (didBook) {
    return (
      <div className="mt-10 flex flex-wrap justify-between w-[660px]">
        <h1>You are all booked up</h1>
        <p>Enjoy your reservation</p>
      </div>
    )
  }

  return (
    <div className="mt-10 flex flex-wrap justify-between w-[660px]">
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4 bg-white"
        onChange={onFirstNameChange}
        value={firstName}
        placeholder="First name"
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4 bg-white"
        onChange={onLastNameChange}
        value={lastName}
        placeholder="Last name"
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4 bg-white"
        onChange={onPhoneChange}
        value={phone}
        placeholder="Phone number"
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4 bg-white"
        onChange={onEmailChange}
        value={email}
        placeholder="Email"
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4 bg-white"
        onChange={onOcassionChange}
        value={ocassion}
        placeholder="Occasion (optional)"
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4 bg-white"
        onChange={onRequestChange}
        value={request}
        placeholder="Requests (optional)"
      />
      <button
        className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300"
        disabled={disable || loading}
        onClick={handleClick}
      >
        {loading ? <CircularProgress color="inherit" /> : "Complete reservation"}
      </button>
      <p className="mt-4 text-sm">
        By clicking “Complete reservation” you agree to the OpenTable Terms
        of Use and Privacy Policy. Standard text message rates may apply.
        You may opt out of receiving text messages at any time.
      </p>
    </div>
  )
}
