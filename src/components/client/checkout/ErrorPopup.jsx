import React from 'react';

const ErrorPopup = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-red-600">Error</h3>
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close error popup"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className="text-gray-700 mb-4">{message}</p>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default ErrorPopup;