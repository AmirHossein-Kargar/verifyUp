'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ADMIN_MENU_ITEMS = [
  {
    name: 'پنل ادمین',
    href: '/admin',
    match: '/admin',
    icon: (
      <svg
        className="w-5 h-5 transition duration-75 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
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
          d="M3 12h7m4 0h7M4 7h4m8 0h4M4 17h10m2 0h4"
        />
      </svg>
    ),
  },
  {
    name: 'مدیریت سفارشات',
    href: '/admin/orders',
    match: '/admin/orders',
    icon: (
      <svg
        className="w-5 h-5 transition duration-75 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
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
          d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z"
        />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isItemActive = (item) => {
    return pathname === item.match || pathname.startsWith(item.match + '/');
  };

  return (
    <aside
      id="admin-sidebar"
      className={[
        'fixed top-14 right-0 z-40 w-64 h-[calc(100vh-3.5rem)] transition-transform duration-300',
        'translate-x-full sm:translate-x-0',
        'bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700',
      ].join(' ')}
      aria-label="Admin sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {ADMIN_MENU_ITEMS.map((item) => {
            const active = isItemActive(item);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    'flex items-center px-2 py-1.5 rounded-lg group transition-colors',
                    active
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                      : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700',
                  ].join(' ')}
                >
                  {item.icon}
                  <span className="flex-1 ms-3 whitespace-nowrap">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

