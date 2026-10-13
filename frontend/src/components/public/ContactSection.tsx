import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle2, AlertCircle, Loader2, SendHorizontal, Mail, Github } from 'lucide-react';
import { Profile } from '../../types';
import { submitContact } from '../../api/client';

const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Ismingizni kiriting.")
    .max(80, "Ism 80 belgidan oshmasligi kerak."),
  contact: z
    .string()
    .min(1, "Telegram yoki emailingizni kiriting.")
    .max(120, "Aloqa ma'lumoti 120 belgidan oshmasligi kerak."),
  message: z
    .string()
    .min(10, "Xabar matni kamida 10 ta belgidan iborat bo'lishi kerak.")
    .max(2000, "Xabar matni 2000 belgidan oshmasligi kerak."),
  website: z.string().optional(), // Honeypot
});

export type ContactFormData = z.infer<typeof contactSchema>;

interface ContactSectionProps {
  profile: Profile | null;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const [serverStatus, setServerStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      contact: '',
      message: '',
      website: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setServerStatus(null);
    try {
      const res = await submitContact(data);
      setServerStatus({
        type: 'success',
        message: res.message || "Xabaringiz muvaffaqiyatli qabul qilindi! Tez orada siz bilan bog'lanaman.",
      });
      reset();
    } catch (err: any) {
      setServerStatus({
        type: 'error',
        message: err.message || "Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.",
      });
    }
  };

  const telegramUser = profile?.telegram_username || '@Sardorbek_Ergashev';
  const emailAddr = profile?.email || '[Email]';
  const githubLink = profile?.github_url || '[Havola]';

  return (
    <section id="aloqa" className="py-12 sm:py-20">
      <div className="max-w-container mx-auto px-5 sm:px-8">
        {/* Contact Card */}
        <div className="card-contact p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Info Column */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs sm:text-sm text-accent uppercase tracking-wider block mb-2">
                  07 / aloqa
                </span>
                <h2 className="font-heading font-semibold text-3xl sm:text-[40px] text-text-main leading-tight mb-4">
                  Birga ishlaymizmi?
                </h2>
                <p className="font-body text-sm sm:text-base text-text-subtitle leading-relaxed max-w-md mb-8">
                  Loyiha yoki hamkorlik taklifingiz bormi? Quyidagi forma orqali yozishingiz mumkin, men har doim aloqadaman.
                </p>
              </div>

              {/* Direct links */}
              <div className="flex flex-col gap-3 font-mono text-xs sm:text-sm text-text-subtitle">
                <div className="flex items-center gap-3">
                  <SendHorizontal size={16} className="text-accent" />
                  <span className="text-text-muted">telegram:</span>
                  <a
                    href={telegramUser.startsWith('@') ? `https://t.me/${telegramUser.replace('@', '')}` : telegramUser}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    {telegramUser}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-accent" />
                  <span className="text-text-muted">email:</span>
                  {emailAddr.includes('@') ? (
                    <a href={`mailto:${emailAddr}`} className="text-accent hover:underline">
                      {emailAddr}
                    </a>
                  ) : (
                    <span className="text-text-main">{emailAddr}</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Github size={16} className="text-accent" />
                  <span className="text-text-muted">github:</span>
                  {githubLink.startsWith('http') ? (
                    <a
                      href={githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      github
                    </a>
                  ) : (
                    <span className="text-text-main">{githubLink}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-6">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-5" noValidate>
                
                {/* Honeypot field (hidden from human visitors) */}
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register('website')}
                  />
                </div>

                {/* Server Status Feedback */}
                {serverStatus && (
                  <div
                    role="alert"
                    className={`p-4 rounded-lg flex items-start gap-3 text-sm leading-relaxed ${
                      serverStatus.type === 'success'
                        ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200'
                        : 'bg-rose-950/60 border border-rose-500/40 text-rose-200'
                    }`}
                  >
                    {serverStatus.type === 'success' ? (
                      <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                    ) : (
                      <AlertCircle size={18} className="text-rose-400 mt-0.5 shrink-0" />
                    )}
                    <span>{serverStatus.message}</span>
                  </div>
                )}

                {/* Ismingiz Field */}
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-mono text-text-subtitle mb-1.5">
                    Ismingiz
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    disabled={isSubmitting}
                    {...register('name')}
                    className={`w-full px-4 py-2.5 rounded-lg bg-[#0B1736]/70 border text-text-main text-sm focus:outline-none transition-colors ${
                      errors.name ? 'border-rose-500 focus:border-rose-400' : 'border-border-subtle focus:border-accent'
                    } disabled:opacity-60`}
                  />
                  {errors.name && (
                    <p className="text-xs text-rose-400 mt-1 font-body">{errors.name.message}</p>
                  )}
                </div>

                {/* Telegram yoki email Field */}
                <div>
                  <label htmlFor="contact-detail" className="block text-xs font-mono text-text-subtitle mb-1.5">
                    Telegram yoki email
                  </label>
                  <input
                    id="contact-detail"
                    type="text"
                    disabled={isSubmitting}
                    {...register('contact')}
                    className={`w-full px-4 py-2.5 rounded-lg bg-[#0B1736]/70 border text-text-main text-sm focus:outline-none transition-colors ${
                      errors.contact ? 'border-rose-500 focus:border-rose-400' : 'border-border-subtle focus:border-accent'
                    } disabled:opacity-60`}
                  />
                  {errors.contact && (
                    <p className="text-xs text-rose-400 mt-1 font-body">{errors.contact.message}</p>
                  )}
                </div>

                {/* Xabar Field */}
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-mono text-text-subtitle mb-1.5">
                    Xabar
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    disabled={isSubmitting}
                    {...register('message')}
                    className={`w-full px-4 py-2.5 rounded-lg bg-[#0B1736]/70 border text-text-main text-sm focus:outline-none transition-colors resize-y ${
                      errors.message ? 'border-rose-500 focus:border-rose-400' : 'border-border-subtle focus:border-accent'
                    } disabled:opacity-60`}
                  />
                  {errors.message && (
                    <p className="text-xs text-rose-400 mt-1 font-body">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full sm:w-auto px-8 py-3 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Yuborilmoqda...</span>
                      </>
                    ) : (
                      <>
                        <span>Yuborish</span>
                        <Send size={15} />
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
