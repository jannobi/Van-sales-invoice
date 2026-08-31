import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDevice } from '../../contexts/DeviceContext';

const Login = () => {
  const { login } = useAuth();
  const { toggleDesktopMode } = useDevice();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Van Sales Invoice</h2>
          <p className="text-gray-500 text-sm">Mobile Login</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
          >
            Login
          </button>
        </form>

        <button
          onClick={toggleDesktopMode}
          className="w-full mt-4 text-blue-600 text-sm font-medium"
        >
          Switch to Desktop Mode
        </button>
      </div>
    </div>
  );
};

export default Login;
