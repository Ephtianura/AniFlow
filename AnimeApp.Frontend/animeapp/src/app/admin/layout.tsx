import React from "react";
import WhiteCard from "@/components/WhiteCard";
import { getMe } from "@/hooks/getMe";
import { UserRole } from "@/core/enums/UserRole";
import { notFound } from "next/navigation";
import AdminSidebars from "./_components/AdminSidebars";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const me = await getMe()
  if (!me || me.role != UserRole.Admin) notFound();
  
  return (
    <main className='xl:grid grid-cols-[1fr_auto] gap-8 items-start'>
      <WhiteCard>{children}</WhiteCard>
      <AdminSidebars />
    </main>
  );
}
