"use client";

import React, { useEffect } from "react";
import AdminSidebar from "@/components/Bars/AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import WhiteCard from "@/components/WhiteCard";


interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isLoggedIn, userRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }

    if (userRole === "Admin") return; // полный доступ

    // всё остальное — редирект
    router.replace("/");
  }, [isLoggedIn, userRole, pathname, router]);

  if (isLoggedIn === null) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        Перевірка доступу...
      </div>
    );
  }

  return (
    <main className='lg:grid grid-cols-[1fr_auto] gap-8 items-start' >
      <WhiteCard>{children}</WhiteCard>

      <div className="w-60 xl:w-85">
        <AdminSidebar />
      </div>
      
    </main>
  );
};
