"use client";

import React, { useEffect } from "react";
import ProfileSidebar from "@/components/Bars/ProfileSidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import WhiteCard from "./WhiteCard";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {

  return (
    <main className='grid grid-cols-[1fr_auto] gap-8 items-start'>
        <WhiteCard>{children}</WhiteCard>
        <ProfileSidebar />

    </main>
  );
};
