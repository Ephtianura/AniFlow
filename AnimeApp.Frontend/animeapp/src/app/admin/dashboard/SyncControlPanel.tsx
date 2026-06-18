"use client"

import { useState } from 'react';
import { toast } from 'react-toastify'; 
import {
    FaDatabase,
    FaCloudDownloadAlt,
    FaPlusCircle,
    FaSync,
    FaSearchPlus
} from 'react-icons/fa';
import { apiFetch } from '@/lib/api';

export default function SyncControlPanel() {
    const [importId, setImportId] = useState<string>('');
    const [updateId, setUpdateId] = useState<string>('');
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    const handleAction = async (actionName: string, url: string, method: 'POST' | 'PATCH') => {
        setLoadingAction(actionName);
        try {
            await apiFetch(`/import/${url}`, {method});

            const successMessage = "Операція виконана успішно!";
            toast.success(successMessage);
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message || "Сталася помилка при виконанні запиту");
        } finally {
            setLoadingAction(null);
        }
    };

    return (
        <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-xs flex flex-col gap-4">
            <div>
                <h3 className="font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                    <FaSync className={loadingAction ? "animate-spin text-primary" : "text-primary"} size={16} />
                    Керування синхронізацією з MoonAPI
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Утиліти для заповнення каталогу, імпорту та оновлення релізів</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-gray-100 pt-4">

                {/* 1. Заповнення каталогу айдішками */}
                <div className="flex flex-col justify-between p-3 bg-slate-50/50 rounded-lg border border-gray-100">
                    <div className="mb-2">
                        <h4 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                            <FaDatabase size={12} className="text-gray-400" /> Dump MoonDB
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">Стягує та заповнює локальний каталог ідентифікаторами</p>
                    </div>
                    <button
                        disabled={loadingAction !== null}
                        onClick={() => handleAction('dump', 'ids/seed', 'POST')}
                        className="btn-white w-full flex items-center justify-center gap-2 text-sm"
                    >
                        Заповнити каталог ID
                    </button>
                </div>

                {/* 2. Запуск парсингу всього аніме */}
                <div className="flex flex-col justify-between p-3 bg-slate-50/50 rounded-lg border border-gray-100">
                    <div className="mb-2">
                        <h4 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                            <FaCloudDownloadAlt size={13} className="text-gray-400" /> Seed DB
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">Запускає повний фоновий процес заповнення бази з каталогу</p>
                    </div>
                    <button
                        disabled={loadingAction !== null}
                        onClick={() => handleAction('seed', 'anime/seed', 'POST')}
                        className="btn-white w-full flex items-center justify-center gap-2 text-sm"
                    >
                       Запустити повний імпорт
                    </button>
                </div>

                {/* 3. Перевірка останніх оновлень */}
                <div className="flex flex-col justify-between p-3 bg-slate-50/50 rounded-lg border border-gray-100">
                    <div className="mb-2">
                        <h4 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                            <FaSearchPlus size={12} className="text-gray-400" /> Check Updates
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">Швидка перевірка останніх змін та створення нових релізів</p>
                    </div>
                    <button
                        disabled={loadingAction !== null}
                        onClick={() => handleAction('check', 'anime/check', 'POST')}
                        className="btn-white w-full flex items-center justify-center gap-2 text-sm"
                    >
                        Перевірити оновлення
                    </button>
                </div>

                {/* 4. Імпорт по Moon Id */}
                <div className="flex flex-col justify-between p-3 bg-slate-50/50 rounded-lg border border-gray-100 lg:col-span-1 md:col-span-2">
                    <div className="mb-2">
                        <h4 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                            <FaPlusCircle size={12} className="text-emerald-500" /> Single Parse
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">Прямий точковий імпорт конкретного тайтлу за його ID</p>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Moon ID"
                            value={importId}
                            onChange={(e) => setImportId(e.target.value)}
                            className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm outline-hidden focus:border-primary w-24 text-center font-mono"
                        />
                        <button
                            disabled={loadingAction !== null || !importId}
                            onClick={() => {
                                handleAction('single-parse', `anime/${importId}`, 'POST');
                                setImportId('');
                            }}
                            className="btn-white flex-1 text-sm"
                        >
                            Імпортувати
                        </button>
                    </div>
                </div>

                {/* 5. Примусове оновлення технічних полей */}
                <div className="flex flex-col justify-between p-3 bg-slate-50/50 rounded-lg border border-gray-100 lg:col-span-2 md:col-span-2">
                    <div className="mb-2">
                        <h4 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                            <FaSync size={12} className="text-amber-500" /> Force Patch Tech Fields
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">Оновлює технічні поля аніме, якщо в MoonAPI зафіксовані свіжі зміни</p>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Moon ID"
                            value={updateId}
                            onChange={(e) => setUpdateId(e.target.value)}
                            className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm outline-hidden focus:border-primary w-24 text-center font-mono"
                        />
                        <button
                            disabled={loadingAction !== null || !updateId}
                            onClick={() => {
                                handleAction('patch-tech', `anime/${updateId}`, 'PATCH');
                                setUpdateId('');
                            }}
                            className="btn-white flex-1 text-sm"
                        >
                            Примусово оновити технічні поля
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}