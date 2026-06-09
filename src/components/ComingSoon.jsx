import React from 'react';
import { useSearchParams } from 'react-router-dom';

const ComingSoon = () => {
  const [searchParams] = useSearchParams();
  const moduleName = searchParams.get('module') || 'This Module';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{moduleName}</h2>
        <div className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold mb-4">
          Coming Soon
        </div>
        <p className="text-gray-500">
          This module will be connected in the next CRM phase.
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
