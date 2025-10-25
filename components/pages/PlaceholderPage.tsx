
import React from 'react';
import Header from '../Header';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <div>
      <Header title={title} />
      <div className="bg-card shadow-md rounded-xl p-12 text-center">
        <div className="mx-auto w-16 h-16 text-gray-400">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 00-4.773-4.773L6.75 15.75l-2.472-2.472a3.375 3.375 0 00-4.773 4.773L3.75 21l2.472-2.472a3.375 3.375 0 004.773-4.773z" />
            </svg>
        </div>
        <h2 className="mt-6 text-2xl font-bold text-text-primary">Feature Under Construction</h2>
        <p className="mt-2 text-text-secondary">
          The "{title}" page is currently being developed. Please check back later!
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
