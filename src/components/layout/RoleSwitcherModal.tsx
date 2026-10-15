import React from 'react';
import { X, Shield, Building2, User, Check, ArrowRight, Info, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { UserRole } from '../../types';
import { getRoleLabel } from '../../utils/formatters';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, currentSchool, switchDemoRole } = useAuth();
  const schools = dataService.getSchools();

  if (!isOpen) return null;

  const rolesList: { role: UserRole; title: string; desc: string }[] = [
    {
      role: 'DIRECTOR',
      title: "Directeur d'Établissement",
      desc: "Accès complet à la gestion administrative, financière et pédagogique de son école."
    },
    {
      role: 'ADMIN',
      title: "Administrateur Scolaire",
      desc: "Configuration des classes, matières, personnel, inscriptions et paramètres."
    },
    {
      role: 'ACCOUNTANT',
      title: "Comptable / Gestionnaire Financier",
      desc: "Recouvrement, encaissement par tranches, reçus officiels, journal de caisse."
    },
    {
      role: 'TEACHER',
      title: "Professeur / Enseignant",
      desc: "Saisie des notes, calcul des moyennes et appel des présences pour ses classes assignées."
    },
    {
      role: 'SUPERVISOR',
      title: "Surveillant Général / Censeur",
      desc: "Gestion de la ponctualité, absences, discipline et emploi du temps."
    },
    {
      role: 'SECRETARY',
      title: "Secrétaire Administratif",
      desc: "Inscriptions d'élèves, génération des fiches et certificats de scolarité."
    },
    {
      role: 'PARENT',
      title: "Parent d'Élève",
      desc: "Consultation exclusive des notes, bulletins, retards et reçus de ses enfants."
    },
    {
      role: 'SUPER_ADMIN',
      title: "Super Administrateur SaaS",
      desc: "Gestion de la plateforme globale, forfaits, abonnements et supervision des écoles."
    }
  ];

  const handleSelect = (role: UserRole, schoolId?: string) => {
    switchDemoRole(role, schoolId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Simulateur de Rôles & Isolation Multi-Tenant</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Tester les 8 Rôles & l'Étanchéité des Écoles
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Changez instantanément d'établissement ou de profil utilisateur pour vérifier que les données sont hermétiquement cloisonnées.
          </p>
        </div>

        {/* Tenant Isolation Test Banner */}
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Test d'isolation des données entre deux écoles différentes :</span>
          </div>
          <p className="leading-relaxed">
            Passez de <strong>Complexe Scolaire La Renaissance (Cotonou)</strong> à <strong>Collège Catholique Saint-Jean (Porto-Novo)</strong> : vous constaterez que la liste des élèves, les classes, les enseignants et les reçus de caisse sont <strong>totalement indépendants et inaccessibles</strong> d'un établissement à l'autre.
          </p>
        </div>

        {/* School Picker */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            1. Choisir l'Établissement Scolaire (Tenant)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {schools.map((s) => {
              const isCurrent = currentSchool?.id === s.id && currentUser?.role !== 'SUPER_ADMIN';
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelect(currentUser?.role || 'DIRECTOR', s.id)}
                  className={`p-3.5 text-left rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900">{s.name}</span>
                    {isCurrent && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <div className="text-xs text-slate-500">
                    {s.city}, {s.country} · <span className="font-mono text-emerald-700 font-semibold">{s.code}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Role Picker */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            2. Choisir le Rôle à Simuler
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {rolesList.map(({ role, title, desc }) => {
              const isActive = currentUser?.role === role;
              return (
                <button
                  key={role}
                  onClick={() => handleSelect(role)}
                  className={`p-3 text-left rounded-xl border transition-all flex flex-col justify-between ${
                    isActive
                      ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900">{title}</span>
                      {isActive && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
