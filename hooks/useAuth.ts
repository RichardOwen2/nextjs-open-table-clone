import { useContext } from "react";
import { removeCookies } from "cookies-next";
import axios from "axios";
import { AuthenticationContext } from "../app/context/AuthContext";

export default function useAuth() {
  const {
    setLoading,
    setData,
    setError,
  } = useContext(AuthenticationContext);

  const signin = async ({
    email,
    password
  }: {
    email: string;
    password: string;
  }, handleClose: () => void) => {
    setLoading(true);
    setData(null);
    setError(null);
    try {
      const response = await axios.post("http://localhost:3000/api/auth/signin", {
        email,
        password
      });
      setData(response.data);
      setError(null);
      handleClose();
    } catch (error: any) {
      setData(null)
      setError(error.response.data.message)
    } finally {
      setLoading(false);
    }
  }

  const signup = async ({
    email,
    password,
    firstName,
    lastName,
    city,
    phone,
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    city: string;
    phone: string;
  }, handleClose: () => void) => {
    setLoading(true);
    setData(null);
    setError(null);
    try {
      const response = await axios.post("http://localhost:3000/api/auth/signup", {
        email,
        password,
        firstName,
        lastName,
        city,
        phone,
      });
      setData(response.data);
      setError(null);
      handleClose();
    } catch (error: any) {
      setData(null)
      setError(error.response.data.message)
    } finally {
      setLoading(false);
    }
  }

  const signout = () => {
    removeCookies("jwt")
    setData(null);
    setError(null);
    setLoading(false);
  }

  return { signin, signup, signout };
}
