
import React from 'react';
import Header from '../Header';

const AccessDenied: React.FC = () => {
  return (
    <div>
      <Header title="Access Denied" />
      <div className="bg-card shadow-md rounded-xl p-12 text-center">
        <div className="mx-auto w-16 h-16 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
        </div>
        <h2 className="mt-6 text-2xl font-bold text-text-primary">Permission Required</h2>
        <p className="mt-2 text-text-secondary">
          You do not have the necessary permissions to view this page. Please contact your manager if you believe this is an error.
        </p>
      </div>
    </div>
  );
};

export default AccessDenied;
