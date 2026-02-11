'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import DashboardSkeleton from '@/app/components/DashboardSkeleton';
import DashboardSidebar from '@/app/components/DashboardSidebar';
import { useToast } from '@/hooks/useToast';

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading, logout } = useAuth();
    const { showToast } = useToast();
    const [showSkeleton, setShowSkeleton] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => {
                setShowSkeleton(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [loading]);

    if (loading || showSkeleton) {
        return <DashboardSkeleton sidebarOpen={false} />;
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

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div dir="rtl">
            <DashboardNavbar user={user} />
            <DashboardSidebar />

            <div className="p-4 sm:mr-64 sm:p-6 mt-14">
                <div className="w-full">
                    <div className="flex-1">
                        <div className="mb-6 text-center">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">پروفایل کاربری</h1>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1">
                                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                                    <div className="flex flex-col items-center">
                                        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-4xl mb-4">
                                            {user?.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{user?.name || 'کاربر'}</h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{user?.email || user?.phone}</p>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 transition-colors"
                                        >
                                            خروج از حساب
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">اطلاعات شخصی</h3>
                                        {!isEditing && (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
                                            >
                                                ویرایش
                                            </button>
                                        )}
                                    </div>

                                    {isEditing ? (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    نام و نام خانوادگی
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    ایمیل
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    شماره تلفن
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                                />
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    type="submit"
                                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-colors"
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
                                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                                                >
                                                    انصراف
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">نام و نام خانوادگی:</span>
                                                <span className="text-sm text-gray-900 dark:text-white">{user?.name || 'ندارد'}</span>
                                            </div>
                                            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">ایمیل:</span>
                                                <span className="text-sm text-gray-900 dark:text-white">{user?.email || 'ندارد'}</span>
                                            </div>
                                            <div className="flex justify-between py-3">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">شماره تلفن:</span>
                                                <span className="text-sm text-gray-900 dark:text-white">{user?.phone || 'ندارد'}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
