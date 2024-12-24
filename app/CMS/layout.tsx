"use client"
import SidebarDemo from "@/components/sidebar";
import { SessionProvider } from "next-auth/react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
      <SessionProvider>
        <div className="grid grid-cols-5 bg-slate-50 dark:bg-neutral-700" >
          <SidebarDemo/>
          <main className="col-span-4">{children}</main>
        </div>
      </SessionProvider>
    );
  }