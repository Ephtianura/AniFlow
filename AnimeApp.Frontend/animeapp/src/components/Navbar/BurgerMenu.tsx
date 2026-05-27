"use client";

import { UserMeResponse } from "@/core/types";
import { RxHamburgerMenu } from "react-icons/rx";

type Props = {
    me: UserMeResponse | null
}
export default function BurgerMenu({ me }: Props) {

    return (
        <div>
            <RxHamburgerMenu className="w-9 h-9 active:scale-95 transition" />
        </div>
    )
}
