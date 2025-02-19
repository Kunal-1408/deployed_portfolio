"use client";

import SidebarDemo from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="grid grid-cols-5 bg-slate-50 dark:bg-neutral-700">
          <SidebarDemo />
          <main className="col-span-4">{children}
          <Toaster />
          </main>
        </div>
      </Suspense>
    </SessionProvider>
  );
}
