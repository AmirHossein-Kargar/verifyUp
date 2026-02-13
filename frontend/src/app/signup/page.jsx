'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/Toast';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGuestOnly } from '@/hooks/useAuthGuard';
import SignupSkeleton from '@/app/components/SignupSkeleton';

const ErrorText = ({ children }) =>
  children ? <p className="mt-2 text-xs text-red-500">{children}</p> : null;

export default function SignupPage() {
  const { toast, showToast, hideToast } = useToast();
  const { login } = useAuth();
  const { user, loading } = useGuestOnly();
  const router = useRouter();

  const [step, setStep] = useState('register');
  const [registeredData, setRegisteredData] = useState(null);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Determine current step number for stepper
  const getCurrentStepNumber = () => {
    if (step === 'register') return 1;
    if (step === 'verify-choice') return 2;
    if (step === 'verify-otp' || step === 'verify-email') return 3;
    return 1;
  };

  const currentStepNumber = getCurrentStepNumber();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '', terms: false },
  });

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    reset: resetOtp,
    formState: { errors: errorsOtp, isSubmitting: isSubmittingOtp },
  } = useForm({
    defaultValues: { otp: '' },
  });

  const onSubmit = async (data) => {
    try {
      const response = await api.register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      if (response.data?.requiresVerification) {
        setRegisteredData({
          email: response.data.email,
          phone: response.data.phone,
          otp: response.data.otp, // Store OTP for development
        });

        showToast(response.message || 'ثبت‌نام با موفقیت انجام شد', 'success');

        // Show OTP in development mode
        if (response.data.otp) {
          setTimeout(() => {
            showToast(`🔑 کد تایید شما: ${response.data.otp}`, 'info', 15000);
          }, 1000);
        }

        setStep('verify-choice');
      }
    } catch (error) {
      const message =
        (error && Array.isArray(error.errors) && error.errors[0]) ||
        error.message ||
        'خطا در ثبت‌ نام';
      showToast(message, 'error');
    }
  };

  const handleVerifyOtp = async (data) => {
    try {
      setIsRedirecting(true); // Show skeleton immediately

      const response = await api.verifyOtp({
        phone: registeredData.phone,
        otp: data.otp,
      });

      if (response.data?.user) {
        login(response.data.user);
        showToast(response.message || 'تأیید با موفقیت انجام شد', 'success');
        setTimeout(() => router.push('/dashboard'), 600);
      }
    } catch (error) {
      setIsRedirecting(false); // Hide skeleton on error
      const message =
        (error && Array.isArray(error.errors) && error.errors[0]) ||
        error.message ||
        'خطا در تأیید کد';
      showToast(message, 'error');
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await api.resendOtp({ phone: registeredData.phone });
      showToast('کد تأیید مجدداً ارسال شد', 'success');

      // Show new OTP in development mode
      if (response.otp) {
        setTimeout(() => {
          showToast(`🔑 کد تایید جدید: ${response.otp}`, 'info', 15000);
        }, 1000);

        // Update stored OTP
        setRegisteredData(prev => ({ ...prev, otp: response.otp }));
      }

      setOtpTimer(60);
    } catch (error) {
      showToast(error.message || 'خطا در ارسال مجدد کد', 'error');
    }
  };

  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  if (loading || user) return null;

  if (isRedirecting) return <SignupSkeleton />;

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} duration={toast.duration} />}

      <div className="min-h-screen bg-white dark:bg-gray-900" dir="rtl">
        <div className="flex min-h-screen items-center justify-center p-4 sm:pt-20">
          <div className="w-full max-w-md">
            {/* Stepper */}
            <ol className="mb-6 flex w-full items-center text-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base">
              {/* Step 1 - Register */}
              <li className={`flex items-center md:w-full after:mx-4 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] xl:after:mx-6 ${currentStepNumber >= 1 ? 'text-indigo-600 dark:text-indigo-500' : ''}`}>
                <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
                  {currentStepNumber > 1 ? (
                    <svg className="ml-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  ) : (
                    <span className="ml-2">1</span>
                  )}
                  <span className="whitespace-nowrap">ثبت‌نام</span>
                </span>
              </li>

              {/* Step 2 - Verify Choice */}
              <li className={`flex items-center md:w-full after:mx-4 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] xl:after:mx-6 ${currentStepNumber >= 2 ? 'text-indigo-600 dark:text-indigo-500' : ''}`}>
                <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
                  {currentStepNumber > 2 ? (
                    <svg className="ml-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  ) : (
                    <span className="ml-2">2</span>
                  )}
                  <span className="whitespace-nowrap">تأیید هویت</span>
                </span>
              </li>

              {/* Step 3 - Verification */}
              <li className={`flex items-center ${currentStepNumber >= 3 ? 'text-indigo-600 dark:text-indigo-500' : ''}`}>
                <span className="flex items-center">
                  {currentStepNumber > 3 ? (
                    <svg className="ml-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  ) : (
                    <span className="ml-2">3</span>
                  )}
                  <span className="whitespace-nowrap">تأیید</span>
                </span>
              </li>
            </ol>

            <motion.div
              className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >            {step === 'register' && (
              <>
                <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
                  ثبت‌نام در VerifyUp
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      نام و نام خانوادگی
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      {...register('name', {
                        required: 'نام و نام خانوادگی الزامی است',
                        minLength: { value: 3, message: 'حداقل ۳ کاراکتر وارد کنید' },
                      })}
                    />
                    <ErrorText>{errors.name?.message}</ErrorText>
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      ایمیل
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      {...register('email', {
                        required: 'ایمیل الزامی است',
                        pattern: { value: /^\S+@\S+$/i, message: 'فرمت ایمیل نامعتبر است' },
                      })}
                    />
                    <ErrorText>{errors.email?.message}</ErrorText>
                  </div>

                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      شماره موبایل
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      dir="ltr"
                      placeholder="09123456789"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      {...register('phone', {
                        required: 'شماره موبایل الزامی است',
                        pattern: { value: /^09\d{9}$/, message: 'شماره موبایل باید با 09 شروع شود و ۱۱ رقم باشد' },
                      })}
                    />
                    <ErrorText>{errors.phone?.message}</ErrorText>
                  </div>

                  <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      رمز عبور
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      {...register('password', {
                        required: 'رمز عبور الزامی است',
                        minLength: { value: 8, message: 'رمز عبور باید حداقل ۸ کاراکتر باشد' },
                      })}
                    />
                    <ErrorText>{errors.password?.message}</ErrorText>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      تکرار رمز عبور
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      {...register('confirmPassword', {
                        required: 'تکرار رمز عبور الزامی است',
                        validate: (value, formValues) => value === formValues.password || 'رمز عبور و تکرار آن یکسان نیستند',
                      })}
                    />
                    <ErrorText>{errors.confirmPassword?.message}</ErrorText>
                  </div>

                  <div className="flex items-start">
                    <input
                      id="terms"
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-gray-300 bg-gray-100 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                      {...register('terms', { required: 'پذیرش قوانین الزامی است' })}
                    />
                    <label htmlFor="terms" className="mr-2 text-sm text-gray-900 dark:text-gray-300">
                      قوانین و مقررات را می‌پذیرم
                    </label>
                  </div>
                  <ErrorText>{errors.terms?.message}</ErrorText>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-indigo-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                  >
                    {isSubmitting ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
                  </button>

                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    قبلاً ثبت‌نام کرده‌اید؟{' '}
                    <Link href="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-500">
                      ورود
                    </Link>
                  </p>
                </form>
              </>
            )}

              {step === 'verify-choice' && (
                <>
                  <h1 className="mb-4 text-center text-2xl font-bold text-gray-900 dark:text-white">
                    انتخاب روش تأیید
                  </h1>
                  <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    لطفاً یکی از روش‌های زیر را برای تأیید حساب خود انتخاب کنید
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setStep('verify-otp');
                        setOtpTimer(60);
                      }}
                      className="w-full rounded-lg border-2 border-indigo-600 bg-indigo-50 p-4 text-right hover:bg-indigo-100 dark:border-indigo-500 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40"
                    >
                      <div className="flex items-center">
                        <svg className="ml-3 h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">تأیید با پیامک (OTP)</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">کد تأیید به شماره {registeredData?.phone} ارسال می‌شود</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        showToast('لینک تأیید به ایمیل شما ارسال شد', 'success');
                        setStep('verify-email');
                      }}
                      className="w-full rounded-lg border-2 border-gray-300 bg-white p-4 text-right hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <svg className="ml-3 h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">تأیید با ایمیل</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">لینک تأیید به {registeredData?.email} ارسال می‌شود</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </>
              )}

              {step === 'verify-otp' && (
                <>
                  <h1 className="mb-4 text-center text-2xl font-bold text-gray-900 dark:text-white">
                    تأیید شماره موبایل
                  </h1>
                  <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    کد تأیید ۶ رقمی به شماره {registeredData?.phone} ارسال شد
                  </p>

                  {/* Development helper - Show OTP code */}
                  {registeredData?.otp && (
                    <div className="mb-4 rounded-lg border-2 border-dashed border-yellow-400 bg-yellow-50 p-3 dark:border-yellow-600 dark:bg-yellow-900/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                            🔑 کد تایید (حالت توسعه):
                          </span>
                          <span className="mr-2 font-mono text-lg font-bold text-yellow-900 dark:text-yellow-200">
                            {registeredData.otp}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(registeredData.otp);
                            showToast('کد کپی شد!', 'success', 2000);
                          }}
                          className="rounded bg-yellow-200 px-2 py-1 text-xs font-medium text-yellow-800 hover:bg-yellow-300 dark:bg-yellow-800 dark:text-yellow-200 dark:hover:bg-yellow-700"
                        >
                          📋 کپی
                        </button>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmitOtp(handleVerifyOtp)} className="space-y-4">
                    <div>
                      <label htmlFor="otp" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        کد تأیید
                      </label>
                      <input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        maxLength="6"
                        dir="ltr"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-lg tracking-widest text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        placeholder="••••••"
                        {...registerOtp('otp', {
                          required: 'کد تأیید الزامی است',
                          pattern: { value: /^\d{6}$/, message: 'کد تأیید باید ۶ رقم باشد' },
                        })}
                      />
                      <ErrorText>{errorsOtp.otp?.message}</ErrorText>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingOtp}
                      className="w-full rounded-lg bg-indigo-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-60"
                    >
                      {isSubmittingOtp ? 'در حال تأیید...' : 'تأیید کد'}
                    </button>

                    <div className="text-center">
                      {otpTimer > 0 ? (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ارسال مجدد کد تا {otpTimer} ثانیه دیگر
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                          ارسال مجدد کد
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep('verify-choice')}
                      className="w-full text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      بازگشت به انتخاب روش
                    </button>
                  </form>
                </>
              )}

              {step === 'verify-email' && (
                <>
                  <h1 className="mb-4 text-center text-2xl font-bold text-gray-900 dark:text-white">
                    تأیید ایمیل
                  </h1>
                  <div className="text-center">
                    <svg className="mx-auto mb-4 h-16 w-16 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                      لینک تأیید به ایمیل <span className="font-medium text-gray-900 dark:text-white">{registeredData?.email}</span> ارسال شد.
                    </p>
                    <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                      لطفاً ایمیل خود را بررسی کرده و روی لینک تأیید کلیک کنید.
                    </p>

                    <button
                      onClick={() => setStep('verify-choice')}
                      className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      بازگشت به انتخاب روش
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
