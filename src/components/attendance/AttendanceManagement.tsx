import React, { useState } from 'react';
import {
  CalendarCheck,
  Check,
  X,
  Clock,
  HelpCircle,
  Search,
  Filter,
  Save,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { AttendanceStatus, Student, AttendanceRecord } from '../../types';
import { formatDateFR, getAttendanceStatusLabel } from '../../utils/formatters';

export const AttendanceManagement: React.FC = () => {
  const { currentSchool, currentUser, refreshData } = useAuth();
  const schoolId = currentSchool?.id || '';

  const classes = dataService.getClasses(schoolId);
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSession, setSelectedSession] = useState<'MATIN' | 'APRES_MIDI'>('MATIN');

  const students = dataService.getStudents(schoolId, { classId: selectedClassId });
  const existingRecords = dataService.getAttendance(schoolId, selectedClassId, selectedDate);

  // Local state for attendance sheet
  const [attendanceMap, setAttendanceMap] = useState<{
    [studentId: string]: { status: AttendanceStatus; reason?: string };
  }>(() => {
    const map: { [id: string]: { status: AttendanceStatus; reason?: string } } = {};
    students.forEach((st) => {
      const rec = existingRecords.find((r) => r.studentId === st.id && r.session === selectedSession);
      map[st.id] = {
        status: rec?.status || 'PRESENT',
        reason: rec?.reason || ''
      };
    });
    return map;
  });

  if (!currentSchool) return null;

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleReasonChange = (studentId: string, reason: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        reason
      }
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: typeof attendanceMap = {};
    students.forEach((st) => {
      updated[st.id] = { status: 'PRESENT', reason: '' };
    });
    setAttendanceMap(updated);
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      students.forEach((st) => {
        const item = attendanceMap[st.id] || { status: 'PRESENT' };
        dataService.recordAttendance({
          schoolId,
          classId: selectedClassId,
          studentId: st.id,
          date: selectedDate,
          session: selectedSession,
          status: item.status,
          reason: item.reason,
          recordedBy: currentUser?.name || 'Surveillant'
        });
      });
      refreshData();
      alert('Feuille de présence enregistrée avec succès !');
    } catch (err: any) {
      alert(err?.message || "Erreur lors de l'enregistrement de l'appel.");
    }
  };

  // Compute counts
  const presentCount = Object.values(attendanceMap).filter((v) => v.status === 'PRESENT').length;
  const lateCount = Object.values(attendanceMap).filter((v) => v.status === 'RETARD').length;
  const absentCount = Object.values(attendanceMap).filter((v) => v.status === 'ABSENT').length;
  const excusedCount = Object.values(attendanceMap).filter((v) => v.status === 'EXCUSE').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Registre des Présences & Assiduité
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Appel par séance, suivi des retards, justificatifs d'absence et statistiques de ponctualité.
          </p>
        </div>

        <button
          onClick={handleMarkAllPresent}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Tout marquer Présent</span>
        </button>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Classe :
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.level})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Date de la séance :
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Séance journalière :
          </label>
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value as 'MATIN' | 'APRES_MIDI')}
            className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
          >
            <option value="MATIN">Matinée (07h30 - 12h30)</option>
            <option value="APRES_MIDI">Après-midi (15h00 - 18h00)</option>
          </select>
        </div>
      </div>

      {/* Stats Counter Strip */}
      <div className="grid grid-cols-4 gap-3 text-xs text-center">
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
          <div className="text-lg font-bold text-emerald-800 font-mono-numbers">{presentCount}</div>
          <div className="text-[10px] text-emerald-700 font-semibold">Présents</div>
        </div>
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
          <div className="text-lg font-bold text-amber-800 font-mono-numbers">{lateCount}</div>
          <div className="text-[10px] text-amber-700 font-semibold">Retards</div>
        </div>
        <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
          <div className="text-lg font-bold text-rose-800 font-mono-numbers">{absentCount}</div>
          <div className="text-[10px] text-rose-700 font-semibold">Absents Non Justifiés</div>
        </div>
        <div className="p-3 bg-sky-50 rounded-xl border border-sky-200">
          <div className="text-lg font-bold text-sky-800 font-mono-numbers">{excusedCount}</div>
          <div className="text-[10px] text-sky-700 font-semibold">Absences Justifiées</div>
        </div>
      </div>

      {/* Attendance Sheet Table */}
      <form onSubmit={handleSaveAttendance} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">
            Fiche d'Émargement - {formatDateFR(selectedDate, true)} ({selectedSession === 'MATIN' ? 'Matin' : 'Après-midi'})
          </span>

          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Valider la Feuille d'Appel</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Matricule</th>
                <th className="py-3 px-4 font-bold">Nom & Prénoms</th>
                <th className="py-3 px-4 font-bold">Statut de Présence</th>
                <th className="py-3 px-4 font-bold">Motif / Justificatif (si retard ou absence)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {students.map((st) => {
                const currentVal = attendanceMap[st.id] || { status: 'PRESENT' };
                return (
                  <tr key={st.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{st.matricule}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {st.lastName.toUpperCase()} {st.firstName}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 gap-1">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'PRESENT')}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${
                            currentVal.status === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Présent
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'RETARD')}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${
                            currentVal.status === 'RETARD'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Retard
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'ABSENT')}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${
                            currentVal.status === 'ABSENT'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'EXCUSE')}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${
                            currentVal.status === 'EXCUSE'
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Excusé
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {currentVal.status !== 'PRESENT' ? (
                        <input
                          type="text"
                          placeholder="Ex: Retard 15 min, circulation dense ou certificat médical"
                          value={currentVal.reason || ''}
                          onChange={(e) => handleReasonChange(st.id, e.target.value)}
                          className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                        />
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </form>
    </div>
  );
};
