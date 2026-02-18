'use client';

import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';
import DashboardClient from './DashboardClient';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function DashboardPage() {
    const { user, loading: authLoading, showSkeleton } = useRequireAuth();

    if (authLoading || showSkeleton) return <DashboardSkeleton />;
    if (!user) return null;

    return (
        <div dir="rtl" className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-24 pb-20">
            <div className="p-4 max-w-7xl mx-auto">
                <DashboardClient user={user} />
            </div>
        </div>
    );
}
