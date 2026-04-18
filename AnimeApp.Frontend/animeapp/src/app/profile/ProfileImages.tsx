interface ProfileImagesProps {
    onEdit?: boolean | null;
    avatarUrl?: string | null;
    nickname: string;
    formattedRegistrationDate?: string | null;
}


export default function ProfileImages(props: ProfileImagesProps) {
    const { avatarUrl, nickname, formattedRegistrationDate, onEdit = false } = props;
    return (
        <div>
            {/* Постер */}
            <div className="bg-white h-100 -m-4">
                <img src="/NotFound.jpg" alt="" className=" object-cover h-full w-full" />
            </div>
            <div className="flex flex-col items-center lg:flex-row lg:gap-6">

                {/* Аватар */}
                <div className="flex flex-col gap-2">
                    <div className="w-50 -mt-20 aspect-square rounded-full ring-4 ring-white shadow-[0_0_15px_rgba(0,0,0,0.3)] overflow-hidden">
                        <img
                            src={avatarUrl ?? "/404.gif"}
                            alt="Аватар"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Інформація */}
                <div className="flex flex-col w-full items-center lg:items-start">

                    <div className="flex flex-col gap-2 py-2">
                        <p className="text-4xl font-normal">
                            {nickname}
                        </p>
                        <p className="text-sm font-normal text-gray-text">
                            на сайті з {formattedRegistrationDate}
                        </p>
                    </div>

                    <hr className="text-hr-clr w-full" />
                </div>

            </div>
        </div>
    )
}
