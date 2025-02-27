import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";

import "../css/style.css";
import "../css/satoshi.css";
import "react-datepicker/dist/react-datepicker.css";
import { ReduxProvider } from "./Provider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionChecker from "../components/Sessions/SessionChecker";

// const inter = Inter({ subsets: ["latin"] });
import { Analytics } from "@vercel/analytics/react"
export const metadata: Metadata = {
  title: "Shule Yangu",
  description: "Shule Yangu is a comprehensive school management system and ERP solution designed to streamline administrative tasks, enhance student management, and improve efficiency for schools of all sizes. Manage students, teachers, exams, and reports seamlessly in one platform.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"
    suppressHydrationWarning={true}
    >
      {/* <body className={inter.className}> */}
      <body suppressHydrationWarning={true}>
      <ReduxProvider>
        <SessionChecker />
        {children}
        <Analytics />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light" 
        />
        </ReduxProvider>
        </body>
    </html>
  );
}
