import { FourSquare } from 'react-loading-indicators';
import HeaderSkeleton from './components/HeaderSkeleton';

export default function Loading() {
    return (
        <>
            <HeaderSkeleton />
            <div className="flex items-center justify-center min-h-screen">
                <FourSquare color="#3147cc" size="medium" text="" textColor="" />
            </div>
        </>
    );
}
