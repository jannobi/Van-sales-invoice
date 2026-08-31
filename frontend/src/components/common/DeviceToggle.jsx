import React from 'react';
import { useDevice } from '../../contexts/DeviceContext';

const DeviceToggle = () => {
  const { isMobile, isDesktopMode, toggleDesktopMode } = useDevice();

  // Only show on mobile devices
  if (!isMobile) return null;

  return (
    <button
      onClick={toggleDesktopMode}
      className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-full shadow-lg transition-all duration-300 ${
        isDesktopMode 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-blue-500 hover:bg-blue-600'
      } text-white font-medium flex items-center gap-2`}
    >
      {isDesktopMode ? (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Switch to Mobile
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L15 12.75M9.75 7L15 11.25M9.75 17v-4.5M15 12.75v4.5" />
          </svg>
          Desktop Mode
        </>
      )}
    </button>
  );
};

export default DeviceToggle;
