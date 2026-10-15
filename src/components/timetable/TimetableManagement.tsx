import React, { useState } from 'react';
import {
  Clock,
  PlusCircle,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Calendar,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { TimetableSlot } from '../../types';

export const TimetableManagement: React.FC = () => {
  const { currentSchool, refreshData } = useAuth();
  const schoolId = currentSchool?.id || '';

  const classes = dataService.getClasses(schoolId);
  const subjects = dataService.getSubjects(schoolId);
  const teachers = dataService.getUsers(schoolId).filter((u) => u.role === 'TEACHER');

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);

  // Form State
  const [slotForm, setSlotForm] = useState({
    subjectId: subjects[0]?.id || '',
    teacherId: teachers[0]?.id || '',
    dayOfWeek: 1, // Lundi
    startTime: '08:00',
    endTime: '10:00',
    room: 'Salle 12'
  });

  if (!currentSchool) return null;

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const slots = dataService.getTimetableSlots(schoolId, selectedClassId);

  const days = [
    { id: 1, name: 'Lundi' },
    { id: 2, name: 'Mardi' },
    { id: 3, name: 'Mercredi' },
    { id: 4, name: 'Jeudi' },
    { id: 5, name: 'Vendredi' },
    { id: 6, name: 'Samedi (Matin)' }
  ];

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);

    try {
      dataService.addTimetableSlot({
        schoolId,
        classId: selectedClassId,
        subjectId: slotForm.subjectId,
        teacherId: slotForm.teacherId,
        dayOfWeek: slotForm.dayOfWeek,
        startTime: slotForm.startTime,
        endTime: slotForm.endTime,
        room: slotForm.room
      });

      refreshData();
      setIsAddSlotOpen(false);
    } catch (err: any) {
      setConflictError(err?.message || "Conflit d'horaire détecté.");
    }
  };

  const handleDeleteSlot = (id: string) => {
    if (confirm('Supprimer ce créneau horaire de l’emploi du temps ?')) {
      dataService.deleteTimetableSlot(schoolId, id);
      refreshData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Emplois du Temps & Planification des Salles
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Détection automatique des conflits d'enseignants et occupation des salles de classe.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                Emploi du temps : {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setConflictError(null);
              setIsAddSlotOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Ajouter un Cours</span>
          </button>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {days.map((day) => {
          const daySlots = slots
            .filter((s) => s.dayOfWeek === day.id)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div
              key={day.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col"
            >
              <div className="p-3 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-900 flex items-center justify-between">
                <span>{day.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">{daySlots.length} cours</span>
              </div>

              <div className="p-3 space-y-2 flex-1">
                {daySlots.length === 0 ? (
                  <div className="py-6 text-center text-slate-300 text-xs italic">
                    Aucun cours programmé
                  </div>
                ) : (
                  daySlots.map((slot) => {
                    const subj = subjects.find((s) => s.id === slot.subjectId);
                    const teacher = teachers.find((t) => t.id === slot.teacherId);

                    return (
                      <div
                        key={slot.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 relative group"
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                          <span className="truncate">{subj?.name || 'Matière'}</span>
                          <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 flex items-center justify-between">
                          <span>Prof. {teacher?.name || 'Non assigné'}</span>
                          <span className="font-medium text-slate-500">{slot.room}</span>
                        </div>

                        <button
                          onClick={() => handleDeleteSlot(slot.id)}
                          title="Supprimer ce cours"
                          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Slot Modal */}
      {isAddSlotOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative text-xs">
            <button
              onClick={() => setIsAddSlotOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Programmer un Cours pour {currentClass?.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Vérification automatique des disponibilités en temps réel.
            </p>

            {conflictError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{conflictError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSlot} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Jour de la semaine</label>
                <select
                  value={slotForm.dayOfWeek}
                  onChange={(e) => setSlotForm({ ...slotForm, dayOfWeek: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  {days.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Matière</label>
                <select
                  value={slotForm.subjectId}
                  onChange={(e) => setSlotForm({ ...slotForm, subjectId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Enseignant</label>
                <select
                  value={slotForm.teacherId}
                  onChange={(e) => setSlotForm({ ...slotForm, teacherId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Heure de début</label>
                  <input
                    type="time"
                    required
                    value={slotForm.startTime}
                    onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Heure de fin</label>
                  <input
                    type="time"
                    required
                    value={slotForm.endTime}
                    onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Salle attribuée</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Salle 12 ou Labo SVT"
                  value={slotForm.room}
                  onChange={(e) => setSlotForm({ ...slotForm, room: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSlotOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                >
                  Valider le Cours
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
