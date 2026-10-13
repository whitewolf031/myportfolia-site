import React, { useEffect, useState, useRef } from 'react';
import { Profile, Stat } from '../../types';
import {
  adminGetProfile,
  adminUpdateProfile,
  adminGetStats,
  adminUpdateStat,
  adminCreateStat,
  adminDeleteStat,
} from '../../api/client';
import { Loader2, Upload, AlertCircle, CheckCircle2, Plus, Trash2 } from 'lucide-react';

export const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Profile Form Fields
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [shortBio, setShortBio] = useState('');
  const [openToWork, setOpenToWork] = useState(true);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    try {
      const [prof, st] = await Promise.all([adminGetProfile(), adminGetStats()]);
      setProfile(prof);
      setFullName(prof.full_name);
      setHeadline(prof.headline);
      setShortBio(prof.short_bio);
      setOpenToWork(prof.open_to_work);
      setStats(st);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || "Ma'lumotlarni yuklashda xatolik" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append('full_name', fullName);
    formData.append('headline', headline);
    formData.append('short_bio', shortBio);
    formData.append('open_to_work', openToWork ? 'true' : 'false');

    if (photoFile) {
      formData.append('photo', photoFile);
    }
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }

    try {
      const updated = await adminUpdateProfile(formData);
      setProfile(updated);
      setPhotoFile(null);
      setResumeFile(null);
      setFeedback({ type: 'success', message: 'Profil muvaffaqiyatli saqlandi!' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Saqlashda xatolik yuz berdi' });
    } finally {
      setSaving(false);
    }
  };

  const handleStatChange = (id: number, field: 'value' | 'label', val: string) => {
    setStats((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  const saveStat = async (stat: Stat) => {
    try {
      await adminUpdateStat(stat.id, { value: stat.value, label: stat.label });
      setFeedback({ type: 'success', message: `Ko'rsatkich saqlandi: ${stat.label}` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Statistikani saqlashda xatolik' });
    }
  };

  const deleteStat = async (id: number) => {
    try {
      await adminDeleteStat(id);
      setStats((prev) => prev.filter((s) => s.id !== id));
      setFeedback({ type: 'success', message: "Ko'rsatkich o'chirildi." });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || "Ko'rsatkichni o'chirishda xatolik" });
    }
  };

  const addStat = async () => {
    try {
      const newStat = await adminCreateStat({
        value: '[0]+',
        label: "[Yangi ko'rsatkich]",
        order: stats.length,
        visible: true,
      });
      setStats((prev) => [...prev, newStat]);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || "Ko'rsatkich qo'shishda xatolik" });
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
    <div className="space-y-10">
      <div>
        <h1 className="font-heading font-semibold text-3xl sm:text-4xl text-text-main mb-2">
          Men haqimda va rasm
        </h1>
        <p className="font-body text-xs sm:text-sm text-text-muted">
          Asosiy profil ma'lumotlari, rasm, rezyume va statistik ko'rsatkichlar
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

      {/* Profile Form */}
      <div className="card-base p-6 sm:p-8">
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-mono text-text-subtitle mb-1.5">
                To'liq ism (Full Name)
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0E1B3B] border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent"
              />
            </div>

            {/* Open to Work Toggle */}
            <div className="flex flex-col justify-end">
              <label className="inline-flex items-center gap-3 cursor-pointer py-2 text-sm font-body">
                <input
                  type="checkbox"
                  checked={openToWork}
                  onChange={(e) => setOpenToWork(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0E1B3B] border-border-subtle text-accent focus:ring-accent accent-accent"
                />
                <span className="text-text-main font-medium">
                  Yangi loyihalar uchun ochiqman (Status belgisi)
                </span>
              </label>
            </div>
          </div>

          {/* Headline */}
          <div>
            <label className="block text-xs font-mono text-text-subtitle mb-1.5">
              Sarlavha (Headline)
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0E1B3B] border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent"
            />
          </div>

          {/* Short Bio */}
          <div>
            <label className="block text-xs font-mono text-text-subtitle mb-1.5">
              Qisqa bio
            </label>
            <textarea
              rows={3}
              value={shortBio}
              onChange={(e) => setShortBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0E1B3B] border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent resize-y"
            />
          </div>

          {/* File Uploads Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Photo upload */}
            <div className="card-base p-4 bg-[#0B1736]/60">
              <span className="block text-xs font-mono text-text-subtitle mb-2">
                Asosiy rasm (JPG, PNG, WEBP &le; 3MB)
              </span>
              <div className="flex items-center gap-4">
                {profile?.photo && (
                  <img
                    src={profile.photo}
                    alt="Current"
                    className="w-16 h-16 rounded-xl object-cover border border-border-subtle shrink-0"
                  />
                )}
                <div className="flex-1">
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setPhotoFile(e.target.files[0]);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="btn-ghost px-3.5 py-2 text-xs flex items-center gap-2"
                  >
                    <Upload size={14} className="text-accent" />
                    <span>{photoFile ? photoFile.name : 'Rasm yuklash'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Resume upload */}
            <div className="card-base p-4 bg-[#0B1736]/60">
              <span className="block text-xs font-mono text-text-subtitle mb-2">
                Rezyume (PDF &le; 5MB)
              </span>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setResumeFile(e.target.files[0]);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => resumeInputRef.current?.click()}
                    className="btn-ghost px-3.5 py-2 text-xs flex items-center gap-2"
                  >
                    <Upload size={14} className="text-accent" />
                    <span>{resumeFile ? resumeFile.name : 'PDF rezyume yuklash'}</span>
                  </button>
                  {profile?.resume && (
                    <a
                      href={profile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs font-mono text-accent hover:underline mt-2"
                    >
                      Mavjud rezyumeni ko'rish &rarr;
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-white hover:bg-white/90 text-[#06122B] px-7 py-2.5 rounded-lg font-semibold text-sm transition-colors cursor-pointer flex items-center gap-2"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            <span>Profilni saqlash</span>
          </button>
        </form>
      </div>

      {/* Stats Section Management */}
      <div className="card-base p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading font-semibold text-xl text-text-main">
              Statistik ko'rsatkichlar (Stats strip)
            </h2>
            <p className="font-body text-xs text-text-muted mt-1">
              Saytdagi 4 ta asosiy raqam va izohlar
            </p>
          </div>
          <button
            type="button"
            onClick={addStat}
            className="btn-ghost px-3.5 py-1.5 text-xs font-medium flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Qo'shish</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.id} className="p-4 rounded-xl bg-[#0E1B3B] border border-border-subtle flex flex-col gap-3">
              <div>
                <label className="block text-[11px] font-mono text-text-subtitle mb-1">
                  Qiymat (masalan: 3+)
                </label>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => handleStatChange(stat.id, 'value', e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-[#071126] border border-border-subtle text-text-main font-heading font-bold text-lg focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-text-subtitle mb-1">
                  Izoh / Nomi
                </label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-[#071126] border border-border-subtle text-text-main text-xs focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border-subtle/30">
                <button
                  type="button"
                  onClick={() => saveStat(stat)}
                  className="text-xs font-medium text-accent hover:underline cursor-pointer"
                >
                  Saqlash
                </button>
                <button
                  type="button"
                  onClick={() => deleteStat(stat.id)}
                  className="text-xs text-rose-300 hover:text-rose-200 cursor-pointer p-1"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
