import React, { useEffect, useState } from 'react';
import { Testimonial } from '../../types';
import {
  adminGetTestimonials,
  adminCreateTestimonial,
  adminUpdateTestimonial,
  adminDeleteTestimonial,
} from '../../api/client';
import { Plus, Trash2, Edit3, Loader2, AlertCircle } from 'lucide-react';

export const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState('');
  const [roleCompany, setRoleCompany] = useState('');
  const [quote, setQuote] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      const data = await adminGetTestimonials();
      setTestimonials(data);
    } catch (err: any) {
      setFeedback(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !quote.trim()) return;

    try {
      if (editingId) {
        await adminUpdateTestimonial(editingId, {
          author,
          role_company: roleCompany,
          quote,
        });
      } else {
        await adminCreateTestimonial({
          author,
          role_company: roleCompany,
          quote,
          order: testimonials.length,
          visible: true,
        });
      }
      resetForm();
      await fetchItems();
    } catch (err: any) {
      setFeedback(err.message || 'Saqlashda xatolik');
    }
  };

  const startEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setAuthor(t.author);
    setRoleCompany(t.role_company);
    setQuote(t.quote);
  };

  const resetForm = () => {
    setEditingId(null);
    setAuthor('');
    setRoleCompany('');
    setQuote('');
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Fikrni o'chirmoqchimisiz?")) return;
    try {
      await adminDeleteTestimonial(id);
      await fetchItems();
    } catch (err: any) {
      setFeedback(err.message || "O'chirishda xatolik");
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
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-semibold text-3xl sm:text-4xl text-text-main mb-2">
          Fikrlar (Testimonials)
        </h1>
        <p className="font-body text-xs sm:text-sm text-text-muted">
          Mijozlar va hamkorlarning tavsiyalari
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-200 text-sm flex items-start gap-2.5">
          <AlertCircle size={18} className="text-rose-400 mt-0.5 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Form */}
      <div className="card-base p-6">
        <h2 className="font-heading font-semibold text-lg text-text-main mb-4">
          {editingId ? 'Fikrni tahrirlash' : "Yangi fikr qo'shish"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-text-subtitle mb-1.5">
                Ism-familiya
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Alisher Zokirov"
                required
                className="w-full px-3.5 py-2 rounded-lg bg-[#0E1B3B] border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-text-subtitle mb-1.5">
                Lavozim, kompaniya
              </label>
              <input
                type="text"
                value={roleCompany}
                onChange={(e) => setRoleCompany(e.target.value)}
                placeholder="Product Owner, FinTech"
                required
                className="w-full px-3.5 py-2 rounded-lg bg-[#0E1B3B] border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-text-subtitle mb-1.5">
              Fikr matni
            </label>
            <textarea
              rows={3}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Sardorbek bilan ishlash juda qulay bo'ldi..."
              required
              className="w-full px-3.5 py-2 rounded-lg bg-[#0E1B3B] border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent resize-y"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-white hover:bg-white/90 text-[#06122B] px-5 py-2 rounded-lg font-semibold text-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={16} />
              <span>{editingId ? 'Saqlash' : "Qo'shish"}</span>
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="btn-ghost px-4 py-2 text-sm font-medium cursor-pointer"
              >
                Bekor qilish
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="card-base p-6 flex flex-col justify-between">
            <p className="font-body text-sm text-text-subtitle leading-relaxed italic mb-4">
              "{t.quote}"
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-border-subtle/30">
              <div>
                <h4 className="font-heading font-semibold text-sm text-text-main">
                  {t.author}
                </h4>
                <p className="font-body text-xs text-text-muted">{t.role_company}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(t)}
                  className="btn-ghost px-2.5 py-1 text-xs font-medium flex items-center gap-1"
                >
                  <Edit3 size={12} />
                  <span>Tahrirlash</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(t.id)}
                  className="text-text-muted hover:text-rose-300 p-1.5"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
