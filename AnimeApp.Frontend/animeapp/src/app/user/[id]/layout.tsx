import React from "react";
import UserSidebars from "./[list]/UserSidebars";
import { getFriendsById } from "@/app/profile/_functions/getFriends";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>; 
}

export default async function UserLayout({ children, params }: LayoutProps) {
  const { id } = await params;
  const friends = await getFriendsById(id);

  return (
    <main className='lg:grid grid-cols-[minmax(0,1fr)_auto] gap-8 items-start'>
      {children}
      <UserSidebars friends={friends} userId={id} />
    </main>
  );
}
