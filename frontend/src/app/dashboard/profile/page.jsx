'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileImage } from '@/contexts/ProfileImageContext';
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';
import { useToast } from '@/hooks/useToast';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { uploadProfileImage } from '@/lib/api';
import Toast from '@/components/Toast';

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
    const fileInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [profileImageLoadError, setProfileImageLoadError] = useState(false);

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
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    useEffect(() => {
        setProfileImageLoadError(false);
    }, [profileImageDisplayUrl]);

    if (authLoading || authSkeleton) {
        return <DashboardSkeleton />;
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

    const handleSubmit = (e) => {
        e.preventDefault();
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
                                    <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white text-xl font-bold mb-3 md:w-24 md:h-24 md:text-2xl md:mb-4 shrink-0">
                                        {displayPreview ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                key={profileImageDisplayUrl ?? 'avatar'}
                                                src={displayPreview}
                                                alt=""
                                                className="w-full h-full object-cover"
                                                onError={() => {
                                                    if (process.env.NODE_ENV !== 'production') {
                                                        console.warn('[Profile] Profile image failed to load');
                                                    }
                                                    setProfileImageLoadError(true);
                                                }}
                                            />
                                        ) : (
                                            <span>{user?.name?.[0]?.toUpperCase() || 'U'}</span>
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept={ACCEPT_ATTR}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        aria-label="انتخاب تصویر پروفایل"
                                        disabled={uploadLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => !uploadLoading && fileInputRef.current?.click()}
                                        disabled={uploadLoading}
                                        className="mb-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {profileImageDisplayUrl || selectedFile ? 'تغییر تصویر' : 'آپلود تصویر'}
                                    </button>
                                    {selectedFile && (
                                        <button
                                            type="button"
                                            onClick={handleSaveProfileImage}
                                            disabled={uploadLoading}
                                            className="w-full mb-3 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ease-out flex items-center justify-center gap-2"
                                        >
                                            {uploadLoading ? (
                                                <>
                                                    <UploadSpinner />
                                                    <span>در حال آپلود...</span>
                                                </>
                                            ) : (
                                                'ذخیره تغییرات'
                                            )}
                                        </button>
                                    )}
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
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} duration={toast.duration} />}
        </div>
    );
}
