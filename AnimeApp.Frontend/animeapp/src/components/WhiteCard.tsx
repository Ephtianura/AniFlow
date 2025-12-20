import { ReactNode } from "react";

interface WhiteCardProps {
  children: ReactNode;
}

export default function WhiteCard({
  children,
}: WhiteCardProps) {
  return (
    <div
      className="p-4 bg-white shadow-[0_0_10px_rgba(0,0,0,0.05)] border-1 border-[#DFDFDF]">
      {children}
    </div>
  );
}
