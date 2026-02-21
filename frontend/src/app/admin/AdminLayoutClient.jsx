'use client';

import { useAuth } from '@/contexts/AuthContext';
import BottomNav from '@/app/components/BottomNav';
import {
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

const ADMIN_MENU_ITEMS = [
  { name: 'پنل ادمین', href: '/admin', icon: <Squares2X2Icon className="w-6 h-6" aria-hidden /> },
  { name: 'سفارشات', href: '/admin/orders', icon: <ClipboardDocumentListIcon className="w-6 h-6" aria-hidden /> },
  { name: 'کاربران', href: '/admin/users', icon: <UsersIcon className="w-6 h-6" aria-hidden /> },
];

export default function AdminLayoutClient({ children }) {
  const { user } = useAuth();

  return (
    <>
      {children}
      {user && <BottomNav items={ADMIN_MENU_ITEMS} />}
    </>
  );
}
