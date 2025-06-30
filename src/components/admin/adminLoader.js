import React from "react";

// [SARA] : Shared admin loader overlay for admin pages
const AdminLoader = ({ loading, error, loadingMessage }) => {
  if (!loading && !error) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 p-8 bg-white/60 rounded-xl shadow-lg">
        {loading && (
          <>
            {/* [SARA] : Premium animated border spinner for loading */}
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-semibold text-blue-700">{loadingMessage || 'Loading...'}</span>
          </>
        )}
        {error && (
          <>
            {/* [SARA] : Error icon and message overlay */}
            <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
            </svg>
            <span className="text-lg font-semibold text-red-700">{error}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLoader;
