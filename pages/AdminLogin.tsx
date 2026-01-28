
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onLogin: () => void;
}

const AdminLogin: React.FC<Props> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'SARKSARK') {
      onLogin();
      sessionStorage.setItem('admin_session', 'active');
      navigate('/admin');
    } else {
      alert("Fout wachtwoord");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-summaDark">
      <div className="w-full max-w-sm bg-summaWhite rounded-summa-card p-8 shadow-2xl">
        <h1 className="font-serif text-2xl text-summaIndigo mb-6 text-center">Admin Toegang</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            className="w-full px-4 py-3 rounded-summa-inner border border-gray-200 focus:outline-none focus:ring-2 focus:ring-summaIndigo"
            placeholder="Wachtwoord"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-summaIndigo text-white font-bold py-3 rounded-summa-inner hover:bg-summaBlue transition-all">
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full text-gray-500 text-sm hover:underline"
          >
            Terug
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
