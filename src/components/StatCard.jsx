import React from 'react';

const StatCard = ({ icon: Icon, value, label, color }) => {
  const colorClasses = {
    primary: 'bg-blue-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    success: 'bg-green-500',
    info: 'bg-indigo-500',
  };

  const bgColor = colorClasses[color] || colorClasses.primary;

  return (
    <div className="relative bg-white shadow-lg rounded-xl p-5 flex flex-col items-start">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 ${bgColor}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-3xl font-extrabold text-slate-800 mb-1">{value}</div>
      <div className="text-sm text-slate-500 uppercase tracking-wider">{label}</div>
    </div>
  );
};

export default StatCard;
