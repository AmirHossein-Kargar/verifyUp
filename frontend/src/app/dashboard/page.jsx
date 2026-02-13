'use client';

import DashboardSkeleton from '@/app/components/DashboardSkeleton';
import DashboardSidebar from '@/app/components/DashboardSidebar';
import DashboardClient from './DashboardClient';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useOrders } from '@/hooks/useOrders';

export default function DashboardPage() {
    const { user, loading: authLoading, showSkeleton } = useRequireAuth();
    const { orders } = useOrders();

    if (authLoading || showSkeleton) return <DashboardSkeleton sidebarOpen={false} />;
    if (!user) return null;

    return (
        <div dir="rtl" className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <DashboardSidebar ordersCount={orders.length} />

            <div className="p-4 sm:mr-64 sm:p-6 mt-14">
                <DashboardClient user={user} />
            </div>
        </div>
    );
}
