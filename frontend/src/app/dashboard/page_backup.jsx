'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { formatTooman } from '@/utils/currency';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import DashboardSkeleton from '@/app/components/DashboardSkeleton';

export default function OrdersPage() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading } = useAuth();
    const [showSkeleton, setShowSkeleton] = useState(true);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
            try {
                setOrders(JSON.parse(savedOrders));
            } catch (error) {
                console.error('Failed to parse orders:', error);
            }
        }
    }, []);

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

    const navItems = [
        {
            title: 'نمای کلی',
            href: '/dashboard',
            icon: (
                <svg className="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 3v4a1 1 0 0 1-1 1H5m4 10v-2m3 2v-6m3 6v-3m4-11v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z" />
                </svg>
            ),
        },
        {
            title: 'سفارشات من',
            href: '/dashboard/orders',
            icon: (
                <svg className="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
        },
        {
            title: 'پروفایل',
            href: '/dashboard/profile',
            icon: (
                <svg className="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
            ),
        },
        {
            title: 'خدمات',
            href: '/services',
            icon: (
                <svg className="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                </svg>
            ),
        },
    ];

    const getStatusBadge = (status) => {
        const badges = {
            completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            active: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        };
        return badges[status] || badges.pending;
    };

    const getStatusText = (status) => {
        const texts = {
            completed: 'تکمیل شده',
            active: 'در حال انجام',
            pending: 'در انتظار',
            cancelled: 'لغو شده',
        };
        return texts[status] || 'نامشخص';
    };

    return (
        <div dir="rtl">
            <DashboardNavbar user={user} />

            <div className="p-4 sm:p-6 mt-14">
                <div className="md:flex gap-6">
                    <div className="flex-1 md:order-1">
                        <div className="mb-6 text-center">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">سفارشات من</h1>
                        </div>

                        {orders.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12">
                                <div className="text-center">
                                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">هنوز سفارشی ثبت نشده است</p>
                                    <Link href="/services" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                                        سفارش جدید
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                {order.logo && (
                                                    <Image src={order.logo} alt={order.title} width={48} height={48} className="object-contain" />
                                                )}
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{order.title}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{order.date}</p>
                                                    <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded ${getStatusBadge(order.status)}`}>
                                                        {getStatusText(order.status)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-left sm:text-right">
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">{formatTooman(order.price)}</p>
                                                {order.options && (
                                                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                                        {order.options.connection && <p>اتصال: {order.options.connection === 'residential' ? 'IP Residential' : 'VPS'}</p>}
                                                        {order.options.simType && <p>سیمکارت: {order.options.simType === 'physical' ? 'فیزیکی' : order.options.simType === 'virtual' ? 'مجازی' : 'دارم'}</p>}
                                                        {order.options.country && <p>کشور: {order.options.country}</p>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <ul className="flex-column space-y-2 text-sm font-medium text-body md:ms-4 mt-4 md:mt-0 md:w-48 md:order-2">
                        {navItems.map((item, index) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={index}>
                                    <Link
                                        href={item.href}
                                        className={`inline-flex items-center px-4 py-2.5 rounded-lg w-full transition-colors ${isActive
                                            ? 'text-white bg-brand'
                                            : 'hover:text-heading hover:bg-neutral-secondary-soft dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        {item.icon}
                                        {item.title}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}
