import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  FileText,
  CreditCard,
  GraduationCap,
  Users,
  Download,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { formatXOF, formatDateFR } from '../../utils/formatters';

export const DocumentsReports: React.FC = () => {
  const { currentSchool } = useAuth();
  const schoolId = currentSchool?.id || '';

  const students = dataService.getStudents(schoolId);
  const classes = dataService.getClasses(schoolId);
  const payments = dataService.getPayments(schoolId);

  // Unpaid students calculation
  const unpaidStudents = students.filter((st) => {
    const summary = dataService.getStudentFinancialSummary(schoolId, st.id);
    return summary.balance > 0;
  });

  const [activeReport, setActiveReport] = useState<'unpaid' | 'journal' | null>(null);

  if (!currentSchool) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Documents Pédagogiques & Rapports Officiels
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Génération, exportation et impression des registres certifiés pour {currentSchool.name}.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
        >
          <Printer className="w-4 h-4 text-emerald-400" />
          <span>Imprimer la Page</span>
        </button>
      </div>

      {/* Document Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Doc 1: Relance Scolarité */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-3">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">État des Impayés de Scolarité</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Liste nominative des élèves en retard de versement des tranches avec coordonnées téléphoniques des parents pour relance.
            </p>
            <div className="mt-3 text-xs font-bold text-amber-800 font-mono-numbers">
              {unpaidStudents.length} élèves concernés
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveReport('unpaid')}
              className="w-full py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Générer l'État des Impayés</span>
            </button>
          </div>
        </div>

        {/* Doc 2: Cash Journal */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Grand Livre & Journal de Caisse</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Récapitulatif chronologique de tous les encaissements validés (espèces, virements, Mobile Money) avec n° de reçus.
            </p>
            <div className="mt-3 text-xs font-bold text-emerald-800 font-mono-numbers">
              {payments.filter((p) => p.status === 'VALIDE').length} opérations validées
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveReport('journal')}
              className="w-full py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Générer le Journal de Caisse</span>
            </button>
          </div>
        </div>

        {/* Doc 3: Fiches Pédagogiques */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center mb-3">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Bulletins Trimestriels Officiels</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Impression des bulletins individuels ou par classe selon les maquettes de l'inspection académique.
            </p>
            <div className="mt-3 text-xs font-bold text-purple-800">
              Conforme programme Bénin
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="text-[11px] text-slate-400 text-center">
              Accessible via l'onglet <em>"Notes & Bulletins"</em>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Report Display */}
      {activeReport === 'unpaid' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                État Récapitulatif des Impayés de Scolarité — Relance
              </h2>
              <p className="text-xs text-slate-500">
                {currentSchool.name} · Année {currentSchool.currentAcademicYear}
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer la Liste de Relance</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Matricule</th>
                  <th className="py-2.5 px-3">Nom & Prénoms</th>
                  <th className="py-2.5 px-3">Classe</th>
                  <th className="py-2.5 px-3">Parent Référent</th>
                  <th className="py-2.5 px-3">Contact WhatsApp</th>
                  <th className="py-2.5 px-3 text-right">Reste Dû (FCFA)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {unpaidStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">
                      Toutes les scolarités sont actuellement soldées !
                    </td>
                  </tr>
                ) : (
                  unpaidStudents.map((st) => {
                    const sm = dataService.getStudentFinancialSummary(schoolId, st.id);
                    const cl = classes.find((c) => c.id === st.classId);

                    return (
                      <tr key={st.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold">{st.matricule}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {st.lastName.toUpperCase()} {st.firstName}
                        </td>
                        <td className="py-2.5 px-3">{cl?.name}</td>
                        <td className="py-2.5 px-3">{st.parentName}</td>
                        <td className="py-2.5 px-3 font-mono">{st.parentPhone}</td>
                        <td className="py-2.5 px-3 text-right font-mono-numbers font-bold text-amber-800">
                          {formatXOF(sm.balance)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeReport === 'journal' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Grand Livre des Encaissements de Scolarité
              </h2>
              <p className="text-xs text-slate-500">
                Registre chronologique des recettes de scolarité certifiées.
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer le Grand Livre</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">N° Reçu</th>
                  <th className="py-2.5 px-3">Élève</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3">Référence</th>
                  <th className="py-2.5 px-3 text-right">Montant Encaissé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {payments
                  .filter((p) => p.status === 'VALIDE')
                  .map((p) => {
                    const st = students.find((s) => s.id === p.studentId);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3">{formatDateFR(p.date)}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{p.receiptNumber}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">
                          {st ? `${st.lastName.toUpperCase()} ${st.firstName}` : p.payerName}
                        </td>
                        <td className="py-2.5 px-3">{p.method}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{p.reference}</td>
                        <td className="py-2.5 px-3 text-right font-mono-numbers font-bold text-emerald-800">
                          {formatXOF(p.amount)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
