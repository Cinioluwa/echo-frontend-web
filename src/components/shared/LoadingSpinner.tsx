/**
 * Loading Spinner Components
 * Reusable loading indicators for different contexts
 */

export const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <div className="flex justify-center items-center py-8">
            <div
                className={`animate-spin rounded-full border-b-2 border-[#F49B31] ${sizeClasses[size]}`}
            />
        </div>
    );
};

export const FullPageLoader = () => (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-xl shadow-xl">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading...</p>
        </div>
    </div>
);
