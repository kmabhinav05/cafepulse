import React from 'react';

export default function TrafficLights({ className = '', onRedClick, onYellowClick, onGreenClick }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`} aria-hidden="true">
      <button
        type="button"
        tabIndex={-1}
        onClick={onRedClick}
        className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:opacity-80 transition-opacity focus:outline-none"
        title="Close"
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={onYellowClick}
        className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] hover:opacity-80 transition-opacity focus:outline-none"
        title="Minimize"
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={onGreenClick}
        className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] hover:opacity-80 transition-opacity focus:outline-none"
        title="Expand"
      />
    </div>
  );
}
