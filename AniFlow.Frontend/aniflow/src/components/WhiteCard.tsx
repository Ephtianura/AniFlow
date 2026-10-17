import { ReactNode } from "react";

interface WhiteCardProps {
  children: ReactNode;
  className?: string; 
}

export default function WhiteCard({
  children,
  className = "", 
}: WhiteCardProps) {
  return (
    <div
      className={`p-4 bg-white shadow-[0_0_10px_rgba(0,0,0,0.05)] border border-[#DFDFDF] ${className}`}
    >
      {children}
    </div>
  );
}