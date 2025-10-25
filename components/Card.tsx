import React from 'react';

interface CardProps {
  title: string;
  value: string;
  // fix: Replace `JSX.Element` with `React.ReactNode`
  icon: React.ReactNode;
  color: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-card rounded-xl shadow-md p-6 flex items-center space-x-6">
      <div className={`p-4 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
      </div>
    </div>
  );
};

export default Card;
