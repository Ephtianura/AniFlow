// app/admin/[...slug]/page.tsx
import AdminDashboard from "@/app/admin/dashboard/page";
import { redirect } from "next/navigation";

interface PageProps {
  params: { slug?: string[] };
}

export default function AdminCatchAll({ params }: PageProps) {
  const slug = params.slug?.[0];

  const excludedPaths = ["animes", "users", "characters", "reviews", "settings"];

  if (!slug || !excludedPaths.includes(slug)) {
    redirect("/admin/dashboard");
  }

  if (slug && excludedPaths.includes(slug)) {
    redirect(`/admin/${slug}`);
  }

  return <AdminDashboard />;
}
