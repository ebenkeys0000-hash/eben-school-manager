import React, { useState } from 'react';
import { X, Building2, CheckCircle2, Shield, ArrowRight, UserCheck, AlertCircle, Globe, BookOpen } from 'lucide-react';
import { dataService, SUBSCRIPTION_PLANS } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { School } from '../../types';
import { COUNTRIES_CONFIG, COUNTRIES_LIST, getCountryConfig } from '../../data/countries';

interface RegisterSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RegisterSchoolModal: React.FC<RegisterSchoolModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login } = useAuth();
  const { t, language } = useLanguage();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCountry, setSelectedCountry] = useState<string>('Benin');
  const countryConfig = getCountryConfig(selectedCountry);

  const [formData, setFormData] = useState({
    name: '',
    type: 'COMPLEXE_SCOLAIRE' as School['type'],
    registrationNumber: '',
    address: '',
    city: 'Cotonou',
    country: 'Benin',
    phone: countryConfig.phonePrefix + ' ',
    email: '',
    directorName: '',
    adminEmail: '',
    password: '',
    confirmPassword: '',
    subscriptionPlanId: 'plan_pro',
    educationSystem: countryConfig.educationSystemName,
    currency: countryConfig.currency,
    currencySymbol: countryConfig.currencySymbol,
    defaultLanguage: countryConfig.defaultLanguage,
    gradingScale: countryConfig.gradingScale,
    academicPeriodType: countryConfig.academicPeriods
  });

  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ school: School; code: string } | null>(null);

  if (!isOpen) return null;

  const handleCountryChange = (countryName: string) => {
    setSelectedCountry(countryName);
    const cfg = getCountryConfig(countryName);
    setFormData((prev) => ({
      ...prev,
      country: countryName,
      phone: cfg.phonePrefix + ' ',
      educationSystem: cfg.educationSystemName,
      currency: cfg.currency,
      currencySymbol: cfg.currencySymbol,
      defaultLanguage: cfg.defaultLanguage,
      gradingScale: cfg.gradingScale,
      academicPeriodType: cfg.academicPeriods
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError(language === 'en' ? 'Passwords do not match.' : 'Les mots de passe ne correspondent pas.');
      return;
    }
    if (formData.password.length < 6) {
      setError(language === 'en' ? 'Password must be at least 6 characters.' : 'Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    try {
      const result = dataService.registerSchool({
        name: formData.name,
        type: formData.type,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        phone: formData.phone,
        email: formData.email,
        registrationNumber: formData.registrationNumber,
        directorName: formData.directorName,
        adminEmail: formData.adminEmail,
        subscriptionPlanId: formData.subscriptionPlanId,
        educationSystem: formData.educationSystem,
        currency: formData.currency,
        currencySymbol: formData.currencySymbol,
        defaultLanguage: formData.defaultLanguage,
        gradingScale: formData.gradingScale,
        academicPeriodType: formData.academicPeriodType
      });

      // Auto login as this new director
      login(formData.adminEmail);
      setSuccessInfo({ school: result.school, code: result.school.code });
    } catch (err: any) {
      setError(err?.message || (language === 'en' ? 'Error registering school.' : "Erreur lors de l'enregistrement de l'école."));
    }
  };

  const handleFinish = () => {
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative my-8 text-slate-900 dark:text-slate-100 transition-colors">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {successInfo ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {language === 'en' ? 'School Registered Successfully!' : 'Établissement Enregistré avec Succès !'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              {language === 'en'
                ? `The workspace for ${successInfo.school.name} has been created and initialized for academic year 2025-2026.`
                : `L'espace dédié à ${successInfo.school.name} a été créé et initialisé avec votre année académique 2025-2026.`}
            </p>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl inline-block text-left text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <div><strong>{language === 'en' ? 'School ID / Tenant Code:' : 'Identifiant Unique d’École :'}</strong> <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{successInfo.code}</span></div>
              <div><strong>{language === 'en' ? 'Country & System:' : 'Pays & Système :'}</strong> {successInfo.school.country} ({successInfo.school.educationSystem})</div>
              <div><strong>{language === 'en' ? 'Currency & Scale:' : 'Devise & Barème :'}</strong> {successInfo.school.currencySymbol || successInfo.school.currency} ({successInfo.school.gradingScale})</div>
              <div><strong>{language === 'en' ? 'Administrator Email:' : 'Email d’administration :'}</strong> {formData.adminEmail}</div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleFinish}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition-colors"
              >
                {language === 'en' ? 'Open School Dashboard' : 'Accéder au Tableau de Bord de l’École'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'New School Registration' : 'Nouvel Établissement Scolaire'}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {language === 'en' ? 'Register Your Institution' : 'Enregistrer votre Établissement'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'en'
                  ? 'Create an isolated, country-configured SaaS workspace in 2 simple steps.'
                  : 'Créez le tenant autonome et configuré selon votre pays en 2 étapes simples.'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 ? (
                <>
                  {/* Country Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'en' ? 'Country & Education System' : 'Pays & Système Éducatif'} <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {COUNTRIES_LIST.map((cName) => {
                        const cfg = COUNTRIES_CONFIG[cName];
                        return (
                          <option key={cfg.code} value={cName}>
                            {language === 'en' ? cfg.nameEn : cfg.nameFr} ({cfg.currencySymbol} · {cfg.gradingScale})
                          </option>
                        );
                      })}
                    </select>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{countryConfig.educationSystemName}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'en' ? 'Official School Name' : 'Nom officiel de l’établissement'} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={language === 'en' ? 'e.g. Saint Peter High School' : 'Ex: Complexe Scolaire Le Flamboyant d’Or'}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'en' ? 'School Type' : 'Type d’établissement'}
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as School['type'] })}
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="COMPLEXE_SCOLAIRE">Complexe Scolaire Général</option>
                        <option value="COLLEGE_LYCEE">Collège & Lycée / Secondary</option>
                        <option value="MATERNELLE_PRIMAIRE">Maternelle & Primaire / Primary</option>
                        <option value="TECHNIQUE">Enseignement Technique & Pro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'en' ? 'Accreditation / Reg. Number' : 'N° Agrément Ministériel'}
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: N° 082/MESTFP/2021"
                        value={formData.registrationNumber}
                        onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'en' ? 'City' : 'Ville'} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={language === 'en' ? 'Accra / Lagos / Cotonou / Lomé...' : 'Cotonou / Porto-Novo / Lomé...'}
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'en' ? 'Currency & Grading' : 'Devise & Barème'}
                      </label>
                      <div className="px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 font-mono">
                        {countryConfig.currency} ({countryConfig.currencySymbol}) · {countryConfig.gradingScale}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'en' ? 'Street Address / District' : 'Adresse physique / Quartier'}
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Quartier Haie Vive, Rue 142"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'en' ? 'School Phone' : 'Téléphone de l’école'} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder={countryConfig.phonePrefix + ' ...'}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'en' ? 'Official School Email' : 'Email officiel de l’école'} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="contact@school.org"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (!formData.name || !formData.city || !formData.phone || !formData.email) {
                          setError(language === 'en' ? 'Please fill in all required fields.' : 'Veuillez remplir tous les champs obligatoires.');
                          return;
                        }
                        setError(null);
                        setStep(2);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      <span>{language === 'en' ? 'Continue to Admin Account' : 'Continuer vers le compte Admin'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-300 mb-4">
                    <strong>{formData.name}</strong> · {selectedCountry} ({countryConfig.currencySymbol})
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'en' ? 'Headmaster / Director Full Name' : 'Nom complet du Directeur / Fondateur'} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: M. Jean-Baptiste Dossou"
                      value={formData.directorName}
                      onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'en' ? 'Admin Login Email' : 'Email de connexion administrateur'} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="direction@school.org"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'en' ? 'Password' : 'Mot de passe'} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'en' ? 'Confirm Password' : 'Confirmer mot de passe'} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'en' ? 'SaaS Subscription Plan' : 'Formule SaaS choisie'}
                    </label>
                    <select
                      value={formData.subscriptionPlanId}
                      onChange={(e) => setFormData({ ...formData, subscriptionPlanId: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {SUBSCRIPTION_PLANS.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} (30 days free trial included)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-4 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900"
                    >
                      {language === 'en' ? 'Back' : 'Retour'}
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      <span>{language === 'en' ? 'Create School Workspace' : 'Créer l’Établissement'}</span>
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
