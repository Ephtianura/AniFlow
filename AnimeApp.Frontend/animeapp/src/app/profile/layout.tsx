import React from "react";
import ProfileSidebar from "@/app/profile/_components/ProfileSidebar";
import WhiteCard from "@/components/WhiteCard";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className='lg:grid grid-cols-[minmax(0,_1fr)_auto] gap-8 items-start'>
      <WhiteCard>{children}</WhiteCard>
      <ProfileSidebar />
    </main>
  );
}
