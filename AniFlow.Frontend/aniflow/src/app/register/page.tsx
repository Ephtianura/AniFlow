import { getMe } from "@/hooks/getMe";
import { redirect } from "next/navigation";
import RegisterForm from "./RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Реєстрація | AniFlow",
    description:
        "Створіть акаунт AniFlow, щоб отримати доступ до списків аніме, відстеження перегляду та персональних налаштувань.",
};

export default async function RegisterPage() {
    const me = await getMe();
    if (me) redirect("/")

    return (
        <RegisterForm />
    );
}
