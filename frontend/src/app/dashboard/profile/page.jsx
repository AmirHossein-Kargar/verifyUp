'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';
import { useToast } from '@/hooks/useToast';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading: authLoading, showSkeleton: authSkeleton } = useRequireAuth();
    const { logout } = useAuth();
    const { showToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    if (authLoading || authSkeleton) {
        return <DashboardSkeleton />;
    }

    if (!user) {
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically make an API call to update the user profile
        showToast('پروفایل با موفقیت به‌روزرسانی شد', 'success');
        setIsEditing(false);
    };

    const handleLogout = async () => {
        await logout();
        router.replace('/');
    };

    return (
        <div dir="rtl" className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-24 pb-20">
            <div className="p-3 md:p-4 max-w-7xl mx-auto">
                <div className="flex-1">
                    <div className="mb-4 md:mb-6 text-center">
                        <h1 className="text-xl font-bold leading-tight text-gray-900 dark:text-white md:text-2xl">پروفایل کاربری</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6">
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold mb-3 md:w-24 md:h-24 md:text-2xl md:mb-4">
                                        {user?.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <h2 className="text-lg font-semibold leading-snug text-gray-900 dark:text-white mb-1 md:text-xl">{user?.name || 'کاربر'}</h2>
                                    <p className="text-sm font-normal text-gray-600 dark:text-gray-400 leading-relaxed mb-3 md:mb-4">{user?.email || user?.phone}</p>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 md:px-4 dark:focus:ring-red-800 transition-colors duration-200 ease-out"
                                    >
                                        خروج از حساب
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6">
                                <div className="flex items-center justify-between mb-4 md:mb-6">
                                    <h3 className="text-base font-semibold leading-snug text-gray-900 dark:text-white md:text-lg">اطلاعات شخصی</h3>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 md:px-4 md:py-2 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors duration-200 ease-out"
                                        >
                                            ویرایش
                                        </button>
                                    )}
                                </div>

                                {isEditing ? (
                                    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white leading-snug md:mb-2">
                                                نام و نام خانوادگی
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="bg-gray-50 border border-gray-300 text-sm font-normal text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 md:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white leading-relaxed"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white leading-snug md:mb-2">
                                                ایمیل
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="bg-gray-50 border border-gray-300 text-sm font-normal text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 md:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white leading-relaxed"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white leading-snug md:mb-2">
                                                شماره تلفن
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="bg-gray-50 border border-gray-300 text-sm font-normal text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 md:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white leading-relaxed"
                                            />
                                        </div>

                                        <div className="flex gap-2 md:gap-3">
                                            <button
                                                type="submit"
                                                className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 md:px-4 dark:focus:ring-blue-800 transition-colors duration-200 ease-out"
                                            >
                                                ذخیره تغییرات
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setFormData({
                                                        name: user.name || '',
                                                        email: user.email || '',
                                                        phone: user.phone || '',
                                                    });
                                                }}
                                                className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 md:px-4 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 ease-out"
                                            >
                                                انصراف
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-3 md:space-y-4">
                                        <div className="flex justify-between py-2 md:py-3 border-b border-gray-200 dark:border-gray-700">
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">نام و نام خانوادگی:</span>
                                            <span className="text-sm font-normal text-gray-900 dark:text-white leading-relaxed">{user?.name || 'ندارد'}</span>
                                        </div>
                                        <div className="flex justify-between py-2 md:py-3 border-b border-gray-200 dark:border-gray-700">
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">ایمیل:</span>
                                            <span className="text-sm font-normal text-gray-900 dark:text-white leading-relaxed">{user?.email || 'ندارد'}</span>
                                        </div>
                                        <div className="flex justify-between py-2 md:py-3">
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">شماره تلفن:</span>
                                            <span className="text-sm font-normal text-gray-900 dark:text-white leading-relaxed">{user?.phone || 'ندارد'}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
