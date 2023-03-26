"use client";

import Link from "next/link";
import { useContext } from "react";
import LoadingButton from '@mui/lab/LoadingButton';
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { AuthenticationContext } from "../context/AuthContext";
import useAuth from "../../hooks/useAuth";

export default function NavBar() {
  const { loading, data } = useContext(AuthenticationContext);
  const { signout } = useAuth();
  const renderAuth = () => {
    if (loading) {
      return (
        <LoadingButton loading variant="outlined">
          Submit
        </LoadingButton>
      )
    }

    if (data) {
      return (
        <button
          className="bg-blue-400 text-white border p-1 px-4 rounded mr-3"
          onClick={signout}
        >
          Sign out
        </button>
      )
    } else {
      return (
        <>
          <SignIn />
          <SignUp />
        </>
      )
    }
  }

  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="" className="font-bold text-gray-700 text-2xl">
        OpenTable{" "}
      </Link>
      <div>
        <div className="flex">
          {renderAuth()}
        </div>
      </div>
    </nav>
  );
}
