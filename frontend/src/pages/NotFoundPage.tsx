import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-page flex flex-col items-center justify-center text-center px-6">
      <span className="font-mono text-sm text-accent tracking-widest uppercase mb-2">404 Xatolik</span>
      <h1 className="font-heading font-bold text-4xl sm:text-5xl text-text-main mb-4">
        Sahifa topilmadi
      </h1>
      <p className="font-body text-text-muted text-sm sm:text-base max-w-md mb-8">
        Siz qidirayotgan sahifa mavjud emas yoki boshqa manzilga ko'chirilgan bo'lishi mumkin.
      </p>
      <Link
        to="/"
        className="btn-primary px-6 py-3 text-sm font-semibold inline-flex items-center gap-2"
      >
        <Home size={16} />
        <span>Bosh sahifaga qaytish</span>
      </Link>
    </div>
  );
};
