import { UserRole } from "@/core/enums/UserRole";
import { UserMeResponse } from "@/core/types";
import Link from "next/link";

type Props = {
    me: UserMeResponse | null
}
export default function AdminButton({ me }: Props) {
    return (
        <>
            {me?.role === UserRole.Admin && (
                <div>
                    <Link
                        href="/admin/dashboard"
                        className="nav-button"
                    >
                        Адмін-панель
                    </Link>
                </div>
            )}
        </>
    )
}
