'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { apiFetch } from '@/lib/api';
import { PendingRequestResponse } from '@/core/types';
import { formatRegisterDate } from '@/app/profile/_functions/formatRegisterDate';
import { FaCheck } from 'react-icons/fa6';
import { formatLastOnlineDate } from '@/app/profile/_functions/formatLastOnlineDate';
import NotificationRequestCard from './FriendRequestCard';

interface ExtendedRequest extends PendingRequestResponse {
    isAccepted?: boolean;
}

interface Props {
    requests: PendingRequestResponse[];
    onRemoveRequest: (userId: number) => void;
    onDecrementCount: () => void;
}

export default function NotificationsDropdown({ requests, onRemoveRequest, onDecrementCount }: Props) {
    const [localRequests, setLocalRequests] = useState<ExtendedRequest[]>(requests);

    useEffect(() => {
        setLocalRequests(requests);
    }, [requests]);

    async function handleAccept(userId: number) {
        try {
            await apiFetch(`/friends/accept/${userId}`, {
                method: 'POST',
            });

            toast.success('Запит прийнято');

            const parentReq = requests.find(r => r.userId === userId);
            if (parentReq) {
                (parentReq as ExtendedRequest).isAccepted = true;
            }

            onDecrementCount();

            setLocalRequests((prev) =>
                prev.map((req) =>
                    req.userId === userId ? { ...req, isAccepted: true } : req
                )
            );
        } catch (err: any) {
            const message = Array.isArray(err?.messages) ? err.messages.find(Boolean) : null;
            toast.error(message ?? 'Помилка при прийнятті запиту');
        }
    }

    async function handleDecline(userId: number) {
        try {
            await apiFetch(`/friends/${userId}`, {
                method: 'DELETE',
            });

            toast.success('Запит відхилено');

            onRemoveRequest(userId);
            setLocalRequests((prev) => prev.filter((req) => req.userId !== userId));
        } catch (err: any) {
            const message = Array.isArray(err?.messages) ? err.messages.find(Boolean) : null;
            toast.error(message ?? 'Помилка при відхиленні запиту');
        }
    }

    return (
        <div className="absolute top-full right-0 mt-2 w-105 rounded-xl border border-hr-clr bg-white shadow-2xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-[#DFDFDF]">
                <h4 className="font-medium text-[1.5rem]">Сповіщення</h4>
            </div>

            {localRequests.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">
                    Немає нових сповіщень
                </div>
            ) : (
                <div className="max-h-125 overflow-y-auto transparent-scroll">
                    {localRequests.map((request) => (
                        <NotificationRequestCard
                            key={request.userId}
                            request={request}
                            onAccept={handleAccept}
                            onDecline={handleDecline}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}