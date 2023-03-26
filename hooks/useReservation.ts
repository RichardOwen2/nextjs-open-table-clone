import { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";

interface Props {
  slug: string;
  partySize: string;
  day: string;
  time: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  ocassion: string;
  request: string;
  setDidBook: Dispatch<SetStateAction<boolean>>;
}

export default function useReservation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createReservation = async ({
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
  }: Props) => {
    setLoading(true);

    try {
      console.log({
        bookerEmail: email,
        bookerPhone: phone,
        bookerFirstName: firstName,
        bookerLastName: lastName,
        bookerOccasion: ocassion,
        bookerRequest: request,
      })
      const response = await axios.post(`http://localhost:3000/api/restaurant/${slug}/reserve`, {
        bookerEmail: email,
        bookerPhone: phone,
        bookerFirstName: firstName,
        bookerLastName: lastName,
        bookerOccasion: ocassion,
        bookerRequest: request,
      }, {
        params: {
          day,
          time,
          partySize,
        },
      });
      
      setError(null);
      setDidBook(true);
      return response.data;
    } catch (error: any) {
      setError(error.response.data.message);
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, createReservation };
}