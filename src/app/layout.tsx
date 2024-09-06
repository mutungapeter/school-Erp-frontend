import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import { ReduxProvider } from "./Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "School Manager",
  description: "manage school",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ReduxProvider>
        {children}
        </ReduxProvider>
        </body>
    </html>
  );
}
