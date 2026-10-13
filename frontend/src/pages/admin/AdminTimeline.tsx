import React, { useEffect, useState } from 'react';
import { TimelineItem } from '../../types';
import {
  adminGetTimeline,
  adminCreateTimeline,
  adminUpdateTimeline,
  adminDeleteTimeline,
} from '../../api/client';
import { Plus, Trash2, Edit3, Loader2, AlertCircle } from 'lucide-react';

export const AdminTimeline: React.FC = () => {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState<'experience' | 'education'>('experience');
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      const data = await adminGetTimeline();
      setItems(data);
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
    if (!title.trim() || !start.trim()) return;

    try {
      const payload = {
        kind,
        title,
        organization,
        start,
        end: end.trim() || null,
        description,
        visible: true,
      };

      if (editingId) {
        await adminUpdateTimeline(editingId, payload);
      } else {
        await adminCreateTimeline({ ...payload, order: items.length });
      }

      resetForm();
      await fetchItems();
    } catch (err: any) {
      setFeedback(err.message || 'Saqlashda xatolik');
    }
  };

  const startEdit = (item: TimelineItem) => {
    setEditingId(item.id);
    setKind(item.kind);
    setTitle(item.title);
    setOrganization(item.organization || '');
    setStart(item.start);
    setEnd(item.end || '');
    setDescription(item.description || '');
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setOrganization('');
    setStart('');
    setEnd('');
    setDescription('');
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("O'chirmoqchimisiz?")) return;
    try {
      await adminDeleteTimeline(id);
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
          Tajriba va ta'lim
        </h1>
        <p className="font-body text-xs sm:text-sm text-text-muted">
          Ish tajribalari va ta'lim bosqichlari boshqaruvi
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
          {editingId ? 'Elementni tahrirlash' : "Yangi tajriba / ta'lim qo'shish"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-text-subtitle mb-1.5">
                Turi (Tajriba yoki Ta'lim)
              </label>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0E1B3B] border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent"
              >
                <option value="experience">Tajriba</option>
                <option value="education">Ta'lim</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-text-subtitle mb-1.5">
                Lavozim yoki O'quv yurti
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Senior Python Developer"
                required
                className="w-full px-3.5 py-2 rounded-lg bg-[#0E1B3B] border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-text-subtitle mb-1.5">
                Kompaniya yoki Yo'nalish
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="IT Park / Kompaniya nomi"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0E1B3B] border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-mono text-text-subtitle mb-1.5">
                  Boshlanish (masalan: 2023)
                </label>
                <input
                  type="text"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  placeholder="2023"
                  required
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0E1B3B] border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-subtitle mb-1.5">
                  Tugash (Hozir yoki yil)
                </label>
                <input
                  type="text"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  placeholder="Hozir"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0E1B3B] border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-text-subtitle mb-1.5">
              Qisqa tavsif / Natijalar
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Asosiy vazifalar..."
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
        {items.map((item) => (
          <div key={item.id} className="card-base p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-accent">
                  {item.start} — {item.end || 'Hozir'}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-border-subtle text-text-muted">
                  {item.kind === 'experience' ? 'Tajriba' : "Ta'lim"}
                </span>
              </div>
              <h3 className="font-heading font-semibold text-base text-text-main">
                {item.title} {item.organization ? `(${item.organization})` : ''}
              </h3>
              {item.description && (
                <p className="font-body text-xs text-text-muted mt-2 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-border-subtle/30 mt-4">
              <button
                type="button"
                onClick={() => startEdit(item)}
                className="btn-ghost px-2.5 py-1 text-xs font-medium flex items-center gap-1"
              >
                <Edit3 size={12} />
                <span>Tahrirlash</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="text-text-muted hover:text-rose-300 p-1.5"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
