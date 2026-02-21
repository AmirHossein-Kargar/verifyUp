'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    PencilSquareIcon,
    PhotoIcon,
    ArrowRightOnRectangleIcon,
    IdentificationIcon,
    MapPinIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileImage } from '@/contexts/ProfileImageContext';
import ProfileSkeleton from '@/components/skeletons/ProfileSkeleton';
import { useToast } from '@/hooks/useToast';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { uploadProfileImage, api } from '@/lib/api';
import Toast from '@/components/Toast';

const ADDRESS_MAX_LENGTH = 50;

const MAX_SIZE_MB = 2;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ACCEPT_ATTR = 'image/jpeg,image/jpg,image/png,image/webp';

function validateProfileImageFile(file) {
    if (!file) return { ok: false, message: 'فایلی انتخاب نشده است.' };
    if (!ALLOWED_TYPES.includes(file.type)) {
        return { ok: false, message: 'فرمت فایل مجاز نیست. فقط jpg، jpeg، png و webp مجاز است.' };
    }
    if (file.size > MAX_SIZE_BYTES) {
        return { ok: false, message: `حجم تصویر نباید بیشتر از ${MAX_SIZE_MB} مگابایت باشد.` };
    }
    return { ok: true };
}

function UploadSpinner() {
    return (
        <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    );
}

