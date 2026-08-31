import React, { createContext, useState, useContext, useEffect } from 'react';

const DeviceContext = createContext();

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within DeviceProvider');
  }
  return context;
};

export const DeviceProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [deviceType, setDeviceType] = useState('mobile');
  const [isDesktopMode, setIsDesktopMode] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (width < 768 || isMobileDevice) {
        setIsMobile(true);
        setIsDesktop(false);
        setDeviceType('mobile');
      } else {
        setIsMobile(false);
        setIsDesktop(true);
        setDeviceType('desktop');
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Toggle Desktop Mode on Mobile
  const toggleDesktopMode = () => {
    setIsDesktopMode(!isDesktopMode);
  };

  const value = {
    isMobile,
    isDesktop,
    deviceType,
    isDesktopMode,
    toggleDesktopMode
  };

  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  );
};
