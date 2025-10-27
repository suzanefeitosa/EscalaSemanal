'use client';

import Link from 'next/link';
import { useRouter,usePathname } from 'next/navigation';
import { Calendar, Users, LogOut } from 'lucide-react';
import Image from 'next/image';

interface NavbarProps {
  admin: boolean;
}

export default function Navbar({admin} : NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

   const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };


  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Image
              src="https://logodownload.org/wp-content/uploads/2014/05/petrobras-logo-0.png"
              alt="logo posto-br"
              width={100}
              height={20}
            />
          </div>

          <div className="flex space-x-6">
            <Link
              href="/calendario"
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === "/calendario"
                  ? "bg-primary-hoverbr text-primary-greenbr"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Calendário</span>
            </Link>
            {admin ? (
              <Link
                href="/funcionarios"
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === "/funcionarios"
                    ? "bg-primary-hoverbr text-primary-greenbr"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Funcionários</span>
              </Link>
            ) : (
              ""
            )}
            <button
              onClick={handleLogout}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === "/login"
                  ? "bg-teal-50 text-teal-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
