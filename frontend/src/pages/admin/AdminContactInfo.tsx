import React, { useEffect, useState } from 'react';
import { adminGetProfile, adminUpdateProfile } from '../../api/client';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AdminContactInfo: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [telegram, setTelegram] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    adminGetProfile()
      .then((p) => {
        setEmail(p.email || '');
        setTelegram(p.telegram_username || '');
        setGithub(p.github_url || '');
        setLinkedin(p.linkedin_url || '');
        setInstagram(p.instagram_url || '');
        setLoading(false);
      })
      .catch((err) => {
        setFeedback({ type: 'error', message: err.message || 'Xatolik yuz berdi' });
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('telegram_username', telegram);
    formData.append('github_url', github);
    formData.append('linkedin_url', linkedin);
    formData.append('instagram_url', instagram);

    try {
      await adminUpdateProfile(formData);
      setFeedback({ type: 'success', message: "Aloqa ma'lumotlari muvaffaqiyatli saqlandi!" });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Saqlashda xatolik yuz berdi' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-heading font-semibold text-3xl sm:text-4xl text-text-main mb-2">
          Aloqa ma'lumotlari
        </h1>
        <p className="font-body text-xs sm:text-sm text-text-muted">
          Saytning pastki qismida va aloqa blokida ko'rinadigan havolalar
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-lg text-sm flex items-start gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/60 border border-rose-500/40 text-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-rose-400 mt-0.5 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="card-base p-6 sm:p-8">
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-text-subtitle mb-1.5">
              Telegram username
            </label>
            <input
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="@Sardorbek_Ergashev"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0E1B3B] border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-text-subtitle mb-1.5">
              Email manzil
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sardorbek@example.com"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0E1B3B] border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-text-subtitle mb-1.5">
              GitHub havola
            </label>
            <input
              type="text"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0E1B3B] border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-text-subtitle mb-1.5">
              LinkedIn havola
            </label>
            <input
              type="text"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0E1B3B] border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-text-subtitle mb-1.5">
              Instagram havola yoki username
            </label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/... yoki @username"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0E1B3B] border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-white hover:bg-white/90 text-[#06122B] px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors cursor-pointer flex items-center gap-2"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            <span>Saqlash</span>
          </button>
        </form>
      </div>
    </div>
  );
};
