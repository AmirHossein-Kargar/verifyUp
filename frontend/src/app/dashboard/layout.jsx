import DashboardLayoutClient from './DashboardLayoutClient';

export const metadata = {
  title: 'داشبورد',
  description: 'پنل کاربری، سفارشات و پروفایل VerifyUp.',
  robots: { index: false, follow: true },
};

export default function DashboardLayout({ children }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
