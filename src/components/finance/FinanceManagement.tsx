import React, { useState } from 'react';
import {
  CreditCard,
  PlusCircle,
  Search,
  Filter,
  Printer,
  Ban,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Receipt,
  FileSpreadsheet,
  Download,
  QrCode,
  ShieldCheck,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Payment, Student, FeeStructure, PaymentMethod, FeeCategory } from '../../types';
import {
  formatXOF,
  formatCurrency,
  formatDateFR,
  numberToFrenchWords,
  numberToEnglishWords,
  getPaymentMethodLabel,
  getFeeCategoryLabel
} from '../../utils/formatters';

export const FinanceManagement: React.FC = () => {
  const { currentSchool, currentUser, refreshData } = useAuth();
  const schoolId = currentSchool?.id || '';
  const formatAmount = (val: number) => formatCurrency(val, currentSchool?.currency, currentSchool?.currencySymbol);

  const [activeTab, setActiveTab] = useState<'payments' | 'fee_structures' | 'account_statement'>('payments');
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('VALIDE');

  // Modals
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [printingReceipt, setPrintingReceipt] = useState<Payment | null>(null);
  const [cancellingPayment, setCancellingPayment] = useState<Payment | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Selected student for account statement
  const [statementStudentId, setStatementStudentId] = useState<string>('');

  // New Payment Form State
  const [formData, setFormData] = useState({
    studentId: '',
    amount: 50000,
    method: 'ESPECES' as PaymentMethod,
    reference: '',
    feeCategory: 'TRANCHE_1' as FeeCategory,
    payerName: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [formError, setFormError] = useState<string | null>(null);

  if (!currentSchool) return null;

  const students = dataService.getStudents(schoolId);
  const classes = dataService.getClasses(schoolId);
  const feeStructures = dataService.getFeeStructures(schoolId);
  const payments = dataService.getPayments(schoolId);

  // Filtered payments
  const filteredPayments = payments.filter((p) => {
    if (statusFilter && p.status !== statusFilter) return false;
    if (methodFilter && p.method !== methodFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const st = students.find((s) => s.id === p.studentId);
      const matchName = st ? `${st.firstName} ${st.lastName}`.toLowerCase().includes(q) : false;
      const matchRec = p.receiptNumber.toLowerCase().includes(q);
      const matchRef = p.reference.toLowerCase().includes(q);
      if (!matchName && !matchRec && !matchRef) return false;
    }
    return true;
  });

  // Calculate totals
  const totalCollected = payments
    .filter((p) => p.status === 'VALIDE')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalCancelled = payments
    .filter((p) => p.status === 'ANNULE')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleOpenRecord = () => {
    setFormError(null);
    const firstStu = students[0];
    setFormData({
      studentId: firstStu?.id || '',
      amount: 70000,
      method: 'MTN_MOMO',
      reference: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      feeCategory: 'TRANCHE_1',
      payerName: firstStu ? firstStu.parentName : '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setIsRecordModalOpen(true);
  };

  const handleStudentSelect = (stuId: string) => {
    const st = students.find((s) => s.id === stuId);
    setFormData((prev) => ({
      ...prev,
      studentId: stuId,
      payerName: st ? st.parentName : prev.payerName
    }));
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.studentId) {
      setFormError('Veuillez sélectionner un élève.');
      return;
    }
    if (!formData.amount || formData.amount <= 0) {
      setFormError('Veuillez saisir un montant valide en FCFA.');
      return;
    }
    if (!formData.reference.trim()) {
      setFormError('La référence de transaction ou de reçu est obligatoire.');
      return;
    }

    try {
      const payment = dataService.recordPayment({
        schoolId,
        studentId: formData.studentId,
        amount: Number(formData.amount),
        currency: 'XOF',
        date: formData.date,
        method: formData.method,
        reference: formData.reference,
        feeCategory: formData.feeCategory,
        payerName: formData.payerName || 'Parent / Tuteur',
        recordedByUserId: currentUser?.id || 'system',
        recordedByName: currentUser?.name || 'Caisse Centrale',
        notes: formData.notes
      });

      refreshData();
      setIsRecordModalOpen(false);
      // Immediately open printable receipt
      setPrintingReceipt(payment);
    } catch (err: any) {
      setFormError(err?.message || "Erreur lors de l'enregistrement du versement.");
    }
  };

  const handleConfirmCancel = () => {
    if (!cancellingPayment) return;
    if (!cancelReason.trim()) {
      alert("Veuillez renseigner un motif explicite d'annulation pour l'audit.");
      return;
    }

    try {
      dataService.cancelPayment(
        schoolId,
        cancellingPayment.id,
        cancelReason,
        currentUser?.name || 'Administrateur'
      );
      refreshData();
      setCancellingPayment(null);
      setCancelReason('');
    } catch (err: any) {
      alert(err?.message || "Erreur lors de l'annulation.");
    }
  };

  // Statement for selected student
  const studentStatement = statementStudentId
    ? dataService.getStudentFinancialSummary(schoolId, statementStudentId)
    : null;
  const statementStudent = statementStudentId ? dataService.getStudentById(schoolId, statementStudentId) : null;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Recouvrement des Scolarités & Caisse
            </h1>
            <span className="text-xs font-bold font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
              Devise : {currentSchool.currency} ({currentSchool.currencySymbol || currentSchool.currency})
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Échéanciers par tranches, reçus scolaires officiels, règlements espèces & Mobile Money.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenRecord}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Enregistrer un Encaissement</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Encaissé en Caisse
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono-numbers mt-1">
            {formatAmount(totalCollected)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Transactions validées</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Reçus Émis au Total
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono-numbers mt-1">
            {payments.filter((p) => p.status === 'VALIDE').length} reçus
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Numérotation infalsifiable</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Transactions Annulées / Régularisées
          </div>
          <div className="text-2xl font-extrabold text-rose-700 font-mono-numbers mt-1">
            {formatAmount(totalCancelled)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Tracées dans le journal d'audit</div>
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'payments' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Journal des Encaissements & Reçus
        </button>
        <button
          onClick={() => setActiveTab('account_statement')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'account_statement' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Relevé de Compte Élève & Échéancier
        </button>
        <button
          onClick={() => setActiveTab('fee_structures')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'fee_structures' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Grille Tarifaire des Frais par Classe
        </button>
      </div>

      {/* Tab 1: Payments Ledger */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Rechercher par élève, n° de reçu ou référence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">Tous les modes de paiement</option>
                <option value="ESPECES">Espèces (Caisse)</option>
                <option value="MTN_MOMO">MTN Mobile Money</option>
                <option value="MOOV_MONEY">Moov Money</option>
                <option value="CELTIIS_CASH">Celtiis Cash</option>
                <option value="VIREMENT">Virement Bancaire</option>
                <option value="CHEQUE">Chèque</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">Tous les statuts</option>
                <option value="VALIDE">Validés uniquement</option>
                <option value="ANNULE">Annulés uniquement</option>
              </select>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-bold">N° Reçu</th>
                    <th className="py-3 px-4 font-bold">Date</th>
                    <th className="py-3 px-4 font-bold">Élève & Matricule</th>
                    <th className="py-3 px-4 font-bold">Catégorie de Frais</th>
                    <th className="py-3 px-4 font-bold">Mode & Réf</th>
                    <th className="py-3 px-4 font-bold text-right">Montant ({currentSchool.currencySymbol || currentSchool.currency})</th>
                    <th className="py-3 px-4 font-bold">Encaissé Par</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-400">
                        Aucun paiement ne correspond aux critères sélectionnés.
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((p) => {
                      const st = students.find((s) => s.id === p.studentId);
                      const isCancelled = p.status === 'ANNULE';
                      return (
                        <tr
                          key={p.id}
                          className={`hover:bg-slate-50/70 transition-colors ${
                            isCancelled ? 'bg-rose-50/40 text-slate-400' : ''
                          }`}
                        >
                          <td className="py-3 px-4 font-mono font-bold whitespace-nowrap">
                            <span className={isCancelled ? 'line-through text-rose-500' : 'text-slate-900'}>
                              {p.receiptNumber}
                            </span>
                            {isCancelled && (
                              <span className="block text-[9px] text-rose-600 font-sans font-semibold">
                                ANNULÉ
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                            {formatDateFR(p.date)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">
                              {st ? `${st.lastName.toUpperCase()} ${st.firstName}` : p.payerName}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {st?.matricule || 'N/A'}
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="font-medium text-slate-800">
                              {getFeeCategoryLabel(p.feeCategory)}
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="font-semibold text-slate-800">{getPaymentMethodLabel(p.method)}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{p.reference}</div>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap font-mono-numbers font-bold">
                            <span className={isCancelled ? 'line-through text-slate-400' : 'text-emerald-800'}>
                              {formatAmount(p.amount)}
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-[11px] text-slate-500">
                            {p.recordedByName}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                            <button
                              onClick={() => setPrintingReceipt(p)}
                              title="Imprimer le Reçu Officiel"
                              className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            {!isCancelled && (
                              <button
                                onClick={() => {
                                  setCancellingPayment(p);
                                  setCancelReason('');
                                }}
                                title="Annuler le paiement (Erreur de caisse)"
                                className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Student Account Statement */}
      {activeTab === 'account_statement' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs max-w-xl">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Sélectionner un apprenant pour consulter son Relevé de Compte :
            </label>
            <select
              value={statementStudentId}
              onChange={(e) => setStatementStudentId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">-- Choisir un élève --</option>
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.lastName.toUpperCase()} {st.firstName} ({st.matricule}) - {classes.find((c) => c.id === st.classId)?.name}
                </option>
              ))}
            </select>
          </div>

          {statementStudent && studentStatement && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Relevé Financier : {statementStudent.lastName.toUpperCase()} {statementStudent.firstName}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Matricule : <span className="font-mono font-bold text-slate-700">{statementStudent.matricule}</span> · Classe : {classes.find((c) => c.id === statementStudent.classId)?.name}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Solde Restant Dû</div>
                    <div className={`text-xl font-extrabold font-mono-numbers ${
                      studentStatement.balance <= 0 ? 'text-emerald-700' : 'text-amber-800'
                    }`}>
                      {formatAmount(studentStatement.balance)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500 font-medium">Total Frais Attendus</div>
                  <div className="text-lg font-bold text-slate-900 font-mono-numbers mt-1">
                    {formatAmount(studentStatement.totalDue)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Inscription + Scolarité annuelle</div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="text-emerald-800 font-medium">Total Déjà Versé</div>
                  <div className="text-lg font-bold text-emerald-800 font-mono-numbers mt-1">
                    {formatAmount(studentStatement.totalPaid)}
                  </div>
                  <div className="text-[10px] text-emerald-700 mt-1">Versements validés</div>
                </div>

                <div className={`p-4 rounded-xl border ${
                  studentStatement.balance <= 0
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  <div className="font-medium">Statut de la Scolarité</div>
                  <div className="text-lg font-bold mt-1">
                    {studentStatement.balance <= 0 ? 'Totalement Soldé' : 'Versement en Attente'}
                  </div>
                  <div className="text-[10px] mt-1">
                    {studentStatement.balance <= 0 ? 'En règle pour toute l’année' : 'Tranche(s) restante(s)'}
                  </div>
                </div>
              </div>

              {/* Payments History for this Student */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Historique Chronologique des Versements
                </h4>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">N° Reçu</th>
                        <th className="py-2.5 px-3">Objet</th>
                        <th className="py-2.5 px-3">Mode de Règlement</th>
                        <th className="py-2.5 px-3 text-right">Montant Payé</th>
                        <th className="py-2.5 px-3 text-right">Reçu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {studentStatement.payments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-slate-400">
                            Aucun versement enregistré pour cet apprenant.
                          </td>
                        </tr>
                      ) : (
                        studentStatement.payments.map((pay) => (
                          <tr key={pay.id} className={pay.status === 'ANNULE' ? 'line-through text-slate-400' : ''}>
                            <td className="py-2.5 px-3">{formatDateFR(pay.date)}</td>
                            <td className="py-2.5 px-3 font-mono font-bold">{pay.receiptNumber}</td>
                            <td className="py-2.5 px-3">{getFeeCategoryLabel(pay.feeCategory)}</td>
                            <td className="py-2.5 px-3">{getPaymentMethodLabel(pay.method)}</td>
                            <td className="py-2.5 px-3 text-right font-mono-numbers font-bold text-emerald-800">
                              {formatAmount(pay.amount)}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => setPrintingReceipt(pay)}
                                className="p-1 text-slate-500 hover:text-emerald-700"
                              >
                                <Printer className="w-3.5 h-3.5 inline" />
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
        </div>
      )}

      {/* Tab 3: Fee Structures */}
      {activeTab === 'fee_structures' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Grille des Droits d'Inscription & Tranches de Scolarité
              </h3>
              <p className="text-[11px] text-slate-500">
                Montants configurés en {currentSchool.currencySymbol || currentSchool.currency} pour l'année {currentSchool.currentAcademicYear}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Classe</th>
                  <th className="py-3 px-4 font-bold text-right">Inscription</th>
                  <th className="py-3 px-4 font-bold text-right">1ère Tranche (Rentrée)</th>
                  <th className="py-3 px-4 font-bold text-right">2ème Tranche (Déc.)</th>
                  <th className="py-3 px-4 font-bold text-right">3ème Tranche (Fév.)</th>
                  <th className="py-3 px-4 font-bold text-right">Total Scolarité</th>
                  <th className="py-3 px-4 font-bold text-right">Frais Tenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {classes.map((cls) => {
                  const fee = feeStructures.find((f) => f.classId === cls.id);
                  return (
                    <tr key={cls.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {cls.name} <span className="text-[10px] text-slate-400 font-normal">({cls.level})</span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono-numbers">
                        {formatAmount(fee?.registrationFee || 25000)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono-numbers">
                        {formatAmount(fee?.installment1 || 70000)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono-numbers">
                        {formatAmount(fee?.installment2 || 60000)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono-numbers">
                        {formatAmount(fee?.installment3 || 50000)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono-numbers font-bold text-slate-900">
                        {formatAmount(fee?.tuitionFee || 180000)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono-numbers text-slate-500">
                        {formatAmount(fee?.uniformFee || 15000)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8">
            <button
              onClick={() => setIsRecordModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Encaisser un Paiement de Scolarité
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Délivrance d'un reçu officiel de caisse avec référence unique.
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Élève concerné <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.studentId}
                  onChange={(e) => handleStudentSelect(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">-- Choisir un apprenant --</option>
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.lastName.toUpperCase()} {st.firstName} ({st.matricule}) - {classes.find((c) => c.id === st.classId)?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Montant Versé (FCFA) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="1000"
                    min="1000"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono-numbers font-bold text-slate-900 focus:ring-1 focus:ring-emerald-500"
                  />
                  <div className="text-[10px] text-emerald-700 mt-1 italic">
                    Soit : {numberToFrenchWords(formData.amount)} francs CFA
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Catégorie de Frais</label>
                  <select
                    value={formData.feeCategory}
                    onChange={(e) => setFormData({ ...formData, feeCategory: e.target.value as FeeCategory })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="INSCRIPTION">Frais d'inscription</option>
                    <option value="TRANCHE_1">1ère Tranche (Rentrée)</option>
                    <option value="TRANCHE_2">2ème Tranche (Décembre)</option>
                    <option value="TRANCHE_3">3ème Tranche (Février)</option>
                    <option value="FRAIS_ANNEXES">Frais annexes (Cantine / Tenue)</option>
                    <option value="AUTRE">Autre versement</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mode de Règlement</label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value as PaymentMethod })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="ESPECES">Espèces au guichet</option>
                    <option value="MTN_MOMO">MTN Mobile Money</option>
                    <option value="MOOV_MONEY">Moov Money</option>
                    <option value="CELTIIS_CASH">Celtiis Cash</option>
                    <option value="VIREMENT">Virement bancaire</option>
                    <option value="CHEQUE">Chèque bancaire</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Référence de Transaction <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: TXN-MTN-994829 ou N° Chèque"
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nom de la personne qui paie</label>
                  <input
                    type="text"
                    required
                    placeholder="Mme Mensah"
                    value={formData.payerName}
                    onChange={(e) => setFormData({ ...formData, payerName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date d'encaissement</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observations / Notes (facultatif)</label>
                <input
                  type="text"
                  placeholder="Ex: Versement partiel 1ère tranche"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Valider & Générer le Reçu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Cancellation Modal */}
      {cancellingPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative text-xs">
            <h3 className="text-base font-bold text-rose-700 mb-2 flex items-center gap-2">
              <Ban className="w-4 h-4" />
              <span>Annulation Auditable de Reçu</span>
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Vous êtes sur le point d'annuler le reçu <strong>{cancellingPayment.receiptNumber}</strong> d'un montant de{' '}
              <strong>{formatAmount(cancellingPayment.amount)}</strong>. Cette action sera enregistrée dans le journal d'audit.
            </p>

            <div className="mb-4">
              <label className="block font-bold text-slate-700 mb-1">
                Motif obligatoire de l'annulation <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Ex: Erreur de saisie de classe ou rejet du chèque bancaire..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-rose-500 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setCancellingPayment(null)}
                className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
              >
                Retour
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
              >
                Confirmer l'Annulation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Official School Receipt Modal */}
      {printingReceipt && (() => {
        const student = dataService.getStudentById(schoolId, printingReceipt.studentId);
        const studentClass = student ? classes.find((c) => c.id === student.classId) : null;
        const summary = student ? dataService.getStudentFinancialSummary(schoolId, student.id) : null;

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-8 border border-slate-300 shadow-2xl relative my-8 text-black">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-200 no-print">
                <span className="text-xs font-bold text-slate-500">Reçu de Caisse Officiel</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimer le Reçu</span>
                  </button>
                  <button
                    onClick={() => setPrintingReceipt(null)}
                    className="p-2 text-slate-500 hover:text-slate-800 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="p-6 border-2 border-slate-900 rounded-xl bg-white space-y-5 text-xs">
                {/* School Header */}
                <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {currentSchool.country ? `RÉPUBLIQUE - ${currentSchool.country.toUpperCase()}` : 'RÉPUBLIQUE DU BÉNIN'} · {currentSchool.educationSystem || 'MINISTÈRE DE L’ÉDUCATION'}
                    </div>
                    <div className="text-base font-black uppercase text-slate-950">
                      {currentSchool.name}
                    </div>
                    <div className="text-[11px] text-slate-700">
                      {currentSchool.address} - {currentSchool.city}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Tél : {currentSchool.phone} · {currentSchool.registrationNumber}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-mono font-black text-slate-900 bg-slate-100 px-3 py-1 rounded border border-slate-300 inline-block">
                      {printingReceipt.receiptNumber}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      Date : <strong>{formatDateFR(printingReceipt.date, true)}</strong>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Année Scolaire {currentSchool.currentAcademicYear}
                    </div>
                  </div>
                </div>

                <div className="text-center font-extrabold uppercase tracking-wider text-sm bg-slate-50 py-1.5 border border-slate-200">
                  REÇU DE PAIEMENT DE SCOLARITÉ / TUITION FEE RECEIPT
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div><strong>Nom & Prénoms :</strong> <span className="uppercase font-bold">{student?.lastName} {student?.firstName}</span></div>
                    <div><strong>Matricule :</strong> <span className="font-mono font-bold">{student?.matricule}</span></div>
                    <div><strong>Classe :</strong> <span className="font-semibold">{studentClass?.name || 'N/A'}</span></div>
                    <div><strong>Payeur :</strong> {printingReceipt.payerName}</div>
                  </div>

                  <div className="space-y-1.5">
                    <div><strong>Catégorie :</strong> {getFeeCategoryLabel(printingReceipt.feeCategory)}</div>
                    <div><strong>Mode de Règlement :</strong> {getPaymentMethodLabel(printingReceipt.method)}</div>
                    <div><strong>Référence Trans. :</strong> <span className="font-mono">{printingReceipt.reference}</span></div>
                    <div><strong>Encaissé par :</strong> {printingReceipt.recordedByName}</div>
                  </div>
                </div>

                {/* Amount in Words */}
                <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Montant Reçu :</span>
                    <span className="text-base font-extrabold font-mono-numbers text-slate-950">
                      {formatAmount(printingReceipt.amount)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-700 italic">
                    {currentSchool.defaultLanguage === 'en' ? (
                      <>Amount received in words: <strong>{numberToEnglishWords(printingReceipt.amount)} {currentSchool.currencySymbol || currentSchool.currency}</strong>.</>
                    ) : (
                      <>Arrêté le présent reçu à la somme de : <strong>{numberToFrenchWords(printingReceipt.amount)} {currentSchool.currencySymbol || 'francs CFA'}</strong>.</>
                    )}
                  </div>
                </div>

                {/* Balance After this payment */}
                {summary && (
                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                    <span>Total payé à ce jour : <strong>{formatAmount(summary.totalPaid)}</strong></span>
                    <span>Solde restant dû : <strong className="text-amber-800">{formatAmount(summary.balance)}</strong></span>
                  </div>
                )}

                {/* Stamp & Signatures */}
                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div className="text-center">
                    <div className="font-bold text-[11px]">Signature du Payeur :</div>
                    <div className="h-14"></div>
                  </div>

                  <div className="text-center">
                    <div className="font-bold text-[11px]">Le Caissier / Service Comptable :</div>
                    <div className="h-14 flex items-center justify-center">
                      <div className="border-2 border-emerald-700 text-emerald-800 font-extrabold text-[11px] uppercase px-3 py-1 rotate-[-4deg] rounded">
                        CAISSE - {currentSchool.name.substring(0, 18)} - PAYÉ
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
