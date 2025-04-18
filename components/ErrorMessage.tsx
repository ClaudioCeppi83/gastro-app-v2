import React from 'react';

interface ErrorMessageProps {
  errorMessage: string | null;
  onDismiss?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ errorMessage, onDismiss }) => {
  if (!errorMessage) {
    return null;
  }

  return (
    <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-2 rounded-md mb-2 flex items-center justify-between">
      <p>{errorMessage}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-2 bg-red-200 hover:bg-red-300 text-red-700 px-2 py-1 rounded-md text-sm"
        >
          Dismiss
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;