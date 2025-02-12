import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";




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
  // const pathname = usePathname()
  // const isDashboard = pathname.startsWith('/CMS')
  // console.log('Current pathname:', pathname);

  return (
    <html lang="en">
      <body className={inter.className}>
      {children}
        </body>
    </html>
  );
}
