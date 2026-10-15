import React, { useState } from 'react';
import { Bell, PlusCircle, Calendar, Users, AlertCircle, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Announcement } from '../../types';
import { formatDateFR } from '../../utils/formatters';

export const AnnouncementsManagement: React.FC = () => {
  const { currentSchool, currentUser, refreshData } = useAuth();
  const schoolId = currentSchool?.id || '';

  const announcements = dataService.getAnnouncements(schoolId);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: '',
    content: '',
    targetRole: 'TOUS' as Announcement['targetRole'],
    priority: 'NORMALE' as Announcement['priority']
  });

  if (!currentSchool) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) return;

    dataService.addAnnouncement({
      schoolId,
      title: form.title,
      content: form.content,
      targetRole: form.targetRole,
      date: new Date().toISOString().split('T')[0],
      authorName: currentUser?.name || 'Direction',
      priority: form.priority
    });

    refreshData();
    setIsNewModalOpen(false);
    setForm({ title: '', content: '', targetRole: 'TOUS', priority: 'NORMALE' });
  };

  const isStaff = ['DIRECTOR', 'ADMIN', 'ACCOUNTANT', 'SUPERVISOR', 'SUPER_ADMIN'].includes(
    currentUser?.role || ''
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Annonces Officielles & Circulaires Scolaires
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Communications de la Direction aux parents d'élèves, enseignants et personnel.
          </p>
        </div>

        {isStaff && (
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Publier une Circulaire</span>
          </button>
        )}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`p-6 rounded-2xl border transition-all ${
              ann.priority === 'URGENTE'
                ? 'bg-amber-50/50 border-amber-200'
                : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                {ann.priority === 'URGENTE' && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-600 text-white px-2 py-0.5 rounded">
                    Urgent
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Destinataires : {ann.targetRole}
                </span>
                <span className="text-xs text-slate-400">· {formatDateFR(ann.date, true)}</span>
              </div>

              <div className="text-xs font-semibold text-slate-600">{ann.authorName}</div>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2">{ann.title}</h3>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{ann.content}</p>
          </div>
        ))}
      </div>

      {/* New Announcement Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative text-xs">
            <button
              onClick={() => setIsNewModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Rédiger une Communication Officielle
            </h3>
            <p className="text-xs text-slate-500 mb-4">Établissement : {currentSchool.name}</p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Titre de la circulaire <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Réunion de rentrée avec les parents d'élèves"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Audience ciblée</label>
                  <select
                    value={form.targetRole}
                    onChange={(e) => setForm({ ...form, targetRole: e.target.value as Announcement['targetRole'] })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="TOUS">Tous (Parents, Enseignants, Personnel)</option>
                    <option value="PARENTS">Parents d'élèves uniquement</option>
                    <option value="ENSEIGNANTS">Enseignants uniquement</option>
                    <option value="PERSONNEL">Personnel administratif</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priorité</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as Announcement['priority'] })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="NORMALE">Normale</option>
                    <option value="URGENTE">Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contenu du message <span className="text-rose-500">*</span></label>
                <textarea
                  rows={5}
                  required
                  placeholder="Rédigez ici le communiqué..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                >
                  Diffuser la Circulaire
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
