import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import QRCode from 'qrcode.react';

const DesktopLogin = () => {
  const { login, loginWithQR } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const generateQR = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      const qrData = {
        companyId: user?.companyId || 'demo',
        userId: user?.id || 'demo',
        token: token || 'demo',
        timestamp: Date.now()
      };
      
      setQrCode(JSON.stringify(qrData));
      setShowQR(true);
    } catch (error) {
      console.error('QR Generation Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        {/* Left Side - Login Form */}
        <div className="p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Login to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={generateQR}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Login with QR Code
            </button>
          </div>
        </div>

        {/* Right Side - QR Code */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 flex flex-col items-center justify-center">
          <h3 className="text-white text-xl font-semibold mb-4">QR Login</h3>
          <p className="text-white/80 text-sm text-center mb-6">
            Scan this QR code with your mobile app to login instantly
          </p>
          
          <div className="bg-white p-4 rounded-xl">
            {showQR && qrCode ? (
              <QRCode value={qrCode} size={200} />
            ) : (
              <div className="w-[200px] h-[200px] bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Generate QR</span>
              </div>
            )}
          </div>
          
          <p className="text-white/60 text-xs mt-4">
            QR expires in 60 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default DesktopLogin;
