import { Loader } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', fullScreen = false, message = '' }) => {
  const sizeMap = {
    sm: 24,
    md: 40,
    lg: 56,
  };

  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50'
    : 'flex items-center justify-center py-12';

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-3">
        <Loader
          size={sizeMap[size]}
          className="animate-spin text-primary"
        />
        {message && <p className="text-sm text-gray-500">{message}</p>}
      </div>
    </div>
  );
};
