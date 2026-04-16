"use client";

import React, { useEffect } from "react";
import AdminSidebar from "@/components/Bars/AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import WhiteCard from "./WhiteCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isLoggedIn, userRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoggedIn) return;

    if (userRole === "Admin") return; // полный доступ

    // Employee — доступ только к flights
    const employeeAllowedPaths = ["/admin/flights", "/admin/dashboard"];
    if (userRole === "Employee" && employeeAllowedPaths.includes(pathname)) return;

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
      <AdminSidebar />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

    </main>
  );
};
