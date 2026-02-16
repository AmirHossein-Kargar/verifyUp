'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav({ items, ordersCount = 0 }) {
    const pathname = usePathname();

    const isActive = (href) => {
        if (href === '/dashboard' || href === '/admin') {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 w-full">
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid h-16 grid-cols-4 gap-2">
                        {items.map((item, index) => {
                            const active = isActive(item.href);
                            const badgeValue = item.badgeKey === 'ordersCount' ? ordersCount : null;
                            const showBadge = typeof badgeValue === 'number' && badgeValue > 0;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative inline-flex flex-col items-center justify-center py-2 group transition-colors rounded-lg ${active
                                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <div className={active ? 'text-indigo-600 dark:text-indigo-400' : ''}>
                                        {item.icon}
                                    </div>
                                    <span className="text-xs mt-1">{item.name}</span>

                                    {showBadge && (
                                        <span className="absolute top-2 right-1/2 translate-x-1/2 inline-flex items-center justify-center min-w-[18px] h-5 px-1.5 text-xs font-semibold text-white bg-red-500 rounded-full">
                                            {badgeValue > 99 ? '99+' : badgeValue}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
