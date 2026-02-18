'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CountrySelect from './CountrySelect';
import { formatTooman } from '@/utils/currency';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/contexts/AuthContext';

function CheckIcon({ className = '' }) {
  return (
    <svg
      className={`w-5 h-5 shrink-0 text-fg-brand me-1.5 ${className}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

function VpnModal({ open, onClose }) {
  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm bg-black/30"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="تفاوت IP Residential و VPS"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="relative p-4 w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-neutral-primary-soft border border-default rounded-lg shadow-lg p-5">
          <div className="flex items-center justify-between border-b border-default pb-3 mb-4">
            <h3 className="text-base font-semibold leading-snug text-heading">تفاوت IP Residential و VPS</h3>
            <button
              type="button"
              className="text-sm font-medium text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-lg w-8 h-8 inline-flex justify-center items-center transition-colors duration-200 ease-out"
              onClick={onClose}
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
              </svg>
              <span className="sr-only">بستن</span>
            </button>
          </div>

          <div className="text-center mb-4">
            <p className="text-sm font-medium leading-snug text-heading">کدوم انتخاب درست‌تره؟</p>
          </div>

          <div className="space-y-3 mb-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 bg-neutral-secondary-soft rounded-lg border border-default"
            >
              <h4 className="font-semibold text-heading text-sm mb-2 flex items-center">
                <span className="text-lg me-2">🏠</span>
                IP Residential
              </h4>
              <p className="text-xs font-medium text-brand mb-2">دقیقاً مثل اینترنت یک کاربر واقعی</p>
              <p className="leading-relaxed text-body text-xs mb-3">
                این نوع IP از اینترنت خانگی واقعی ارائه می‌شود و برای پلتفرم‌ها کاملاً طبیعی و قابل اعتماد است. اگر هدفت احراز هویت بدون ریسک است، این امن‌ترین انتخاب محسوب می‌شود.
              </p>
              <div className="space-y-1.5 mb-3">
                <div className="flex items-start text-xs text-body">
                  <span className="text-success-strong me-1.5">✔</span>
                  <span>بیشترین شانس موفقیت در احراز هویت</span>
                </div>
                <div className="flex items-start text-xs text-body">
                  <span className="text-success-strong me-1.5">✔</span>
                  <span>طبیعی و غیرقابل تشخیص به‌عنوان سرور</span>
                </div>
                <div className="flex items-start text-xs text-body">
                  <span className="text-success-strong me-1.5">✔</span>
                  <span>کم‌ریسک برای حساب‌های حساس مثل Upwork</span>
                </div>
              </div>
              <div className="pt-2 border-t border-default">
                <p className="text-xs text-body">
                  <span className="font-medium text-heading">مناسب برای:</span> احراز هویت، ساخت اکانت، مراحل حساس اولیه
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-neutral-secondary-soft rounded-lg border border-default"
            >
              <h4 className="font-semibold text-heading text-sm mb-2 flex items-center">
                <span className="text-lg me-2">🖥</span>
                VPS
              </h4>
              <p className="text-xs font-medium text-brand mb-2">قدرت و کنترل کامل برای کاربر حرفه‌ای</p>
              <p className="leading-relaxed text-body text-xs mb-3">
                VPS یک سرور مجازی پرسرعت است که کنترل کامل محیط را در اختیار شما می‌گذارد. اگر بعد از احراز هویت قصد مدیریت، توسعه یا استفاده طولانی‌مدت دارید، VPS انتخاب منطقی‌تری است.
              </p>
              <div className="space-y-1.5 mb-3">
                <div className="flex items-start text-xs text-body">
                  <span className="text-success-strong me-1.5">✔</span>
                  <span>سرعت بالاتر</span>
                </div>
                <div className="flex items-start text-xs text-body">
                  <span className="text-success-strong me-1.5">✔</span>
                  <span>کنترل کامل سیستم</span>
                </div>
                <div className="flex items-start text-xs text-body">
                  <span className="text-success-strong me-1.5">✔</span>
                  <span>پایداری بیشتر در استفاده مداوم</span>
                </div>
              </div>
              <div className="pt-2 border-t border-default">
                <p className="text-xs text-body">
                  <span className="font-medium text-heading">مناسب برای:</span> مدیریت اکانت، استفاده حرفه‌ای و بلندمدت
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 bg-brand-softer border border-brand rounded-lg"
            >
              <div className="flex items-start">
                <span className="text-lg me-2 shrink-0">⭐</span>
                <div>
                  <p className="text-sm font-semibold text-fg-brand-strong mb-2">پیشنهاد VerifyUp (انتخاب هوشمندانه)</p>
                  <p className="text-xs font-medium text-heading mb-2">ترکیب هر دو برای بیشترین امنیت و نتیجه</p>
                  <p className="text-xs text-body leading-relaxed mb-3">
                    بهترین تجربه زمانی اتفاق می‌افتد که:
                  </p>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-start text-xs">
                      <span className="bg-brand text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] me-2 mt-0.5 shrink-0">۱</span>
                      <span className="text-body"><span className="font-medium text-heading">احراز هویت با IP Residential</span> انجام شود (کمترین ریسک)</span>
                    </div>
                    <div className="flex items-start text-xs">
                      <span className="bg-brand text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] me-2 mt-0.5 shrink-0">۲</span>
                      <span className="text-body"><span className="font-medium text-heading">استفاده روزمره و مدیریت با VPS</span> ادامه پیدا کند (بیشترین کنترل)</span>
                    </div>
                  </div>
                  <p className="text-xs text-body leading-relaxed">
                    این ترکیب دقیقاً همان روشی است که کاربران حرفه‌ای برای کاهش ریسک و افزایش موفقیت استفاده می‌کنند.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              type="button"
              className="text-white bg-brand border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium rounded-lg text-sm px-4 py-2 focus:outline-none transition-colors duration-200 ease-out"
            >
              متوجه شدم
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SimModal({ open, onClose }) {
  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm bg-black/30"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="تفاوت سیم‌کارت فیزیکی و مجازی"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="relative p-4 w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-neutral-primary-soft border border-default rounded-lg shadow-lg p-5">
          <div className="flex items-center justify-between border-b border-default pb-3 mb-4">
            <h3 className="text-base font-semibold leading-snug text-heading">تفاوت سیم‌کارت فیزیکی و مجازی</h3>
            <button
              type="button"
              className="text-sm font-medium text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-lg w-8 h-8 inline-flex justify-center items-center transition-colors duration-200 ease-out"
              onClick={onClose}
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
              </svg>
              <span className="sr-only">بستن</span>
            </button>
          </div>

          <div className="text-center mb-4">
            <p className="text-sm font-medium leading-snug text-heading">کدوم انتخاب مطمئن‌تره؟</p>
          </div>

          <div className="space-y-3 mb-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 bg-neutral-secondary-soft rounded-lg border border-default"
            >
              <h4 className="font-semibold text-heading text-sm mb-2 flex items-center">
                <span className="text-lg me-2">📱</span>
                سیم‌کارت فیزیکی
              </h4>
              <p className="text-xs font-medium text-brand mb-2">بالاترین سطح اعتبار و اطمینان</p>
              <p className="leading-relaxed text-body text-xs mb-3">
                سیم‌کارت فیزیکی یک شماره واقعی از اپراتور کشور مقصد است که دقیقاً مانند یک کاربر واقعی شناسایی می‌شود. این گزینه کم‌ریسک‌ترین انتخاب برای احراز هویت و حساب‌های حساس محسوب می‌شود.
              </p>
              <div className="space-y-1.5 mb-3">
                <div className="flex items-start text-xs text-body">
                  <span className="text-success-strong me-1.5">✔</span>
                  <span>بیشترین شانس موفقیت در احراز هویت</span>
                </div>
                <div className="flex items-start text-xs text-body">
                  <span className="text-success-strong me-1.5">✔</span>
                  <span>شماره واقعی و قابل‌اعتماد برای پلتفرم‌ها</span>
                </div>
                <div className="flex items-start text-xs text-body">
                  <span className="text-success-strong me-1.5">✔</span>
                  <span>قابل استفاده برای تمام سرویس‌ها بدون محدودیت</span>
                </div>
                <div className="flex items-start text-xs text-body">
                  <span className="text-success-strong me-1.5">✔</span>
                  <span>پایدار و مناسب استفاده بلندمدت</span>
                </div>
              </div>
              <div className="pt-2 border-t border-default">
                <p className="text-xs text-body">
                  <span className="font-medium text-heading">مناسب برای:</span> احراز هویت حساب‌های حساس (مثل Upwork)، استفاده طولانی‌مدت، حداکثر امنیت
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-neutral-secondary-soft rounded-lg border border-default"
            >
              <h4 className="font-semibold text-heading text-sm mb-2 flex items-center">
                <span className="text-lg me-2">☁️</span>
                سیم‌کارت مجازی (eSIM)
              </h4>
              <p className="text-xs font-medium text-brand mb-2">سریع، ساده و مقرون‌به‌صرفه</p>
              <p className="leading-relaxed text-body text-xs mb-3">
                سیم‌کارت مجازی بدون نیاز به ارسال فیزیکی فعال می‌شود و در کمترین زمان قابل استفاده است. این گزینه برای شروع سریع یا استفاده موقت مناسب است، اما ممکن است در برخی سرویس‌های حساس محدودیت داشته باشد.
              </p>
              <div className="space-y-1.5 mb-3">
                <div className="flex items-start text-xs text-body">
                  <span className="text-success-strong me-1.5">✔</span>
                  <span>فعال‌سازی فوری و بدون انتظار</span>
                </div>
                <div className="flex items-start text-xs text-body">
                  <span className="text-success-strong me-1.5">✔</span>
                  <span>هزینه کمتر نسبت به سیم‌کارت فیزیکی</span>
                </div>
                <div className="flex items-start text-xs text-body">
                  <span className="text-success-strong me-1.5">✔</span>
                  <span>بدون نیاز به دریافت کارت فیزیکی</span>
                </div>
                <div className="flex items-start text-xs text-body">
                  <span className="text-warning me-1.5">⚠</span>
                  <span>ممکن است برای برخی پلتفرم‌های حساس مناسب نباشد</span>
                </div>
              </div>
              <div className="pt-2 border-t border-default">
                <p className="text-xs text-body">
                  <span className="font-medium text-heading">مناسب برای:</span> احراز هویت سریع، تست سرویس، استفاده کوتاه‌مدت و کاهش هزینه
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 bg-brand-softer border border-brand rounded-lg"
            >
              <div className="flex items-start">
                <span className="text-lg me-2 shrink-0">⭐</span>
                <div>
                  <p className="text-sm font-semibold text-fg-brand-strong mb-2">پیشنهاد VerifyUp</p>
                  <p className="text-xs font-medium text-heading mb-3">انتخاب هوشمندانه بر اساس میزان ریسک</p>
                  <div className="space-y-2">
                    <div className="flex items-start text-xs">
                      <span className="bg-success-soft text-fg-success-strong rounded-full w-5 h-5 flex items-center justify-center text-[10px] me-2 mt-0.5 shrink-0 font-medium">✓</span>
                      <span className="text-body">اگر قصد <span className="font-medium text-heading">احراز هویت Upwork یا حساب‌های مهم</span> را دارید، سیم‌کارت فیزیکی امن‌ترین انتخاب است</span>
                    </div>
                    <div className="flex items-start text-xs">
                      <span className="bg-brand text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] me-2 mt-0.5 shrink-0">💡</span>
                      <span className="text-body">اگر هدف شما <span className="font-medium text-heading">تست، استفاده موقت یا کاهش هزینه</span> است، سیم‌کارت مجازی گزینه‌ای منطقی و سریع محسوب می‌شود</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              type="button"
              className="text-white bg-brand border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium rounded-lg text-sm px-4 py-2 focus:outline-none transition-colors duration-200 ease-out"
            >
              متوجه شدم
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function RadioCard({ name, value, checked, onChange, label }) {
  const id = `${name}-${value}`;
  return (
    <label className="flex items-center p-2.5 sm:p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors duration-200 ease-out">
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <span className="w-full ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 sm:ms-3">{label}</span>
    </label>
  );
}

function PlanCard({ config, state, onUpdate, onOpenVpnModal, onOpenSimModal, disabled, onAddToCart, isInCart }) {
  const showConnectionOptions = config.showConnectionOptions !== false;
  const showBillOption = config.showBillOption !== false;
  const showSimOptions = config.showSimOptions !== false;

  // Calculate dynamic price based on selections
  const calculatePrice = () => {
    let price = config.basePrice || config.price;

    if (config.pricing) {
      // Add connection price
      if (state.connection && config.pricing.connection?.[state.connection]) {
        price += config.pricing.connection[state.connection];
      }

      // Add bill price
      if (state.bill && config.pricing.bill) {
        price += config.pricing.bill;
      }

      // Add sim type price
      if (state.simType && config.pricing.simType?.[state.simType]) {
        price += config.pricing.simType[state.simType];
      }
    }

    return price;
  };

  const displayPrice = calculatePrice();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      className={`w-full max-w-sm p-4 sm:p-5 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 mx-auto ${disabled ? 'opacity-60' : ''
        }`}
    >
      <div className="flex flex-col items-center pb-4 sm:pb-6">
        {config.logo && (
          <div className="mb-3 mt-2">
            <Image src={config.logo} alt={config.title} width={56} height={56} className="object-contain sm:w-16 sm:h-16" />
          </div>
        )}
        {config.icon && (
          <div className="mb-3 mt-2">
            {config.icon}
          </div>
        )}
        <h5 className="mb-2 text-lg font-semibold leading-snug text-gray-900 dark:text-white text-center px-2 sm:text-xl">{config.title}</h5>
        <div className="flex items-baseline justify-center text-gray-900 dark:text-white mb-3 sm:mb-4">
          <span className="text-xl font-bold tracking-tight sm:text-2xl">{formatTooman(displayPrice)}</span>
        </div>
      </div>

      {!disabled && (
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          {/* Connection */}
          {showConnectionOptions && (
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-white">انتخاب سرویس اتصال:</p>
                <button onClick={onOpenVpnModal} type="button" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 whitespace-nowrap">
                  تفاوت چیست؟
                </button>
              </div>

              <div className="space-y-2">
                <RadioCard
                  name={`${config.id}-connection`}
                  value="residential"
                  checked={state.connection === 'residential'}
                  onChange={(v) => onUpdate({ connection: v })}
                  label="IP Residential"
                />
                <RadioCard
                  name={`${config.id}-connection`}
                  value="vps"
                  checked={state.connection === 'vps'}
                  onChange={(v) => onUpdate({ connection: v })}
                  label="VPS"
                />
              </div>
            </div>
          )}

          {/* Bill */}
          {showBillOption && (
            <label className="flex items-start p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <input
                type="checkbox"
                checked={state.bill}
                onChange={(e) => onUpdate({ bill: e.target.checked })}
                className="w-4 h-4 mt-0.5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <div className="ms-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">قبض تایید آدرس</p>
                <p className="text-sm font-normal text-gray-500 dark:text-gray-400 leading-relaxed">قبض برای تایید آدرس شما</p>
              </div>
            </label>
          )}

          {/* SIM */}
          {showSimOptions && (
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-white">انتخاب نوع سیمکارت:</p>
                <button onClick={onOpenSimModal} type="button" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 whitespace-nowrap">
                  تفاوت چیست؟
                </button>
              </div>
              <div className="space-y-2">
                <RadioCard
                  name={`${config.id}-sim`}
                  value="physical"
                  checked={state.simType === 'physical'}
                  onChange={(v) => onUpdate({ simType: v, country: '' })}
                  label="سیمکارت فیزیکی"
                />
                <RadioCard
                  name={`${config.id}-sim`}
                  value="virtual"
                  checked={state.simType === 'virtual'}
                  onChange={(v) => onUpdate({ simType: v, country: '' })}
                  label="سیمکارت مجازی"
                />
                <RadioCard
                  name={`${config.id}-sim`}
                  value="own"
                  checked={state.simType === 'own'}
                  onChange={(v) => onUpdate({ simType: v, country: '' })}
                  label="سیمکارت دارم"
                />
              </div>
            </div>
          )}

          {/* Country */}
          {showSimOptions && state.simType && state.simType !== 'own' && (
            <CountrySelect
              id={`${config.id}-country`}
              value={state.country}
              onChange={(e) => onUpdate({ country: e.target.value })}
            />
          )}
        </div>
      )}

      <ul role="list" className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        {config.features.map((f, idx) => {
          const enabled = f.enabled !== false;
          return (
            <li key={`${config.id}-feature-${idx}`} className={`flex items-center ${enabled ? '' : 'line-through'}`}>
              <svg className={`shrink-0 w-4 h-4 ${enabled ? 'text-blue-600 dark:text-blue-500' : 'text-gray-400 dark:text-gray-500'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span className={`text-sm font-normal ms-3 ${enabled ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>{f.text}</span>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        disabled={disabled || isInCart}
        className={
          disabled || isInCart
            ? 'w-full text-sm font-medium text-white bg-gray-400 cursor-not-allowed rounded-lg px-5 py-2.5 text-center'
            : 'w-full text-sm font-medium text-white bg-blue-600 rounded-lg px-5 py-2.5 text-center hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors duration-200 ease-out'
        }
        onClick={() => {
          if (disabled || isInCart) return;
          onAddToCart({
            id: `${config.id}-${Date.now()}`,
            planId: config.id,
            title: config.title,
            price: displayPrice,
            logo: config.logo,
            icon: config.icon,
            options: {
              connection: state.connection,
              bill: state.bill,
              simType: state.simType,
              country: state.country,
            },
          });
        }}
      >
        {disabled ? 'به زودی' : isInCart ? 'در سبد خرید' : 'انتخاب پلن'}
      </button>
    </motion.div>
  );
}

export default function ServicesPage() {
  const [showVpnModal, setShowVpnModal] = useState(false);
  const [showSimModal, setShowSimModal] = useState(false);
  const { addToCart, cart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const handleAddToCart = useCallback(
    (item) => {
      // If not authenticated, keep local cart behaviour and send user to login
      if (!user) {
        addToCart(item);
        showToast('برای ادامه لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
        setTimeout(() => {
          router.push('/login');
        }, 1000);
        return;
      }

      // Cart-first flow: only add to cart and stay on page
      addToCart(item);
      showToast('پلن با موفقیت به سبد خرید اضافه شد', 'success');
    },
    [user, addToCart, showToast, router]
  );

  // Check if a plan is already in cart
  const isPlanInCart = useCallback((planId) => {
    return cart.some(item => item.planId === planId);
  }, [cart]);

  const plans = useMemo(
    () => [
      {
        id: 'plan1',
        title: 'ساخت اکانت اپورک + احراز هویت',
        basePrice: 1000000,
        price: 500000,
        pricing: {
          connection: {
            residential: 300000,
            vps: 1000000,
          },
          bill: 200000,
          simType: {
            physical: 3000000,
            virtual: 1000000,
            own: 0,
          },
        },
        logo: 'https://cdn.worldvectorlogo.com/logos/upwork-roundedsquare-1.svg',
        features: [
          { text: 'ساخت اکانت اپورک جدید' },
          { text: 'احراز هویت کامل' },
          { text: 'پشتیبانی 24 ساعته' },
          { text: 'تحویل سریع' },
        ],
      },
      {
        id: 'plan2',
        title: 'مشاوره بهینه‌سازی اکانت',
        price: 790000,
        icon: (
          <svg className="w-16 h-16 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
        ),
        showConnectionOptions: false,
        showBillOption: false,
        showSimOptions: false,
        features: [
          { text: 'تحلیل وضعیت اکانت فعلی' },
          { text: 'راهنمای بهینه‌سازی پروفایل' },
          { text: 'مشاوره تخصصی' },
          { text: 'پشتیبانی ایمیل' },
        ],
      },
    ],
    []
  );

  const [form, setForm] = useState({
    plan1: { connection: '', bill: false, simType: '', country: '' },
    plan2: { connection: '', bill: false, simType: '', country: '' },
  });

  const updatePlan = useCallback((planId, patch) => {
    setForm((prev) => ({
      ...prev,
      [planId]: { ...prev[planId], ...patch },
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">خدمات ما</h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 px-4">بهترین پلن را برای نیازهای خود انتخاب کنید</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {plans.map((p) => (
            <PlanCard
              key={p.id}
              config={p}
              state={form[p.id]}
              onUpdate={(patch) => updatePlan(p.id, patch)}
              onOpenVpnModal={() => setShowVpnModal(true)}
              onOpenSimModal={() => setShowSimModal(true)}
              onAddToCart={handleAddToCart}
              isInCart={isPlanInCart(p.id)}
              disabled={false}
            />
          ))}

          {/* Plan 3 Disabled */}
          <PlanCard
            config={{
              id: 'plan3',
              title: 'اکانت پی پال',
              price: 990000,
              logo: '/paypal.svg',
              features: [
                { text: 'ساخت اکانت پی پال', enabled: false },
                { text: 'احراز هویت حساب', enabled: false },
                { text: 'پشتیبانی', enabled: false },
                { text: 'راهنمای استفاده', enabled: false },
                { text: 'تحویل سریع', enabled: false },
              ],
            }}
            state={{ connection: '', bill: false, simType: '', country: '' }}
            onUpdate={() => { }}
            onOpenVpnModal={() => { }}
            onOpenSimModal={() => { }}
            onAddToCart={() => { }}
            isInCart={false}
            disabled={true}
          />
        </div>
      </div>

      <VpnModal open={showVpnModal} onClose={() => setShowVpnModal(false)} />
      <SimModal open={showSimModal} onClose={() => setShowSimModal(false)} />
    </div>
  );
}
