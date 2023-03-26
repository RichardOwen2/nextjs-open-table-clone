import "./globals.css";
import 'react-datepicker/dist/react-datepicker.css';

import NavBar from "./components/NavBar";
import AuthContext from "./context/AuthContext";

interface Props {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <main className="bg-gray-100 min-h-screen w-screen">
          <main className="max-w-screen-2xl m-auto bg-white">
            <AuthContext>
              <NavBar />
              {children}
            </AuthContext>
          </main>
        </main>
      </body>
    </html>
  )
}
