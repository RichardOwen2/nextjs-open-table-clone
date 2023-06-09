"use client";

import { useState, createContext, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import axios from 'axios';

interface Props {
  children: React.ReactNode,
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phone: string;
}

interface AuthState {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  data: User | null;
  setData: React.Dispatch<React.SetStateAction<User | null>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AuthenticationContext = createContext<AuthState>({
  loading: true,
  setLoading: () => { },
  error: null,
  setError: () => { },
  data: null,
  setData: () => { },
});

export default function AuthContext({ children }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      const jwt = getCookie("jwt");

      if (!jwt) {
        setLoading(false);
        setData(null);
        setError(null);
        return;
      }

      const response = await axios.get("http://localhost:3000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

      setLoading(false);
      setData(response.data);
      setError(null);

    } catch (error: any) {
      setLoading(false);
      setData(null);
      setError(error.response.data.message);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [])

  const contextValue = {
    loading,
    setLoading,
    data,
    setData,
    error,
    setError
  }

  return (
    <AuthenticationContext.Provider value={contextValue}>
      {children}
    </AuthenticationContext.Provider>
  )
}
