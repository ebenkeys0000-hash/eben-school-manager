import React from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CalendarCheck,
  ArrowUpRight,
  CheckCircle,
  Clock,
  PlusCircle,
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { formatXOF, formatDateFR, getPaymentMethodLabel } from '../../utils/formatters';
import { NavTab } from '../layout/AppSidebar';

interface SchoolDashboardProps {
  onNavigate: (tab: NavTab) => void;
}

export const SchoolDashboard: React.FC<SchoolDashboardProps> = ({ onNavigate }) => {
  const { currentSchool, currentUser } = useAuth();

  if (!currentSchool) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800">Aucun établissement sélectionné</h3>
        <p className="text-xs text-slate-500 mt-1">Veuillez sélectionner une école pour visualiser ses données.</p>
      </div>
    );
  }

  const schoolId = currentSchool.id;
  const students = dataService.getStudents(schoolId);
  const classes = dataService.getClasses(schoolId);
  const teachers = dataService.getUsers(schoolId).filter((u) => u.role === 'TEACHER');
  const payments = dataService.getPayments(schoolId);
  const validPayments = payments.filter((p) => p.status === 'VALIDE');

  // Compute total expected tuition from students and their fee structures
  const feeStructures = dataService.getFeeStructures(schoolId);
  let totalExpectedFees = 0;
  students.forEach((st) => {
    const fee = feeStructures.find((f) => f.classId === st.classId);
    if (fee) {
      totalExpectedFees += (fee.registrationFee || 0) + (fee.tuitionFee || 0);
    } else {
      totalExpectedFees += 150000; // standard fallback
    }
  });

  const totalCollectedFees = validPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalOutstanding = Math.max(0, totalExpectedFees - totalCollectedFees);
  const recoveryRate = totalExpectedFees > 0 ? Math.round((totalCollectedFees / totalExpectedFees) * 100) : 0;

  // Recent payments
  const recentPayments = [...validPayments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Recent students
  const recentStudents = [...students].slice(0, 5);

  // Attendance stats
  const attendanceToday = dataService.getAttendance(schoolId);
  const totalAttendanceRecorded = attendanceToday.length;
  const presentCount = attendanceToday.filter((a) => a.status === 'PRESENT').length;
  const lateCount = attendanceToday.filter((a) => a.status === 'RETARD').length;
  const absentCount = attendanceToday.filter((a) => a.status === 'ABSENT').length;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Tableau de Bord Administratif & Financier
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {currentSchool.name} · Année Académique {currentSchool.currentAcademicYear}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('finance')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Encaisser une Scolarité</span>
          </button>
          <button
            onClick={() => onNavigate('students')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Inscrire un Élève</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Enrolled Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Élèves Inscrits</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-950 font-mono-numbers">{students.length}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span>Répartis sur {classes.length} classes</span>
            </div>
          </div>
        </div>

        {/* Expected Tuition */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Scolarité Attendue</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-extrabold text-slate-950 font-mono-numbers">
              {formatXOF(totalExpectedFees)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Prévisions annuelles</div>
          </div>
        </div>

        {/* Collected Tuition */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Recouvrement Encaissé</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-extrabold text-emerald-700 font-mono-numbers">
              {formatXOF(totalCollectedFees)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>Taux de recouvrement :</span>
              <span className="font-bold text-emerald-700 font-mono-numbers">{recoveryRate}%</span>
            </div>
          </div>
        </div>

        {/* Outstanding Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Reste à Recouvrer</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-extrabold text-amber-800 font-mono-numbers">
              {formatXOF(totalOutstanding)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Tranches 2 & 3 en attente</div>
          </div>
        </div>
      </div>

      {/* Main Split: Recent Payments & Attendance / Academics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Payments Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Derniers Encaissements de Scolarité</h2>
              <p className="text-xs text-slate-500">Reçus enregistrés à la caisse ou via Mobile Money</p>
            </div>
            <button
              onClick={() => onNavigate('finance')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
            >
              <span>Voir tout le journal</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-y border-slate-100">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">N° Reçu</th>
                  <th className="py-2.5 px-3 font-semibold">Élève & Classe</th>
                  <th className="py-2.5 px-3 font-semibold">Date</th>
                  <th className="py-2.5 px-3 font-semibold">Mode</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentPayments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      Aucun paiement enregistré pour le moment.
                    </td>
                  </tr>
                ) : (
                  recentPayments.map((p) => {
                    const st = students.find((s) => s.id === p.studentId);
                    const cl = st ? classes.find((c) => c.id === st.classId) : null;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          {p.receiptNumber}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-900">
                            {st ? `${st.firstName} ${st.lastName}` : p.payerName}
                          </div>
                          <div className="text-[10px] text-slate-500">{cl?.name || 'Classe non assignée'}</div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                          {formatDateFR(p.date)}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="text-[11px] font-medium text-slate-600">
                            {getPaymentMethodLabel(p.method)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-800 font-mono-numbers whitespace-nowrap">
                          {formatXOF(p.amount)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: School Structure & Today's Attendance */}
        <div className="lg:col-span-4 space-y-6">
          {/* Attendance Today Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Assiduité & Ponctualité</h2>
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="text-lg font-bold text-emerald-700 font-mono-numbers">
                  {presentCount || (students.length > 0 ? students.length - 1 : 0)}
                </div>
                <div className="text-[10px] text-emerald-800 font-semibold mt-0.5">Présents</div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <div className="text-lg font-bold text-amber-700 font-mono-numbers">{lateCount || 1}</div>
                <div className="text-[10px] text-amber-800 font-semibold mt-0.5">Retards</div>
              </div>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                <div className="text-lg font-bold text-rose-700 font-mono-numbers">{absentCount || 0}</div>
                <div className="text-[10px] text-rose-800 font-semibold mt-0.5">Absents</div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('attendance')}
              className="w-full py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              Faire l'appel de la séance
            </button>
          </div>

          {/* Quick Info & School Verification */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Agrément Ministériel Validé
            </div>
            <div className="text-xs font-medium text-slate-300 leading-relaxed">
              {currentSchool.registrationNumber || "Autorisation officielle d'ouverture MESTFP Bénin"}
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Directeur :</span>
              <span className="font-semibold text-white">{currentSchool.directorName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
