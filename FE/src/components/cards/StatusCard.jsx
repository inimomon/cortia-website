import React from 'react';

const StatusCard = ({ 
  icon: Icon, 
  label, 
  primaryProvince, 
  primaryVal, 
  secondaryProvince, 
  secondaryVal, 
  colorClass, 
  borderColor 
}) => {
  return (
    <div className={`border ${borderColor} rounded-lg p-3 bg-white flex flex-col justify-between h-full`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-3.5 h-3.5 ${colorClass}`} />
        <span className={`text-[9px] font-bold ${colorClass} tracking-wider`}>{label}</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-end border-b border-gray-50 pb-1">
          <span className="text-xs font-semibold text-gray-800">{primaryProvince}</span>
          <span className={`text-base font-bold ${colorClass} leading-none`}>{primaryVal}</span>
        </div>
        <div className="flex justify-between text-[10px] text-gray-500">
          <span>{secondaryProvince}</span>
          <span className="font-medium">{secondaryVal}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;