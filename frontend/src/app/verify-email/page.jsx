'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/Toast';

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const { toast, showToast, hideToast } = useToast();

    const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('توکن تأیید یافت نشد');
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await api.verifyEmail({ token });

                if (response.data?.user) {
                    login(response.data.user);
                    setStatus('success');
                    setMessage(response.message || 'ایمیل با موفقیت تأیید شد');
                    showToast('ایمیل با موفقیت تأیید شد', 'success');

                    setTimeout(() => {
                        router.push('/dashboard');
                    }, 2000);
                }
            } catch (error) {
                setStatus('error');
                setMessage(error.message || 'خطا در تأیید ایمیل');
                showToast(error.message || 'خطا در تأیید ایمیل', 'error');
            }
        };

        verifyEmail();
    }, [searchParams, login, router, showToast]);

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} duration={toast.duration} />}

            <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4" dir="rtl">
                <motion.div
                    className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800 text-center"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {status === 'verifying' && (
                        <>
                            <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600 dark:border-gray-700 dark:border-t-indigo-400" />
                            <h1 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                                در حال تأیید ایمیل...
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                لطفاً صبر کنید
                            </p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <svg className="mx-auto mb-4 h-16 w-16 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h1 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                                تأیید موفق!
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {message}
                            </p>
                            <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                                در حال انتقال به پنل کاربری...
                            </p>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <svg className="mx-auto mb-4 h-16 w-16 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h1 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                                خطا در تأیید
                            </h1>
                            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                                {message}
                            </p>
                            <button
                                onClick={() => router.push('/login')}
                                className="rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                            >
                                بازگشت به صفحه ورود
                            </button>
                        </>
                    )}
                </motion.div>
            </div>
        </>
    );
}
