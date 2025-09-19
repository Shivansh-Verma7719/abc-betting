import type { Metadata } from "next";
import "./globals.css";
import * as React from "react";
import LayoutWrapper from "./layoutWrapper";
import { League_Spartan, Josefin_Sans, Montserrat } from 'next/font/google'

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
})
const josefinSans = Josefin_Sans({
  subsets: ['latin'],
})

const montserrat = Montserrat({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Ashoka Business Club Betting",
  description: "Welcome to the Ashoka Business Club Betting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`
    ${leagueSpartan.className} 
    ${josefinSans.className} 
    ${montserrat.className}
    `} suppressHydrationWarning>
      <body className={`antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html >
  );
}
