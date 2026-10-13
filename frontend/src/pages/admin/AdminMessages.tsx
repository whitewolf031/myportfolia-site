import React, { useEffect, useState } from 'react';
import { ContactMessage } from '../../types';
import {
  adminGetMessages,
  adminUpdateMessage,
  adminDeleteMessage,
  adminResendMessage,
} from '../../api/client';
import { Trash2, RotateCw, CheckCircle, Clock, AlertTriangle, Loader2, AlertCircle } from 'lucide-react';

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [resendingId, setResendingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchMessages = async () => {
    try {
      const data = await adminGetMessages();
      setMessages(data);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Xabarlarni yuklashda xatolik' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (msg: ContactMessage) => {
    try {
      const updated = await adminUpdateMessage(msg.id, { is_read: !msg.is_read });
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? updated : m)));
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Holatni o\'zgartirishda xatolik' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Xabarni o'chirmoqchimisiz?")) return;
    try {
      await adminDeleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setFeedback({ type: 'success', message: "Xabar o'chirildi." });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || "O'chirishda xatolik" });
    }
  };

  const handleResend = async (id: number) => {
    setResendingId(id);
    setFeedback(null);
    try {
      const res = await adminResendMessage(id);
      setFeedback({ type: 'success', message: res.message || 'Telegramga qayta yuborildi!' });
      await fetchMessages();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Telegramga yuborishda xatolik' });
      await fetchMessages();
    } finally {
      setResendingId(null);
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
          Kelgan xabarlar
        </h1>
        <p className="font-body text-xs sm:text-sm text-text-muted">
          Sayt orqali yuborilgan murojaatlar va Telegramga yetkazilish holati
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
            <CheckCircle size={18} className="text-emerald-400 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-rose-400 mt-0.5 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="card-base p-12 text-center text-text-muted">
          Hozircha kelgan xabarlar mavjud emas.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`card-base p-5 sm:p-6 flex flex-col gap-4 transition-all ${
                !msg.is_read ? 'border-accent/60 bg-[#162B63]/90' : 'opacity-85'
              }`}
            >
              {/* Header info */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-heading font-semibold text-base sm:text-lg text-text-main">
                    {msg.name}
                  </h3>
                  <span className="font-mono text-xs text-accent">
                    ({msg.contact})
                  </span>
                  {!msg.is_read && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-accent text-[#06122B] font-bold">
                      Yangi
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-text-muted">
                  <span>{new Date(msg.created_at).toLocaleString('uz-UZ')}</span>
                  
                  {/* Telegram Status Badge */}
                  {msg.telegram_status === 'sent' && (
                    <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                      <CheckCircle size={12} />
                      <span>Yuborildi</span>
                    </span>
                  )}
                  {msg.telegram_status === 'pending' && (
                    <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
                      <Clock size={12} />
                      <span>Kutilmoqda</span>
                    </span>
                  )}
                  {msg.telegram_status === 'failed' && (
                    <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-500/30">
                      <AlertTriangle size={12} />
                      <span>Xatolik</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Message body */}
              <p className="font-body text-sm text-text-subtitle bg-[#0B1736]/60 p-4 rounded-lg border border-border-subtle/50 whitespace-pre-wrap leading-relaxed">
                {msg.message}
              </p>

              {msg.error_message && (
                <p className="font-mono text-xs text-rose-400">
                  Xatolik tafsiloti: {msg.error_message}
                </p>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-border-subtle/30">
                <button
                  type="button"
                  onClick={() => handleToggleRead(msg)}
                  className="text-xs font-medium text-text-muted hover:text-text-main cursor-pointer"
                >
                  {msg.is_read ? "O'qilmagan deb belgilash" : "O'qilgan deb belgilash"}
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={resendingId === msg.id}
                    onClick={() => handleResend(msg.id)}
                    className="btn-ghost px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 cursor-pointer hover:border-accent"
                  >
                    <RotateCw
                      size={13}
                      className={resendingId === msg.id ? 'animate-spin text-accent' : 'text-accent'}
                    />
                    <span>Qayta yuborish</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(msg.id)}
                    className="text-text-muted hover:text-rose-300 p-1.5 cursor-pointer"
                    title="O'chirish"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
