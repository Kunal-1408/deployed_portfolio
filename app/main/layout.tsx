import { Navbarimpli } from "@/components/Nav-Final";
import {  Footerimpli } from "@/components/footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
      <>
        <Navbarimpli />
        {children}
        <Footerimpli />
      </>
    );
  }