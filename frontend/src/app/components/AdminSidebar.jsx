'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

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
  const [isOpen, setIsOpen] = useState(false);

  const isItemActive = (item) => {
    // Exact match
    if (pathname === item.match) {
      return true;
    }

    // For admin root, only match exact path
    if (item.match === '/admin') {
      return pathname === '/admin';
    }

    // For other items, check if pathname starts with match + '/'
    return pathname.startsWith(item.match + '/');
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="text-gray-900 dark:text-white bg-transparent border border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 font-medium rounded-lg ms-3 mt-3 text-sm p-2 focus:outline-none inline-flex sm:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h10" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        className={`fixed top-14 right-0 z-40 w-64 h-[calc(100vh-3.5rem)] transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} sm:translate-x-0`}
        aria-label="Admin sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
          <ul className="space-y-2 font-medium">
            {ADMIN_MENU_ITEMS.map((item) => {
              const active = isItemActive(item);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-2 py-1.5 rounded-lg group ${active
                      ? 'text-indigo-600 dark:text-indigo-400 bg-gray-100 dark:bg-gray-700'
                      : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400'
                      }`}
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
    </>
  );
}
