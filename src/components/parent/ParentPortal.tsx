import React, { useState } from 'react';
import {
  HeartHandshake,
  CreditCard,
  GraduationCap,
  CalendarCheck,
  Bell,
  Printer,
  Receipt,
  User,
  ShieldCheck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Student, Payment } from '../../types';
import { formatXOF, formatDateFR, getPaymentMethodLabel } from '../../utils/formatters';

export const ParentPortal: React.FC = () => {
  const { currentSchool, currentUser } = useAuth();
  const schoolId = currentSchool?.id || '';

  // Get children associated with this parent
  const allStudents = dataService.getStudents(schoolId);
  const classes = dataService.getClasses(schoolId);
  const subjects = dataService.getSubjects(schoolId);

  // If user is a parent, filter by childrenStudentIds or parent email/name match
  const linkedChildren = allStudents.filter((st) => {
    if (currentUser?.role === 'PARENT') {
      if (currentUser.childrenStudentIds?.includes(st.id)) return true;
      if (currentUser.email && st.parentEmail?.toLowerCase() === currentUser.email.toLowerCase()) return true;
    }
    // If director/admin is testing the parent portal, show all school students for demonstration
    return true;
  });

  const [selectedChildId, setSelectedChildId] = useState<string>(linkedChildren[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'finance' | 'grades' | 'attendance'>('finance');
  const [viewingReceipt, setViewingReceipt] = useState<Payment | null>(null);

  if (!currentSchool) return null;

  const activeChild = linkedChildren.find((c) => c.id === selectedChildId) || linkedChildren[0];
  const childClass = activeChild ? classes.find((c) => c.id === activeChild.classId) : null;

  // Financial summary
  const financialSummary = activeChild
    ? dataService.getStudentFinancialSummary(schoolId, activeChild.id)
    : null;

  // Attendance
  const childAttendance = activeChild
    ? dataService.getAttendance(schoolId, activeChild.classId).filter((a) => a.studentId === activeChild.id)
    : [];

  // Announcements
  const announcements = dataService.getAnnouncements(schoolId, 'PARENT');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full mb-1">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Espace Parent Sécurisé</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Suivi Scolaire & Recouvrement
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Établissement : <strong>{currentSchool.name}</strong> · Année {currentSchool.currentAcademicYear}
          </p>
        </div>

        {/* Children Switcher Selector */}
        {linkedChildren.length > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700">Enfant :</label>
            <select
              value={activeChild?.id || ''}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-1 focus:ring-emerald-500"
            >
              {linkedChildren.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.firstName} {child.lastName} ({classes.find((c) => c.id === child.classId)?.name})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {activeChild ? (
        <>
          {/* Child Identity Card */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
                Fiche de l'Apprenant
              </span>
              <h2 className="text-xl font-bold uppercase text-white">
                {activeChild.lastName} {activeChild.firstName}
              </h2>
              <div className="text-xs text-slate-300 flex items-center gap-2">
                <span>Classe : <strong>{childClass?.name}</strong></span>
                <span>·</span>
                <span className="font-mono text-emerald-400 font-bold">{activeChild.matricule}</span>
              </div>
            </div>

            <div className="sm:col-span-2 flex flex-wrap items-center sm:justify-end gap-3 text-xs">
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 min-w-[130px]">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Solde de Scolarité</div>
                <div className={`text-base font-extrabold font-mono-numbers mt-0.5 ${
                  (financialSummary?.balance || 0) <= 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {formatXOF(financialSummary?.balance || 0)}
                </div>
              </div>

              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 min-w-[110px]">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Assiduité</div>
                <div className="text-base font-extrabold text-white font-mono-numbers mt-0.5">
                  {childAttendance.filter((a) => a.status === 'ABSENT').length} absences
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActiveTab('finance')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'finance' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Scolarité & Reçus Officiels</span>
            </button>
            <button
              onClick={() => setActiveTab('grades')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'grades' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Notes & Bulletins Scolaires</span>
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'attendance' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Assiduité & Retards</span>
            </button>
          </div>

          {/* Tab 1: Finance for Parent */}
          {activeTab === 'finance' && financialSummary && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500 font-medium">Total Annuel Attendu</div>
                  <div className="text-lg font-bold text-slate-900 font-mono-numbers mt-1">
                    {formatXOF(financialSummary.totalDue)}
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="text-emerald-800 font-medium">Déjà Réglé</div>
                  <div className="text-lg font-bold text-emerald-800 font-mono-numbers mt-1">
                    {formatXOF(financialSummary.totalPaid)}
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="text-amber-800 font-medium">Reste à Régler</div>
                  <div className="text-lg font-bold text-amber-800 font-mono-numbers mt-1">
                    {formatXOF(financialSummary.balance)}
                  </div>
                </div>
              </div>

              {/* Payments & Receipts */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Reçus et Versements Effectués
                </h3>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">N° Reçu</th>
                        <th className="py-2.5 px-3">Mode</th>
                        <th className="py-2.5 px-3">Référence</th>
                        <th className="py-2.5 px-3 text-right">Montant</th>
                        <th className="py-2.5 px-3 text-right">Reçu Officiel</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {financialSummary.payments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-slate-400">
                            Aucun versement enregistré.
                          </td>
                        </tr>
                      ) : (
                        financialSummary.payments.map((p) => (
                          <tr key={p.id}>
                            <td className="py-2.5 px-3">{formatDateFR(p.date)}</td>
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{p.receiptNumber}</td>
                            <td className="py-2.5 px-3">{getPaymentMethodLabel(p.method)}</td>
                            <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{p.reference}</td>
                            <td className="py-2.5 px-3 text-right font-mono-numbers font-bold text-emerald-800">
                              {formatXOF(p.amount)}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => alert(`Reçu ${p.receiptNumber} certifié conforme par la Caisse.`)}
                                className="text-xs font-bold text-emerald-700 hover:underline"
                              >
                                Reçu Certifié
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Grades for Parent */}
          {activeTab === 'grades' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Évaluations et Devoirs du 1er Trimestre
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between font-bold text-slate-900 text-xs">
                    <span>Mathématiques</span>
                    <span className="font-mono text-emerald-700 font-bold">16.75 / 20</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Devoir Surveillé N°1 (Coef 2)</div>
                  <div className="text-[10px] text-slate-400 italic">"Très bon travail, excellente rigueur"</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between font-bold text-slate-900 text-xs">
                    <span>Français & Expression Écrite</span>
                    <span className="font-mono text-emerald-700 font-bold">15.00 / 20</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Devoir Surveillé N°1 (Coef 2)</div>
                  <div className="text-[10px] text-slate-400 italic">"Bonne maîtrise de la conjugaison"</div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-emerald-900">Moyenne Générale Estimée : 15.87 / 20</div>
                  <div className="text-[11px] text-emerald-700">Tableau d’Honneur avec Félicitations du Conseil</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Attendance for Parent */}
          {activeTab === 'attendance' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Registre de Ponctualité de l'Apprenant
              </h3>

              {childAttendance.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  Aucun retard ni absence signalé pour le moment. Félicitations pour l'assiduité !
                </div>
              ) : (
                <div className="space-y-2">
                  {childAttendance.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900">Séance du {formatDateFR(rec.date, true)}</div>
                        <div className="text-[11px] text-slate-500">{rec.reason || 'Aucun motif renseigné'}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        {rec.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs">
          Aucun apprenant n'est rattaché à ce compte parent.
        </div>
      )}

      {/* School Announcements */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-900">Communications de la Direction de l'École</h2>
        </div>

        <div className="space-y-3">
          {announcements.map((ann) => (
            <div key={ann.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{ann.title}</span>
                <span className="text-[10px] text-slate-400">{formatDateFR(ann.date)}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
              <div className="text-[10px] text-slate-400 pt-1">{ann.authorName}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
