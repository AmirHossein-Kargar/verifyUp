'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/app/components/DashboardSidebar';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import DashboardSkeleton from '@/app/components/DashboardSkeleton';

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showSkeleton, setShowSkeleton] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // Show skeleton for minimum duration for smooth UX
    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => {
                setShowSkeleton(false);
            }, 800); // Show skeleton for at least 800ms
            return () => clearTimeout(timer);
        }
    }, [loading]);

    if (loading || showSkeleton) {
        return <DashboardSkeleton sidebarOpen={sidebarOpen} />;
    }

    if (!user) {
        return null;
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div
            dir="rtl"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <DashboardNavbar user={user} />
            <DashboardSidebar isOpen={sidebarOpen} />

            <div className={`p-4 mt-14 transition-all duration-300 ${sidebarOpen ? 'sm:mr-64' : 'sm:mr-0'}`}>
                {/* Sidebar Toggle Button */}
                <motion.button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="hidden sm:flex fixed top-20 z-30 items-center justify-center w-10 h-10 text-gray-500 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 transition-all duration-300"
                    style={{ right: sidebarOpen ? '260px' : '16px' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        {sidebarOpen ? (
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                        ) : (
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h10" />
                        )}
                    </svg>
                </motion.button>

                <div className="p-4 border border-gray-200 dark:border-gray-700 border-dashed rounded-lg">
                    {/* Welcome Section */}
                    <motion.div className="mb-6 text-center" variants={itemVariants}>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            خوش آمدید، {user?.name || user?.email || user?.phone}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            به داشبورد کاربری خود خوش آمدید
                        </p>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
                        variants={containerVariants}
                    >
                        <motion.div
                            className="flex flex-col items-center justify-center h-24 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                            variants={cardVariants}
                            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                        >
                            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">0</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">سفارشات فعال</p>
                        </motion.div>
                        <motion.div
                            className="flex flex-col items-center justify-center h-24 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                            variants={cardVariants}
                            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                        >
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">0</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">سفارشات تکمیل شده</p>
                        </motion.div>
                        <motion.div
                            className="flex flex-col items-center justify-center h-24 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                            variants={cardVariants}
                            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                        >
                            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">0</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">در انتظار بررسی</p>
                        </motion.div>
                    </motion.div>

                    {/* User Info Card */}
                    <motion.div
                        className="flex items-center justify-center h-48 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-4"
                        variants={itemVariants}
                    >
                        <div className="text-center">
                            <motion.div
                                className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.3
                                }}
                            >
                                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                            </motion.div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {user?.name || 'کاربر'}
                            </h3>
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                <p><span className="font-medium">ایمیل:</span> {user?.email || 'ندارد'}</p>
                                <p><span className="font-medium">شماره تلفن:</span> {user?.phone || 'ندارد'}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Actions Grid */}
                    <motion.div
                        className="grid grid-cols-2 gap-4 mb-4"
                        variants={containerVariants}
                    >
                        {[
                            { icon: "M5 12h14m-7 7V5", label: "سفارش جدید" },
                            { icon: "M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z", label: "سفارشات من" },
                            { icon: "M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z", label: "پروفایل" },
                            { icon: "M15 5v14M9 5v14M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z", label: "خدمات" }
                        ].map((action, index) => (
                            <motion.div
                                key={index}
                                className="flex flex-col items-center justify-center h-24 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                variants={cardVariants}
                                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={action.icon} />
                                </svg>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{action.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        className="flex items-center justify-center h-48 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-4"
                        variants={itemVariants}
                    >
                        <div className="text-center">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z" />
                            </svg>
                            <p className="text-gray-600 dark:text-gray-400">فعالیت اخیر</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">هنوز فعالیتی ثبت نشده است</p>
                        </div>
                    </motion.div>

                    {/* Bottom Grid */}
                    <motion.div
                        className="grid grid-cols-2 gap-4"
                        variants={containerVariants}
                    >
                        {[1, 2, 3, 4].map((i) => (
                            <motion.div
                                key={i}
                                className="flex items-center justify-center h-24 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                variants={cardVariants}
                                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                            >
                                <p className="text-gray-400">
                                    <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5" />
                                    </svg>
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
