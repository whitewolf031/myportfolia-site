import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { login } from '../../api/client';

const loginSchema = z.object({
  username: z.string().min(1, 'Foydalanuvchi nomini kiriting.'),
  password: z.string().min(1, 'Parolni kiriting.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);
    try {
      await login(data);
      navigate('/admin');
    } catch (err: any) {
      setErrorMessage(err.message || 'Kirishda xatolik yuz berdi. Parol yoki login noto\'g\'ri.');
    }
  };

  return (
    <div className="min-h-screen bg-page flex items-center justify-center px-4">
      <div className="w-full max-w-md card-base p-8 sm:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <span className="font-mono text-2xl font-bold text-text-main tracking-wider block mb-2">
            admin<span className="text-accent">_</span>
          </span>
          <p className="font-body text-xs sm:text-sm text-text-muted">
            Boshqaruv paneliga kirish
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 mb-6 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle size={18} className="text-rose-400 mt-0.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-text-subtitle mb-1.5">
              Login (username)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <User size={16} />
              </span>
              <input
                type="text"
                disabled={isSubmitting}
                {...register('username')}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0B1736]/70 border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent"
                placeholder="admin"
              />
            </div>
            {errors.username && (
              <p className="text-xs text-rose-400 mt-1 font-body">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono text-text-subtitle mb-1.5">
              Parol
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <Lock size={16} />
              </span>
              <input
                type="password"
                disabled={isSubmitting}
                {...register('password')}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0B1736]/70 border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-rose-400 mt-1 font-body">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Tekshirilmoqda...</span>
              </>
            ) : (
              <span>Kirish</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
