'use client';

import { motion } from 'framer-motion';
import {
  TRACKING_STEPS,
  getStepStatus,
  getStepTimestamp,
} from '@/lib/orderTrackingSteps';
import { formatTooman } from '@/utils/currency';

function formatTimestamp(ts) {
  if (!ts) return null;
  const d = new Date(ts);
  return d.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderTrackingStepper({ order, compact }) {
  if (!order) return null;

  const steps = TRACKING_STEPS.filter((s) => s.key !== 'rejected');
  const isRejected = order.status === 'rejected';

  return (
    <div
      className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 md:p-5"
      data-testid="order-tracking-stepper"
    >
      {!compact && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 dark:border-gray-700">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              شناسه سفارش
            </p>
            <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
              {order._id?.slice(-10)}
            </p>
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              مبلغ
            </p>
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              {formatTooman(order.priceToman || 0)}
            </p>
          </div>
        </div>
      )}

      {isRejected ? (
        <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            این سفارش رد شده است.
          </p>
          {order.adminNote && (
            <p className="mt-1 text-xs text-red-700 dark:text-red-300">
              {order.adminNote}
            </p>
          )}
        </div>
      ) : (
        <div className="relative">
          {/* Vertical timeline */}
          <div className="space-y-0">
            {steps.map((step, index) => {
              const status = getStepStatus(step.key, order);
              const timestamp = getStepTimestamp(step.key, order);
              const isLast = index === steps.length - 1;

              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-3 md:gap-4"
                >
                  {/* Line + dot */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors md:h-9 md:w-9 ${
                        status === 'completed'
                          ? 'border-green-500 bg-green-500 text-white dark:border-green-400 dark:bg-green-500'
                          : status === 'current'
                            ? 'border-indigo-500 bg-indigo-500 text-white dark:border-indigo-400 dark:bg-indigo-500'
                            : 'border-gray-200 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-500'
                      }`}
                    >
                      {status === 'completed' ? (
                        <svg
                          className="h-4 w-4 md:h-5 md:w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    {!isLast && (
                      <div
                        className={`mt-0.5 h-full min-h-[24px] w-0.5 flex-1 rounded ${
                          status === 'completed'
                            ? 'bg-green-500 dark:bg-green-400'
                            : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                      />
                    )}
                  </div>

                  {/* Label + timestamp */}
                  <div className="pb-5 md:pb-6">
                    <p
                      className={`text-sm font-medium ${
                        status === 'current'
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : status === 'completed'
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                    {timestamp && (
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {formatTimestamp(timestamp)}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
