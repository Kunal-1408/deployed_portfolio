
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbarimpli } from "@/components/Nav-Final";
import {  Footerimpli } from "@/components/footer";




const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Quiet Good Portfolio",
  description: "Your one stop for all Marketing needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
      <Navbarimpli/>
      <main>
      {children}
      </main>
        <Footerimpli />
        </body>
    </html>
  );
}