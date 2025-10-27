'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

      setError('');

  // Mock fixo — simples e direto
  const users = [
    { email: 'folgaservicarcabo@gmail.com', password: 'adm@folga', role: 'admin' },
    { email: 'equipeservicarcabo@gmail.com', password: 'servicar2025', role: 'viewer' },
  ];

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    localStorage.setItem('role', user.role);
    router.push('/calendario');
  } else {
    setError('Email ou senha incorretos.');
  }
   
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8">
           <div className="flex justify-center">
                      <Image
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsCv3swO3wdSdNmvWhkGR-1D7e-wpBSAEroA&s"
                        alt="logo posto-br"
                        width={100} 
                        height={70} 
                      />
                    </div>
          <h1 className="text-2xl font-semibold text-primary-greenbr text-center mb-8">
            Sistema de Escala Semanal
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-darkbr focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-darkbr focus:border-transparent outline-none"
                required
              />
            </div>


          {/* Exibe o erro se houver */}
          {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-primary-greenbr hover:bg-primary-darkbr text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
