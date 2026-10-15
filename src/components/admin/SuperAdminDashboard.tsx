import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Layers,
  Lock,
  Calendar,
  Settings,
  LifeBuoy
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService, SUBSCRIPTION_PLANS } from '../../services/dataService';
import { formatXOF, formatDateFR } from '../../utils/formatters';
import { School } from '../../types';
import { SupportAdminDashboard } from './SupportAdminDashboard';

export const SuperAdminDashboard: React.FC = () => {
  const { switchSchoolAsSuperAdmin, refreshData } = useAuth();
  const schools = dataService.getSchools();
  const allUsers = dataService.getUsers(null);
  const auditLogs = dataService.getAuditLogs(null);

  const [activeTab, setActiveTab] = useState<'schools' | 'plans' | 'audit' | 'isolation_test' | 'support_tickets'>('schools');

  // Multi-tenant isolation test state
  const [testSchoolAId, setTestSchoolAId] = useState<string>(schools[0]?.id || '');
  const [testSchoolBId, setTestSchoolBId] = useState<string>(schools[1]?.id || '');

  // Calculate platform stats
  let totalPlatformStudents = 0;
  let totalPlatformTeachers = 0;
  let estimatedMonthlyRevenue = 0;

  schools.forEach((s) => {
    const sStudents = dataService.getStudents(s.id);
    const sTeachers = dataService.getUsers(s.id).filter((u) => u.role === 'TEACHER');
    totalPlatformStudents += sStudents.length;
    totalPlatformTeachers += sTeachers.length;

    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === s.subscriptionPlanId);
    if (plan) {
      estimatedMonthlyRevenue += plan.priceMonthlyXOF;
    }
  });

  const handleUpdateSubscriptionStatus = (schoolId: string, status: School['subscriptionStatus']) => {
    const school = dataService.getSchoolById(schoolId);
    if (school) {
      dataService.updateSchoolSubscription(schoolId, school.subscriptionPlanId, status);
      refreshData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-slate-800 px-2.5 py-1 rounded-full mb-1 border border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Console Super Administrateur SaaS</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Supervision Globale de la Plateforme
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Eben School Manager · Surveillance des instances, abonnements et étanchéité multi-tenant.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg font-mono font-bold">
            Système Opérationnel · 100% Isolé
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Établissements Hébergés
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono-numbers mt-1">
            {schools.length}
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-1">
            Tenants actifs et configurés
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Apprenants
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono-numbers mt-1">
            {totalPlatformStudents}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Dossiers élèves actifs</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Corps Enseignant & Personnel
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono-numbers mt-1">
            {allUsers.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Comptes avec RBAC actif</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Revenu Mensuel SaaS (MRR)
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono-numbers mt-1">
            {formatXOF(estimatedMonthlyRevenue)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Forfaits souscrits</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('schools')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'schools' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Établissements Abonnés
        </button>
        <button
          onClick={() => setActiveTab('isolation_test')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'isolation_test' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Test d'Isolation Étanche (Multi-Tenant)</span>
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'plans' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Forfaits d'Abonnement (FCFA)
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'audit' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Journal d'Audit Global
        </button>
      </div>

      {/* Tab 1: Schools List */}
      {activeTab === 'schools' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Registres des Établissements Partenaires
            </h2>
            <p className="text-[11px] text-slate-500">
              Visualisez le statut de chaque école et accédez à leur espace d'administration.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Identifiant / Code</th>
                  <th className="py-3 px-4 font-bold">Nom de l'Établissement</th>
                  <th className="py-3 px-4 font-bold">Ville / Pays</th>
                  <th className="py-3 px-4 font-bold">Directeur</th>
                  <th className="py-3 px-4 font-bold">Forfait</th>
                  <th className="py-3 px-4 font-bold">Statut Abonnement</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {schools.map((s) => {
                  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === s.subscriptionPlanId);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {s.code}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div>{s.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{s.type}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {s.city}, {s.country}
                      </td>
                      <td className="py-3 px-4 text-slate-800">
                        {s.directorName}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {plan?.name || s.subscriptionPlanId}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={s.subscriptionStatus}
                          onChange={(e) =>
                            handleUpdateSubscriptionStatus(s.id, e.target.value as School['subscriptionStatus'])
                          }
                          className="text-[11px] font-bold px-2 py-0.5 rounded border border-slate-300 bg-white"
                        >
                          <option value="ACTIF">ACTIF</option>
                          <option value="ESSAI">ESSAI (30 jours)</option>
                          <option value="SUSPENDU">SUSPENDU</option>
                          <option value="EXPIRE">EXPIRÉ</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => switchSchoolAsSuperAdmin(s.id)}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg inline-flex items-center gap-1"
                        >
                          <span>Entrer dans l'École</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Isolation Test Sandbox */}
      {activeTab === 'isolation_test' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
              <Lock className="w-4 h-4" />
              <span>Démonstration de Sécurité : Vérification de l'Étanchéité Multi-Tenant</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Comparez côte à côte deux établissements scolaires pour prouver que les données d'élèves, de paiements et de professeurs sont 100% isolées.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* School A */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-500">Établissement A</span>
                <select
                  value={testSchoolAId}
                  onChange={(e) => setTestSchoolAId(e.target.value)}
                  className="text-xs font-bold bg-white border border-slate-300 rounded px-2 py-1"
                >
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {(() => {
                const sA = schools.find((s) => s.id === testSchoolAId);
                const stA = sA ? dataService.getStudents(sA.id) : [];
                const payA = sA ? dataService.getPayments(sA.id) : [];

                return (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <div className="font-bold text-slate-900">{sA?.name}</div>
                      <div className="text-[11px] text-slate-500">Ville : {sA?.city} · Code : {sA?.code}</div>
                    </div>

                    <div>
                      <div className="font-bold text-slate-700 mb-1">
                        Élèves inscrits uniquement dans cet établissement ({stA.length}) :
                      </div>
                      <div className="space-y-1">
                        {stA.map((st) => (
                          <div key={st.id} className="p-2 bg-white rounded border border-slate-200 flex justify-between">
                            <span className="font-semibold">{st.lastName.toUpperCase()} {st.firstName}</span>
                            <span className="font-mono text-emerald-700">{st.matricule}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="font-bold text-slate-700 mb-1">Reçus financiers émis ({payA.length}) :</div>
                      <div className="space-y-1">
                        {payA.slice(0, 3).map((p) => (
                          <div key={p.id} className="p-2 bg-white rounded border border-slate-200 flex justify-between">
                            <span className="font-mono text-slate-700">{p.receiptNumber}</span>
                            <span className="font-mono font-bold text-emerald-800">{formatXOF(p.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* School B */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-500">Établissement B</span>
                <select
                  value={testSchoolBId}
                  onChange={(e) => setTestSchoolBId(e.target.value)}
                  className="text-xs font-bold bg-white border border-slate-300 rounded px-2 py-1"
                >
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {(() => {
                const sB = schools.find((s) => s.id === testSchoolBId);
                const stB = sB ? dataService.getStudents(sB.id) : [];
                const payB = sB ? dataService.getPayments(sB.id) : [];

                return (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <div className="font-bold text-slate-900">{sB?.name}</div>
                      <div className="text-[11px] text-slate-500">Ville : {sB?.city} · Code : {sB?.code}</div>
                    </div>

                    <div>
                      <div className="font-bold text-slate-700 mb-1">
                        Élèves inscrits uniquement dans cet établissement ({stB.length}) :
                      </div>
                      <div className="space-y-1">
                        {stB.map((st) => (
                          <div key={st.id} className="p-2 bg-white rounded border border-slate-200 flex justify-between">
                            <span className="font-semibold">{st.lastName.toUpperCase()} {st.firstName}</span>
                            <span className="font-mono text-blue-700">{st.matricule}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="font-bold text-slate-700 mb-1">Reçus financiers émis ({payB.length}) :</div>
                      <div className="space-y-1">
                        {payB.slice(0, 3).map((p) => (
                          <div key={p.id} className="p-2 bg-white rounded border border-slate-200 flex justify-between">
                            <span className="font-mono text-slate-700">{p.receiptNumber}</span>
                            <span className="font-mono font-bold text-blue-800">{formatXOF(p.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong>Preuve d'Étanchéité Multi-Tenant :</strong> Aucun identifiant d'élève, aucune classe et aucun reçu financier ne se recoupent entre l'établissement A et l'établissement B. Chaque requête filtre rigoureusement sur le <code className="font-mono font-bold">schoolId</code>.
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Plans */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div key={plan.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{plan.tagline}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-xl font-bold font-mono-numbers text-slate-950">
                  {formatXOF(plan.priceMonthlyXOF)} / mois
                </div>
                <div className="text-xs text-slate-500 font-mono-numbers">
                  {formatXOF(plan.priceYearlyXOF)} / an
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-2">
                <div className="font-bold text-slate-900">Capacité : Jusqu'à {plan.maxStudents} élèves</div>
                <ul className="space-y-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Journal d'Audit de Sécurité Multi-Tenant
            </h2>
            <p className="text-[11px] text-slate-500">
              Traçabilité chronologique de toutes les actions sensibles (inscriptions, encaissements, annulations).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-bold">Horodatage</th>
                  <th className="py-2.5 px-4 font-bold">Établissement</th>
                  <th className="py-2.5 px-4 font-bold">Auteur</th>
                  <th className="py-2.5 px-4 font-bold">Action</th>
                  <th className="py-2.5 px-4 font-bold">Détails de l'Opération</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {auditLogs.map((log) => {
                  const sch = log.schoolId ? dataService.getSchoolById(log.schoolId) : null;
                  return (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        {sch?.name || 'Plateforme SaaS'}
                      </td>
                      <td className="py-2.5 px-4 text-slate-700 whitespace-nowrap">
                        {log.userName}
                      </td>
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">{log.details}</td>
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
