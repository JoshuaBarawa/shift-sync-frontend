import { AlertCircle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`flex-shrink-0 p-2 rounded-full ${
              isDangerous ? 'bg-red-100' : 'bg-yellow-100'
            }`}
          >
            <AlertCircle
              size={24}
              className={isDangerous ? 'text-red-600' : 'text-yellow-600'}
            />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-600">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition disabled:opacity-50 ${
              isDangerous
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Loading...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
