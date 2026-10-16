'use client';

import Link from 'next/link';
import { FaCheck } from 'react-icons/fa6';
import { PendingRequestResponse } from '@/core/types';
import { formatLastOnlineDate } from '@/app/profile/_functions/formatLastOnlineDate';

interface ExtendedRequest extends PendingRequestResponse {
    isAccepted?: boolean;
}

interface Props {
    request: ExtendedRequest;
    onAccept: (userId: number) => void;
    onDecline: (userId: number) => void;
}

export default function NotificationRequestCard({
    request,
    onAccept,
    onDecline,
}: Props) {
    return (
        <div className="p-4 border-b border-hr-clr last:border-b-0">
            <div className="flex gap-3 items-start">
                <Link href={`/user/${request.userId}`} className="relative shrink-0">
                    <img
                        src={request.avatarFileName ?? '/NotFoundPurpleSquare.webp'}
                        alt={request.nickname}
                        className="w-19 h-19 rounded-full object-cover aspect-square shrink-0 ring-3 ring-white shadow-2xl"
                    />

                    <span
                        className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white
                        ${request.isOnline ? 'bg-[#22b06e]' : 'bg-gray-400'}`}
                    />
                </Link>

                <div className="min-w-0">
                    <Link href={`/user/${request.userId}`} className="primary-link">
                        <span className="font-medium line-clamp-1">
                            {request.nickname}
                        </span>
                    </Link>

                    <span className="text-sm text-gray-600">
                        {" "}надіслав заявку в друзі{" "}
                    </span>

                    <span className="text-xs text-gray-400">
                        {formatLastOnlineDate(request.createdAt)?.text}
                    </span>

                    {request.isAccepted ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 font-medium text-sm py-1 animate-fade-in">
                            <FaCheck className="text-base" />
                            <span>Заявку прийнято</span>
                        </div>
                    ) : (
                        <div className="flex gap-2 mt-1.5">
                            <button
                                onClick={() => onAccept(request.userId)}
                                className="btn-white text-xs font-medium rounded-lg hover:bg-green-50 active:bg-green-50"
                            >
                                Прийняти
                            </button>

                            <button
                                onClick={() => onDecline(request.userId)}
                                className="btn-white text-xs font-medium rounded-lg text-red-600 hover:bg-red-50 active:bg-red-50"
                            >
                                Відхилити
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}