export default function ProfilePage() {
    const router = useRouter();
    const { user: authUser, loading: authLoading, showSkeleton: authSkeleton } = useRequireAuth();
    const { user: contextUser, logout, checkAuth } = useAuth();
    const { displayUrl: profileImageDisplayUrl, setProfileImage } = useProfileImage();
    const user = contextUser ?? authUser;
    const { toast, showToast, hideToast } = useToast();
    const reduceMotion = useReducedMotion();
    const fileInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });
    const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [profileImageLoadError, setProfileImageLoadError] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
            });
        }
    }, [user]);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    useEffect(() => {
        setProfileImageLoadError(false);
    }, [profileImageDisplayUrl]);

    if (authLoading || authSkeleton || !mounted) {
        return <ProfileSkeleton />;
    }

    if (!user) {
        return null;
    }

    const displayPreview =
        previewUrl || (profileImageDisplayUrl && !profileImageLoadError ? profileImageDisplayUrl : null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        const validation = validateProfileImageFile(file);
        if (!validation.ok) {
            showToast(validation.message, 'error');
            return;
        }
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(file));
        setSelectedFile(file);
    };

    const handleSaveProfileImage = async () => {
        if (!selectedFile || uploadLoading) return;
        setUploadLoading(true);
        try {
            const res = await uploadProfileImage(selectedFile);
            const data = res?.data ?? res ?? {};
            const imageUrl = data.imageUrl ?? data.profileImage ?? null;
            const imageToken = data.imageToken ?? null;
            if (imageUrl) {
                setProfileImage(imageUrl, imageToken);
            }
            setPreviewUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return null;
            });
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            showToast('تصویر پروفایل با موفقیت ذخیره شد', 'success');
            await checkAuth();
        } catch (err) {
            const message = err?.message || 'آپلود تصویر با خطا مواجه شد';
            showToast(message, 'error');
            if (process.env.NODE_ENV !== 'production') {
                console.warn('[Profile] Upload error:', err?.status, message);
            }
        } finally {
            setUploadLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (profileUpdateLoading) return;
        const addressVal = (formData.address || '').trim();
        if (addressVal.length > ADDRESS_MAX_LENGTH) {
            showToast(`آدرس نباید بیشتر از ${ADDRESS_MAX_LENGTH} کاراکتر باشد.`, 'error');
            return;
        }
        setProfileUpdateLoading(true);
        try {
            const payload = {
                name: (formData.name || '').trim() || null,
                address: addressVal || null,
            };
            const response = await api.updateProfile(payload);

            // Update auth context with new data
            await checkAuth();

            // Update form data with response
            if (response?.data?.user) {
                setFormData({
                    name: response.data.user.name || '',
                    email: response.data.user.email || '',
                    phone: response.data.user.phone || '',
                    address: response.data.user.address || '',
                });
            }

            showToast('پروفایل با موفقیت به‌روزرسانی شد', 'success');
            setIsEditing(false);
        } catch (err) {
            const message = err?.message || 'به‌روزرسانی پروفایل با خطا مواجه شد';
            showToast(message, 'error');
        } finally {
            setProfileUpdateLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.replace('/');
    };

    const cardTransition = { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] };
    const cardInitial = reduceMotion ? false : { opacity: 0, y: 14 };
    const cardAnimate = reduceMotion ? false : { opacity: 1, y: 0 };
    const cardHover = reduceMotion ? {} : { y: -2, transition: { duration: 0.2 } };

    return (
        <div dir="rtl" className="bg-gray-50 dark:bg-gray-900 h-screen pt-20 pb-16 overflow-hidden" data-testid="profile-page">
            <div className="px-4 py-4 sm:px-6 lg:px-8 max-w-7xl mx-auto h-full overflow-y-auto">
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <UserIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                            پروفایل کاربری
                        </h1>
                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                            مدیریت اطلاعات و تصویر پروفایل
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-stretch min-h-0">
                    {/* Profile Summary Card - Right in RTL (col 3) */}
                    <div className="lg:col-start-3 lg:col-span-1 order-1 lg:order-1 flex min-h-0">
                        <motion.div
                            className="flex flex-col w-full h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden min-h-0"
                            initial={cardInitial}
                            animate={cardAnimate}
                            transition={{ ...cardTransition, delay: 0.05 }}
                            whileHover={cardHover}
                        >
                            <div className="p-6 sm:p-8 flex flex-col flex-1 items-center min-h-0">
                                <div className="mb-6 flex justify-center shrink-0">
                                    <div className="relative">
                                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-3xl sm:text-4xl font-bold shrink-0 ring-4 ring-white dark:ring-gray-800 shadow-lg" data-testid="profile-page-avatar">
                                            {displayPreview ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    key={profileImageDisplayUrl ?? 'avatar'}
                                                    src={displayPreview}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                    data-testid="profile-page-avatar-img"
                                                    onError={() => {
                                                        if (process.env.NODE_ENV !== 'production') {
                                                            console.warn('[Profile] Profile image failed to load');
                                                        }
                                                        setProfileImageLoadError(true);
                                                    }}
                                                />
                                            ) : (
                                                <span className="text-blue-600 dark:text-blue-400">
                                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept={ACCEPT_ATTR}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    aria-label="انتخاب تصویر پروفایل"
                                    disabled={uploadLoading}
                                    data-testid="profile-image-input"
                                />
                                <button
                                    type="button"
                                    data-testid="profile-image-upload-button"
                                    onClick={() => !uploadLoading && fileInputRef.current?.click()}
                                    disabled={uploadLoading}
                                    className="mb-4 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <PhotoIcon className="w-5 h-5 shrink-0" />
                                    {profileImageDisplayUrl || selectedFile ? 'تغییر تصویر' : 'آپلود تصویر'}
                                </button>
                                {selectedFile && (
                                    <button
                                        type="button"
                                        data-testid="profile-image-save-button"
                                        onClick={handleSaveProfileImage}
                                        disabled={uploadLoading}
                                        className="mb-5 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {uploadLoading ? (
                                            <>
                                                <UploadSpinner />
                                                <span>در حال آپلود...</span>
                                            </>
                                        ) : (
                                            'ذخیره تصویر'
                                        )}
                                    </button>
                                )}
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                    <UserIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" />
                                    {user?.name || 'کاربر'}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center break-all">
                                    {user?.email || user?.phone}
                                </p>
                                <div className="mt-auto w-full">
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 transition-colors"
                                    >
                                        <ArrowRightOnRectangleIcon className="w-5 h-5 shrink-0" />
                                        خروج از حساب
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Personal Information Card - Left in RTL (col 1-2) */}
                    <div className="lg:col-start-1 lg:col-span-2 order-2 lg:order-2 flex min-h-0">
                        <motion.div
                            className="flex flex-col w-full h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden min-h-0"
                            initial={cardInitial}
                            animate={cardAnimate}
                            transition={cardTransition}
                            whileHover={cardHover}
                        >
                            <div className="p-6 sm:p-8 flex flex-col flex-1 min-h-0">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                            <IdentificationIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                اطلاعات شخصی
                                            </h2>
                                            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                                                نام، ایمیل، شماره تماس و آدرس
                                            </p>
                                        </div>
                                    </div>
                                    {!isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition-colors shrink-0"
                                        >
                                            <PencilSquareIcon className="w-5 h-5 shrink-0" />
                                            ویرایش
                                        </button>
                                    )}
                                </div>

                                {isEditing ? (
                                    <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col min-h-0">
                                        <div className="space-y-5 flex-1 overflow-y-auto">
                                            <div>
                                                <label htmlFor="name" className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    <UserIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                                                    نام و نام خانوادگی
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    <EnvelopeIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                                                    ایمیل
                                                </label>
                                                <p className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg px-2.5 py-2.5" dir="ltr">
                                                    {user?.email || '—'}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">ایمیل قابل تغییر نیست</p>
                                            </div>

                                            <div>
                                                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    <PhoneIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                                                    شماره تلفن
                                                </label>
                                                <p className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg px-2.5 py-2.5" dir="ltr">
                                                    {user?.phone || '—'}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">شماره تماس قابل تغییر نیست</p>
                                            </div>

                                            <div>
                                                <label htmlFor="address" className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    <MapPinIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                                                    آدرس
                                                </label>
                                                <textarea
                                                    id="address"
                                                    rows={3}
                                                    maxLength={ADDRESS_MAX_LENGTH}
                                                    value={formData.address ?? ''}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    placeholder="آدرس پستی یا محل سکونت"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white resize-y"
                                                    data-testid="profile-address-input"
                                                />
                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    {(formData.address ?? '').length} / {ADDRESS_MAX_LENGTH}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3 pt-4 shrink-0">
                                            <button
                                                type="submit"
                                                disabled={profileUpdateLoading || (formData.address ?? '').length > ADDRESS_MAX_LENGTH}
                                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {profileUpdateLoading ? (
                                                    <>
                                                        <UploadSpinner />
                                                        <span>در حال ذخیره...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <PencilSquareIcon className="w-5 h-5 shrink-0" />
                                                        ذخیره تغییرات
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                disabled={profileUpdateLoading}
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setFormData({
                                                        name: user.name || '',
                                                        email: user.email || '',
                                                        phone: user.phone || '',
                                                        address: user.address || '',
                                                    });
                                                }}
                                                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                انصراف
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="divide-y divide-gray-200 dark:divide-gray-700 flex-1 flex flex-col min-h-0">
                                        <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5">
                                            <span className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                <UserIcon className="w-4 h-4 shrink-0" />
                                                نام و نام خانوادگی
                                            </span>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || '—'}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5">
                                            <span className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                <EnvelopeIcon className="w-4 h-4 shrink-0" />
                                                ایمیل
                                            </span>
                                            <span className="text-sm text-gray-900 dark:text-white truncate max-w-[70%] sm:max-w-none" dir="ltr">{user?.email || '—'}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5">
                                            <span className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                <PhoneIcon className="w-4 h-4 shrink-0" />
                                                شماره تلفن
                                            </span>
                                            <span className="text-sm text-gray-900 dark:text-white" dir="ltr">{user?.phone || '—'}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-start sm:justify-between sm:py-5">
                                            <span className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0">
                                                <MapPinIcon className="w-4 h-4 shrink-0" />
                                                آدرس
                                            </span>
                                            <span className="text-sm text-gray-900 dark:text-white break-words text-right sm:max-w-[70%]">{user?.address || '—'}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} duration={toast.duration} />}
        </div>
    );
}
