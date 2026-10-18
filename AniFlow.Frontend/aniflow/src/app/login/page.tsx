import { getMe } from "@/hooks/getMe";
import LoginForm from "./LoginForm";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Вхід | AniFlow",
    description: "Увійдіть в акаунт AniFlow, щоб отримати доступ до списків, прогресу перегляду та персональних налаштувань.",
};

export default async function LoginPage() {
    const me = await getMe();
    if (me) redirect("/")

    return (
       <LoginForm/>
    );
}
