import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import QRCode from 'qrcode.react';

const QRLogin = () => {
  const { loginWithQR } = useAuth();
  const [qrCode, setQrCode] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [qrData, setQrData] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Generate QR for desktop login
  const generateQR = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      const qrData = {
        companyId: user.companyId,
        userId: user.id,
        token: token,
        timestamp: Date.now()
      };
      
      // Use electron API if available
      if (window.electronAPI) {
        const qr = await window.electronAPI.generateQR(qrData);
        setQrCode(qr);
      } else {
        // Web version
        const qr = await QRCode.toDataURL(JSON.stringify(qrData));
        setQrCode(qr);
      }
    } catch (error) {
      console.error('QR Generation Error:', error);
    }
  };

  // Scan QR for mobile login
  const startScan = () => {
    setScanning(true);
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          scanQRCode();
        }
      })
      .catch((err) => {
        console.error('Camera access denied:', err);
        setScanning(false);
      });
  };

  const scanQRCode = () => {
    if (!videoRef.current) return;
    
    // QR scanning logic using canvas
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    const scan = () => {
      if (!scanning) return;
      
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Here you would use a QR scanning library
      // For demo, we'll just show a message
      
      requestAnimationFrame(scan);
    };
    
    scan();
  };

  useEffect(() => {
    if (window.electronAPI) {
      generateQR();
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">QR Login</h2>
        
        {window.electronAPI ? (
          // Desktop - Show QR Code
          <div className="text-center">
            <p className="text-gray-600 mb-4">Scan this QR with your mobile app</p>
            <div className="bg-white p-4 rounded-lg inline-block">
              {qrCode ? (
                <img src={qrCode} alt="QR Code" className="w-64 h-64" />
              ) : (
                <div className="w-64 h-64 bg-gray-100 animate-pulse rounded"></div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-4">QR expires in 60 seconds</p>
          </div>
        ) : (
          // Mobile - Scan QR
          <div>
            {!scanning ? (
              <button
                onClick={startScan}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Scan QR Code
              </button>
            ) : (
              <div>
                <video ref={videoRef} className="w-full rounded-lg" />
                <canvas ref={canvasRef} className="hidden" />
                <button
                  onClick={() => setScanning(false)}
                  className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg"
                >
                  Stop Scanning
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QRLogin;
