import React, { useEffect, useState } from 'react';
import { SkillGroup } from '../../types';
import {
  adminGetSkillGroups,
  adminCreateSkillGroup,
  adminDeleteSkillGroup,
  adminCreateSkill,
  adminDeleteSkill,
} from '../../api/client';
import { Plus, Trash2, X, Loader2, AlertCircle } from 'lucide-react';

export const AdminSkills: React.FC = () => {
  const [groups, setGroups] = useState<SkillGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGroupName, setNewGroupName] = useState('');
  const [skillInputs, setSkillInputs] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      const data = await adminGetSkillGroups();
      setGroups(data);
    } catch (err: any) {
      setFeedback(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      await adminCreateSkillGroup({ name: newGroupName.trim(), order: groups.length, visible: true });
      setNewGroupName('');
      await fetchGroups();
    } catch (err: any) {
      setFeedback(err.message || "Guruh qo'shishda xatolik");
    }
  };

  const handleDeleteGroup = async (id: number) => {
    if (!window.confirm("Ushbu ko'nikma guruhini o'chirmoqchimisiz?")) return;
    try {
      await adminDeleteSkillGroup(id);
      await fetchGroups();
    } catch (err: any) {
      setFeedback(err.message || "O'chirishda xatolik");
    }
  };

  const handleAddSkill = async (groupId: number) => {
    const val = skillInputs[groupId]?.trim();
    if (!val) return;

    try {
      await adminCreateSkill({ group: groupId, name: val, visible: true });
      setSkillInputs((prev) => ({ ...prev, [groupId]: '' }));
      await fetchGroups();
    } catch (err: any) {
      setFeedback(err.message || "Ko'nikma qo'shishda xatolik");
    }
  };

  const handleDeleteSkill = async (skillId: number) => {
    try {
      await adminDeleteSkill(skillId);
      await fetchGroups();
    } catch (err: any) {
      setFeedback(err.message || "Ko'nikmani o'chirishda xatolik");
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
          Ko'nikmalar
        </h1>
        <p className="font-body text-xs sm:text-sm text-text-muted">
          Texnologiyalar toifalari va ulardagi ko'nikma chipslari
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-200 text-sm flex items-start gap-2.5">
          <AlertCircle size={18} className="text-rose-400 mt-0.5 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Add New Group Form */}
      <div className="card-base p-6">
        <h2 className="font-heading font-semibold text-lg text-text-main mb-4">
          Yangi guruh qo'shish
        </h2>
        <form onSubmit={handleAddGroup} className="flex gap-3">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Masalan: Cloud & DevOps"
            className="flex-1 px-3.5 py-2 rounded-lg bg-[#0E1B3B] border border-border-subtle text-text-main text-sm focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="bg-white hover:bg-white/90 text-[#06122B] px-5 py-2 rounded-lg font-semibold text-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Plus size={16} />
            <span>Guruh qo'shish</span>
          </button>
        </form>
      </div>

      {/* Groups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="card-base p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-lg text-text-main">
                  {group.name}
                </h3>
                <button
                  type="button"
                  onClick={() => handleDeleteGroup(group.id)}
                  className="text-text-muted hover:text-rose-300 p-1 cursor-pointer"
                  title="Guruhni o'chirish"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Skills Chips */}
              <div className="flex flex-wrap gap-2 mb-6">
                {group.skills?.map((sk) => (
                  <span
                    key={sk.id}
                    className="chip pr-2 flex items-center gap-1.5 hover:border-accent"
                  >
                    <span>{sk.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(sk.id)}
                      className="text-text-muted hover:text-rose-300 p-0.5 cursor-pointer"
                      title="O'chirish"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Add Skill to this group */}
            <div className="flex gap-2 pt-4 border-t border-border-subtle/30">
              <input
                type="text"
                value={skillInputs[group.id] || ''}
                onChange={(e) =>
                  setSkillInputs((prev) => ({ ...prev, [group.id]: e.target.value }))
                }
                placeholder="Yangi ko'nikma..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-[#0E1B3B] border border-border-subtle text-text-main text-xs focus:outline-none focus:border-accent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(group.id);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => handleAddSkill(group.id)}
                className="btn-ghost px-3 py-1.5 text-xs font-medium cursor-pointer"
              >
                Qo'shish
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
