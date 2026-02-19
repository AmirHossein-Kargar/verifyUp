import AdminLayoutClient from './AdminLayoutClient';

export const metadata = {
  title: 'پنل مدیریت',
  description: 'مدیریت سفارشات و کاربران VerifyUp.',
  robots: { index: false, follow: true },
};

export default function AdminLayout({ children }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
