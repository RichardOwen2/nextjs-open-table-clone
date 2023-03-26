import { useState } from "react";
import axios from "axios";
import { Time } from "../utils/convertToDisplayTime";

interface Props {
  slug: string;
  partySize: string;
  day: string;
  time: string;
}

interface Data {
  time: Time,
  available: boolean,
}

export default function useAvailabilities() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<Data[] | null>(null);

  const fetchAvailabilities = async ({
    slug, partySize, day, time
  }: Props) => {
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:3000/api/restaurant/${slug}/availability`, {
        params: {
          day,
          time,
          partySize,
        },
      });
      setData(response.data);
      setError(null);
    } catch (error: any) {
      setData(null);
      setError(error.response.data.message);
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, data, fetchAvailabilities };
}