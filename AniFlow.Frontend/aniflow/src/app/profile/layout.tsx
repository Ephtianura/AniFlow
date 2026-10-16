import React from "react";
import ProfileSidebars from "@/app/profile/_components/ProfileSidebars";
import WhiteCard from "@/components/WhiteCard";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className='lg:grid grid-cols-[minmax(0,1fr)_auto] gap-8 items-start'>
      <WhiteCard>{children}</WhiteCard>
      <ProfileSidebars />
    </main>
  );
}
