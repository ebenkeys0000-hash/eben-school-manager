import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onOpenRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess, onOpenRegister }) => {
  const { login, switchDemoRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const success = login(email);
    if (success) {
      onSuccess();
      onClose();
    } else {
      setError("Adresse email introuvable. Veuillez vérifier votre saisie ou utiliser les profils de démonstration ci-dessous.");
    }
  };

  const handleQuickLogin = (role: UserRole, schoolId?: string) => {
    switchDemoRole(role, schoolId);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Accès Sécurisé</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Connexion à votre Espace</h2>
          <p className="text-xs text-slate-500 mt-1">
            Connectez-vous pour accéder aux données de votre établissement scolaire.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Adresse Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="nom@ecole.bj"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Se Connecter</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Access Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 text-center">
            Accès Rapide de Démonstration (1 clic)
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickLogin('DIRECTOR', 'school-cslr')}
              className="p-2 text-left bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg transition-colors"
            >
              <div className="font-bold text-slate-900">Directrice Cotonou</div>
              <div className="text-[10px] text-slate-500 truncate">CS La Renaissance</div>
            </button>

            <button
              onClick={() => handleQuickLogin('ACCOUNTANT', 'school-cslr')}
              className="p-2 text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-colors"
            >
              <div className="font-bold text-slate-900">Comptable / Caisse</div>
              <div className="text-[10px] text-slate-500 truncate">Recouvrement & Reçus</div>
            </button>

            <button
              onClick={() => handleQuickLogin('TEACHER', 'school-cslr')}
              className="p-2 text-left bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-lg transition-colors"
            >
              <div className="font-bold text-slate-900">Prof. de Maths</div>
              <div className="text-[10px] text-slate-500 truncate">Saisie des notes & appel</div>
            </button>

            <button
              onClick={() => handleQuickLogin('PARENT', 'school-cslr')}
              className="p-2 text-left bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-lg transition-colors"
            >
              <div className="font-bold text-slate-900">Parent d'Élève</div>
              <div className="text-[10px] text-slate-500 truncate">Mme Clarisse Mensah</div>
            </button>

            <button
              onClick={() => handleQuickLogin('DIRECTOR', 'school-ccsj')}
              className="p-2 text-left bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-lg transition-colors"
            >
              <div className="font-bold text-slate-900">École 2 (Porto-Novo)</div>
              <div className="text-[10px] text-slate-500 truncate">Test Isolation Étanche</div>
            </button>

            <button
              onClick={() => handleQuickLogin('SUPER_ADMIN')}
              className="p-2 text-left bg-slate-900 text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <div className="font-bold">Super Admin SaaS</div>
              <div className="text-[10px] text-slate-300 truncate">Gestion plateforme</div>
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">
            Votre école n'est pas encore inscrite ?{' '}
            <button
              onClick={() => {
                onClose();
                onOpenRegister();
              }}
              className="font-semibold text-emerald-700 hover:underline"
            >
              Créer un compte école
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
