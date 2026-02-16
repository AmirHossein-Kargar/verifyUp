'use client';

import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import DashboardClient from './DashboardClient';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useOrders } from '@/hooks/useOrders';

export default function DashboardPage() {
    const { user, loading: authLoading, showSkeleton } = useRequireAuth();
    const { orders } = useOrders();

    if (authLoading || showSkeleton) return <DashboardSkeleton />;
    if (!user) return null;

    return (
        <>
            <DashboardNavbar user={user} ordersCount={orders.length} />
            <div dir="rtl" className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-20">
                <div className="p-4 max-w-7xl mx-auto">
                    <DashboardClient user={user} />
                </div>
            </div>
        </>
    );
}
