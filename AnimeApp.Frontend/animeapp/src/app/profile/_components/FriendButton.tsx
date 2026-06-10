"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/core/types';
import { FaUserPlus, FaUserCheck, FaUserClock, FaUserMinus } from 'react-icons/fa6';
import { FriendshipStatus } from '@/core/enums/FriendshipStatus';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-toastify';
import { IoMdArrowDropdown } from 'react-icons/io';

interface ProfileButtonsProps {
    user: User;
}
 
export function FriendButton({ user }: ProfileButtonsProps) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (!user.friendshipStatus || user.friendshipStatus === FriendshipStatus.Me) return null;

    async function handleAddFriend() {
        try {
            await apiFetch(`/friends/request/${user.id}`, {
                method: "POST",
            });
            router.refresh();
        } catch (err: any) {
            const message = Array.isArray(err?.messages) ? err.messages.find(Boolean) : null;
            toast.error(message ?? 'Помилка при додаванні в друзі');
        }
    }

    async function handleAcceptFriendship() {
        try {
            await apiFetch(`/friends/accept/${user.id}`, {
                method: "POST",
            });
            router.refresh();
        } catch (err: any) {
            const message = Array.isArray(err?.messages) ? err.messages.find(Boolean) : null;
            toast.error(message ?? 'Помилка при прийнятті заявки');
        }
    }

    async function handleRemoveFriendship() {
        try {
            await apiFetch(`/friends/${user.id}`, {
                method: "DELETE",
            });
            setIsMenuOpen(false);
            router.refresh();
        } catch (err: any) {
            const message = Array.isArray(err?.messages) ? err.messages.find(Boolean) : null;
            toast.error(message ?? 'Помилка при видаленні зв\'язку');
        }
    }

    return (
        <div className="flex items-center gap-2 mt-4 relative">
            {/* Кнопка: Добавить в друзья */}
            {user.friendshipStatus === FriendshipStatus.None && (
                <button
                    onClick={handleAddFriend}
                    className="btn-white rounded-lg flex items-center gap-2"
                >
                    <FaUserPlus className="text-lg" />
                    <span>Додати в друзі</span>
                </button>
            )}

            {/* Кнопка: Заявка отправлена */}
            {user.friendshipStatus === FriendshipStatus.PendingFromMe && (
                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(v => !v)}
                        className="btn-white rounded-lg flex items-center gap-2"
                    >
                        <div className='flex items-center gap-2'>
                            <FaUserClock className="text-lg text-gray-400" />
                            <span>Заявку відправлено</span>
                            <IoMdArrowDropdown className='mt-0.5' />
                        </div>
                    </button>

                    {isMenuOpen && (
                        <div className="absolute top-full left-0 mt-2 min-w-full rounded-lg border border-[#DFDFDF] bg-white shadow-lg overflow-hidden z-20">
                            <button
                                onClick={handleRemoveFriendship}
                                className="btn-white rounded-lg w-full hover:bg-gray-100 transition"
                            >
                                Скасувати заявку
                            </button>
                        </div>
                    )}
                </div>
            )}

            {user.friendshipStatus === FriendshipStatus.PendingToMe && (
                <div className="relative">
                    <button onClick={() => setIsMenuOpen(v => !v)} className="btn-white rounded-lg flex items-center gap-2">
                        <div className='flex items-center gap-2'>
                            <FaUserCheck className="text-lg text-emerald-500 mt-0.5" />
                            <span>Запит у друзі</span>
                            <IoMdArrowDropdown className='mt-0.5' />
                        </div>
                    </button>

                    {isMenuOpen && (
                        <div className="absolute top-full left-0 mt-2 min-w-full flex flex-col gap-1 shadow-lg overflow-hidden z-20">
                            <button onClick={handleAcceptFriendship} className="btn-white rounded-lg hover:bg-green-50 w-full ring-0" >
                                Прийняти
                            </button>

                            <button onClick={handleRemoveFriendship} className="btn-white rounded-lg text-red-600 hover:bg-red-50 w-full ring-0">
                                Відхилити
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Кнопка: Вы друзья */}
            {user.friendshipStatus === FriendshipStatus.Friends && (
                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(v => !v)}
                        className="btn-white rounded-lg flex items-center gap-2"
                    >
                        <FaUserCheck className="text-lg text-purple-500" />
                        <div className=' flex items-center gap-2'>
                            <span>Ви друзі</span>
                            <IoMdArrowDropdown className='mt-0.5' />
                        </div>
                    </button>

                    {isMenuOpen && (
                        <div className="absolute top-full left-0 mt-2 min-w-full rounded-lg border border-[#DFDFDF] bg-white shadow-lg overflow-hidden z-20">
                            <button onClick={handleRemoveFriendship} className="btn-white rounded-lg w-full text-red-500">
                                Видалити
                            </button>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}