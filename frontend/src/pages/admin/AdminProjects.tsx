import React, { useEffect, useState, useRef } from 'react';
import { Project } from '../../types';
import {
  adminGetProjects,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  adminReorderProjects,
} from '../../api/client';
import { ArrowUp, ArrowDown, Upload, Loader2, AlertCircle } from 'lucide-react';

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [visible, setVisible] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchList = async () => {
    try {
      const data = await adminGetProjects();
      setProjects(data);
      if (data.length > 0 && !editingProject && !isCreatingNew) {
        startEditing(data[0]);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Loyihalarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const startEditing = (p: Project) => {
    setIsCreatingNew(false);
    setEditingProject(p);
    setTitle(p.title);
    setDescription(p.description);
    setTechnologies(p.technologies);
    setLinkUrl(p.link_url || '');
    setVisible(p.visible);
    setSelectedImage(null);
    setErrorMsg(null);
  };

  const startCreating = () => {
    setIsCreatingNew(true);
    setEditingProject(null);
    setTitle('');
    setDescription('');
    setTechnologies('');
    setLinkUrl('');
    setVisible(true);
    setSelectedImage(null);
    setErrorMsg(null);
  };

  const cancelEdit = () => {
    if (projects.length > 0) {
      startEditing(projects[0]);
    } else {
      setIsCreatingNew(false);
      setEditingProject(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Loyiha nomini kiriting.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('technologies', technologies);
    formData.append('link_url', linkUrl);
    formData.append('visible', visible ? 'true' : 'false');

    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      if (isCreatingNew) {
        formData.append('order', projects.length.toString());
        await adminCreateProject(formData);
      } else if (editingProject) {
        await adminUpdateProject(editingProject.id, formData);
      }
      await fetchList();
    } catch (err: any) {
      setErrorMsg(err.message || 'Saqlashda xatolik yuz berdi.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminDeleteProject(id);
      setDeleteConfirmId(null);
      if (editingProject?.id === id) {
        setEditingProject(null);
      }
      await fetchList();
    } catch (err: any) {
      setErrorMsg(err.message || "O'chirishda xatolik yuz berdi.");
    }
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const newProjects = [...projects];
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    setProjects(newProjects);

    try {
      const ids = newProjects.map((p) => p.id);
      await adminReorderProjects(ids);
    } catch (err: any) {
      setErrorMsg(err.message || 'Tartibni yangilashda xatolik');
      await fetchList();
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
    <div>
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading font-semibold text-3xl sm:text-4xl text-text-main">
          Loyihalar
        </h1>
        <button
          type="button"
          onClick={startCreating}
          className="bg-white hover:bg-white/90 text-[#06122B] px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
        >
          Yangi loyiha
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 mb-6 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-200 text-sm flex items-start gap-2.5">
          <AlertCircle size={18} className="text-rose-400 mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid matching Image 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Projects List */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {projects.map((project, idx) => {
            const isSelected = editingProject?.id === project.id;

            return (
              <div
                key={project.id}
                className={`card-base p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                  isSelected ? 'border-accent/80 shadow-md shadow-accent/10' : ''
                }`}
              >
                {/* Project Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-base text-text-main truncate">
                    {project.title}
                  </h3>
                  <p className="font-mono text-xs text-text-muted mt-1 truncate">
                    {project.technologies || "Texnologiyalar ko'rsatilmagan"}
                  </p>
                </div>

                {/* Status & Action Buttons */}
                <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 text-xs font-mono rounded border ${
                      project.visible
                        ? 'border-accent/40 text-accent bg-accent/5'
                        : 'border-border-subtle text-text-muted bg-transparent'
                    }`}
                  >
                    {project.visible ? "Saytda ko'rinadi" : 'Yashirin'}
                  </span>

                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveOrder(idx, 'up')}
                      className="p-1 text-text-muted hover:text-text-main disabled:opacity-30 cursor-pointer"
                      title="Yuqoriga"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === projects.length - 1}
                      onClick={() => moveOrder(idx, 'down')}
                      className="p-1 text-text-muted hover:text-text-main disabled:opacity-30 cursor-pointer"
                      title="Pastga"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  {/* Tahrirlash Button */}
                  <button
                    type="button"
                    onClick={() => startEditing(project)}
                    className="btn-ghost px-3.5 py-1.5 text-xs font-medium cursor-pointer"
                  >
                    Tahrirlash
                  </button>

                  {/* O'chirish Button */}
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(project.id)}
                    className="btn-ghost px-3 py-1.5 text-xs text-rose-300 hover:text-rose-200 hover:border-rose-500/50 cursor-pointer"
                  >
                    O'chirish
                  </button>
                </div>
              </div>
            );
          })}

          <p className="font-mono text-xs text-text-muted mt-2">
            Tartibni o'zgartirish uchun loyihani sudrab o'tkazing.
          </p>
        </div>

        {/* Right Column: Edit Card (Loyihani tahrirlash) */}
        <div className="lg:col-span-6">
          <div className="card-base p-6 sm:p-7 shadow-xl">
            <h2 className="font-heading font-semibold text-xl text-text-main mb-6">
              {isCreatingNew ? 'Yangi loyiha qo\'shish' : 'Loyihani tahrirlash'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Nomi */}
              <div>
                <label className="block text-xs font-mono text-text-subtitle mb-1.5">
                  Nomi
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Loyiha nomi"
                  required
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0E1B3B] border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent"
                />
              </div>

              {/* Tavsif */}
              <div>
                <label className="block text-xs font-mono text-text-subtitle mb-1.5">
                  Tavsif
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Loyiha haqida qisqacha tavsif"
                  required
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0E1B3B] border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent resize-y"
                />
              </div>

              {/* Texnologiyalar (vergul bilan) */}
              <div>
                <label className="block text-xs font-mono text-text-subtitle mb-1.5">
                  Texnologiyalar (vergul bilan)
                </label>
                <input
                  type="text"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  placeholder="Python, aiogram, Django"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0E1B3B] border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent"
                />
              </div>

              {/* Havola */}
              <div>
                <label className="block text-xs font-mono text-text-subtitle mb-1.5">
                  Havola
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="[loyiha havolasi]"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0E1B3B] border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent"
                />
              </div>

              {/* Rasm */}
              <div>
                <label className="block text-xs font-mono text-text-subtitle mb-1.5">
                  Rasm
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedImage(e.target.files[0]);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-ghost px-4 py-2 text-xs font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Upload size={14} className="text-accent" />
                  <span>{selectedImage ? selectedImage.name : 'Rasm yuklash'}</span>
                </button>
                {editingProject?.image && !selectedImage && (
                  <p className="text-[11px] font-mono text-text-muted mt-1.5">
                    Hozirgi rasm mavjud. Yangilash uchun yangi fayl tanlang.
                  </p>
                )}
              </div>

              {/* Checkbox: Saytda ko'rsatilsin */}
              <div className="pt-2">
                <label className="inline-flex items-center gap-2.5 cursor-pointer text-sm font-body">
                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={(e) => setVisible(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#0E1B3B] border-border-subtle text-accent focus:ring-accent accent-accent"
                  />
                  <span>Saytda ko'rsatilsin</span>
                </label>
              </div>

              {/* Action Buttons: Saqlash / Bekor qilish */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-white hover:bg-white/90 text-[#06122B] px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  <span>Saqlash</span>
                </button>

                <button
                  type="button"
                  onClick={cancelEdit}
                  className="btn-ghost px-5 py-2.5 text-sm font-medium cursor-pointer"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card-base max-w-sm w-full p-6 shadow-2xl">
            <h3 className="font-heading font-semibold text-lg text-text-main mb-2">
              Loyihani o'chirish
            </h3>
            <p className="font-body text-xs sm:text-sm text-text-muted mb-6 leading-relaxed">
              Haqiqatan ham ushbu loyihani o'chirib tashlamoqchimisiz? Ushbu amalni ortga qaytarib bo'lmaydi.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="btn-ghost px-4 py-2 text-xs font-medium cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
