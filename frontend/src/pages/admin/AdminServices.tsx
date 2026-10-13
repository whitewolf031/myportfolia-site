import React, { useEffect, useState } from 'react';
import { Service } from '../../types';
import {
  adminGetServices,
  adminCreateService,
  adminUpdateService,
  adminDeleteService,
} from '../../api/client';
import { Plus, Trash2, Edit3, Loader2, AlertCircle } from 'lucide-react';

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      const data = await adminGetServices();
      setServices(data);
    } catch (err: any) {
      setFeedback(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      if (editingId) {
        await adminUpdateService(editingId, { title, description });
      } else {
        await adminCreateService({ title, description, order: services.length, visible: true });
      }
      setTitle('');
      setDescription('');
      setEditingId(null);
      await fetchServices();
    } catch (err: any) {
      setFeedback(err.message || 'Saqlashda xatolik');
    }
  };

  const startEdit = (s: Service) => {
    setEditingId(s.id);
    setTitle(s.title);
    setDescription(s.description);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Xizmatni o'chirmoqchimisiz?")) return;
    try {
      await adminDeleteService(id);
      await fetchServices();
    } catch (err: any) {
      setFeedback(err.message || "O'chirishda xatolik");
    }
  };

  const toggleVisible = async (s: Service) => {
    try {
      await adminUpdateService(s.id, { visible: !s.visible });
      await fetchServices();
    } catch (err: any) {
      setFeedback(err.message || 'Holatni yangilashda xatolik');
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
          Xizmatlar
        </h1>
        <p className="font-body text-xs sm:text-sm text-text-muted">
          Taklif qilinadigan xizmatlar va ularning tavsiflari
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-200 text-sm flex items-start gap-2.5">
          <AlertCircle size={18} className="text-rose-400 mt-0.5 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Service Form */}
      <div className="card-base p-6">
        <h2 className="font-heading font-semibold text-lg text-text-main mb-4">
          {editingId ? 'Xizmatni tahrirlash' : 'Yangi xizmat qo\'shish'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-text-subtitle mb-1.5">
              Xizmat nomi
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Backend va API"
              required
              className="w-full px-3.5 py-2 rounded-lg bg-[#0E1B3B] border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-text-subtitle mb-1.5">
              Tavsif
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Xizmat haqida batafsil..."
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
                onClick={cancelEdit}
                className="btn-ghost px-4 py-2 text-sm font-medium cursor-pointer"
              >
                Bekor qilish
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="card-base p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-heading font-semibold text-lg text-text-main">
                  {service.title}
                </h3>
                <span
                  onClick={() => toggleVisible(service)}
                  className={`text-[11px] font-mono px-2 py-0.5 rounded cursor-pointer border ${
                    service.visible
                      ? 'border-accent/40 text-accent bg-accent/5'
                      : 'border-border-subtle text-text-muted'
                  }`}
                >
                  {service.visible ? 'Ko\'rinadi' : 'Yashirin'}
                </span>
              </div>
              <p className="font-body text-xs sm:text-sm text-text-muted leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-border-subtle/30 mt-4">
              <button
                type="button"
                onClick={() => startEdit(service)}
                className="btn-ghost px-2.5 py-1 text-xs font-medium flex items-center gap-1"
              >
                <Edit3 size={12} />
                <span>Tahrirlash</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(service.id)}
                className="text-text-muted hover:text-rose-300 p-1.5"
                title="O'chirish"
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
