'use client';

import { motion } from 'framer-motion';

export default function Stepper({ steps, currentStep = 0 }) {
    return (
        <ol className="flex items-center w-full space-x-4 rtl:space-x-reverse mb-8 sm:mb-12">
            {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                const isLast = index === steps.length - 1;

                return (
                    <li
                        key={index}
                        className={`flex items-center ${!isLast
                            ? `w-full after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block after:ms-4 after:rounded-full ${isCompleted
                                ? 'text-fg-brand after:border-brand-subtle'
                                : 'after:border-default'
                            }`
                            : 'w-full'
                            }`}
                    >
                        <motion.span
                            className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${isCompleted
                                ? 'bg-brand-softer'
                                : 'bg-neutral-tertiary'
                                }`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ scale: 1.1 }}
                        >
                            {isCompleted ? (
                                <svg
                                    className="w-5 h-5 text-fg-brand"
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
                                        d="M5 11.917 9.724 16.5 19 7.5"
                                    />
                                </svg>
                            ) : (
                                step.icon
                            )}
                        </motion.span>
                    </li>
                );
            })}
        </ol>
    );
}
