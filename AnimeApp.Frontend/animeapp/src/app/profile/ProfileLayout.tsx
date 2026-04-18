"use client";

import React from "react";
import ProfileSidebar from "@/components/Bars/ProfileSidebar";
import WhiteCard from "@/components/WhiteCard";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {

  return (
    <main className='lg:grid grid-cols-[1fr_auto] gap-8 items-start'>
        <WhiteCard>{children}</WhiteCard>
        <ProfileSidebar />
    </main>
  );
};
