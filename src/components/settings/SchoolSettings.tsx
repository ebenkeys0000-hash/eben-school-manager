import React, { useState } from 'react';
import {
  Building2,
  Save,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Calendar,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Globe,
  Award,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { dataService, SUBSCRIPTION_PLANS } from '../../services/dataService';
import { formatDateFR, formatCurrency } from '../../utils/formatters';
import { COUNTRIES_LIST, COUNTRIES_CONFIG, getCountryConfig } from '../../data/countries';
import { School } from '../../types';

export const SchoolSettings: React.FC = () => {
  const { currentSchool, refreshData } = useAuth();
  const { t, language } = useLanguage();
  const schoolId = currentSchool?.id || '';

  const [form, setForm] = useState({
    name: currentSchool?.name || '',
    type: currentSchool?.type || 'COMPLEXE_SCOLAIRE',
    address: currentSchool?.address || '',
    city: currentSchool?.city || '',
    country: currentSchool?.country || 'Benin',
    phone: currentSchool?.phone || '',
    email: currentSchool?.email || '',
    registrationNumber: currentSchool?.registrationNumber || '',
    directorName: currentSchool?.directorName || '',
    currentAcademicYear: currentSchool?.currentAcademicYear || '2025-2026',
    educationSystem: currentSchool?.educationSystem || 'Système National Béninois (MESTFP / MEMP)',
    currency: currentSchool?.currency || 'XOF',
    currencySymbol: currentSchool?.currencySymbol || 'FCFA',
    gradingScale: currentSchool?.gradingScale || '/20',
    academicPeriodType: currentSchool?.academicPeriodType || 'TRIMESTRE',
    defaultLanguage: (currentSchool?.defaultLanguage || 'fr') as 'fr' | 'en',
    logo: currentSchool?.logo || ''
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [appliedCountryDefaults, setAppliedCountryDefaults] = useState(false);

  if (!currentSchool) return null;

  const currentPlan = SUBSCRIPTION_PLANS.find((p) => p.id === currentSchool.subscriptionPlanId);

  const handleCountryChange = (countryName: string) => {
    const cfg = getCountryConfig(countryName);
    setForm((prev) => ({
      ...prev,
      country: countryName,
      // If user hasn't explicitly set custom details, auto-suggest country standard
      educationSystem: language === 'en' ? cfg.educationSystemNameEn : cfg.educationSystemName,
      currency: cfg.currency,
      currencySymbol: cfg.currencySymbol,
      gradingScale: cfg.gradingScale,
      academicPeriodType: cfg.academicPeriods,
      defaultLanguage: cfg.defaultLanguage
    }));
    setAppliedCountryDefaults(true);
    setTimeout(() => setAppliedCountryDefaults(false), 4000);
  };

  const handleApplyCountryStandards = () => {
    const cfg = getCountryConfig(form.country);
    setForm((prev) => ({
      ...prev,
      educationSystem: language === 'en' ? cfg.educationSystemNameEn : cfg.educationSystemName,
      currency: cfg.currency,
      currencySymbol: cfg.currencySymbol,
      gradingScale: cfg.gradingScale,
      academicPeriodType: cfg.academicPeriods,
      defaultLanguage: cfg.defaultLanguage
    }));
    setAppliedCountryDefaults(true);
    setTimeout(() => setAppliedCountryDefaults(false), 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.updateSchoolProfile(schoolId, form);
    refreshData();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('settings.title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'en'
              ? 'Institutional identity, ministerial accreditation, multi-country education curriculum, and currency.'
              : "Identité institutionnelle, agrément ministériel, système éducatif multi-pays et devise de fonctionnement."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            ID: {currentSchool.code}
          </div>
          <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
            {form.currencySymbol || form.currency} ({form.currency})
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            {language === 'en'
              ? 'School settings and educational framework updated successfully!'
              : "Paramètres de l'établissement et cadre pédagogique mis à jour avec succès !"}
          </span>
        </div>
      )}

      {appliedCountryDefaults && (
        <div className="p-4 bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 rounded-xl text-xs text-sky-900 dark:text-sky-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
          <span>
            {language === 'en'
              ? `National education standards applied for ${form.country}. You can customize any field below.`
              : `Standards nationaux appliqués pour ${form.country}. Vous pouvez personnaliser chaque champ ci-dessous.`}
          </span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-6 text-xs transition-colors">
        
        {/* 1. Official Identity */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>1. {language === 'en' ? 'Official Identity & Ministerial Accreditation' : 'Identité Officielle & Mentions Ministérielles'}</span>
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'en' ? 'Official School Name' : "Nom Officiel de l'Établissement"} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'en' ? 'School Type' : "Type d'Établissement"}
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as School['type'] })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="COMPLEXE_SCOLAIRE">Complexe Scolaire (Maternelle - Lycée)</option>
                  <option value="COLLEGE_LYCEE">Collège & Lycée Secondaire</option>
                  <option value="MATERNELLE_PRIMAIRE">Maternelle & Primaire</option>
                  <option value="TECHNIQUE">Enseignement Technique & Professionnel</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'en' ? 'Ministerial Accreditation / Registration Number' : "N° d'Agrément Ministériel / Arrêté d'Ouverture"}
                </label>
                <input
                  type="text"
                  placeholder="Ex: Arrêté N° 045/MESTFP/DC/SGM/2018"
                  value={form.registrationNumber}
                  onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'en' ? 'Director / Principal Full Name' : 'Nom du Directeur / Promoteur'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.directorName}
                  onChange={(e) => setForm({ ...form, directorName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Country & Multi-Country Education Framework */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>2. {language === 'en' ? 'Country & National Education Curriculum' : 'Pays & Système Éducatif National'}</span>
            </h2>

            <button
              type="button"
              onClick={handleApplyCountryStandards}
              className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 hover:bg-emerald-200 dark:hover:bg-emerald-900 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'en' ? 'Auto-fill Country Standards' : 'Appliquer standards du pays'}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('settings.country')} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={form.country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                >
                  {COUNTRIES_LIST.map((cName) => {
                    const cfg = COUNTRIES_CONFIG[cName];
                    return (
                      <option key={cName} value={cName}>
                        {language === 'en' ? cfg.nameEn : cfg.nameFr} ({cfg.currencySymbol || cfg.currency})
                      </option>
                    );
                  })}
                </select>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  {language === 'en'
                    ? 'Supports 15+ countries: Benin, Togo, Côte d’Ivoire, Senegal, Ghana, Nigeria, etc.'
                    : "Supporte 15+ pays : Bénin, Togo, Côte d'Ivoire, Sénégal, Ghana, Nigéria, etc."}
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('settings.education_system')}
                </label>
                <input
                  type="text"
                  value={form.educationSystem}
                  onChange={(e) => setForm({ ...form, educationSystem: e.target.value })}
                  placeholder="Ex: Système National Béninois (MESTFP / MEMP)"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Academic Periods, Grading Scale & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'en' ? 'Academic Periods' : 'Découpage de l’Année'}
                </label>
                <select
                  value={form.academicPeriodType}
                  onChange={(e) => setForm({ ...form, academicPeriodType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="TRIMESTRE">Trimestres (1er, 2ème, 3ème Trimestre)</option>
                  <option value="SEMESTRE">Semestres (1er, 2ème Semestre - ex: RDC, Sénégal)</option>
                  <option value="TERM">Terms (Term 1, Term 2, Term 3 - ex: Ghana, Nigeria, Kenya)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('settings.grading_scale')}
                </label>
                <select
                  value={form.gradingScale}
                  onChange={(e) => setForm({ ...form, gradingScale: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="/20">Barème sur 20 (Système Francophone Standard)</option>
                  <option value="/100%">Pourcentage / 100% (ex: RDC, Kenya, Afrique du Sud)</option>
                  <option value="A-F">Lettres A à F (Système Anglophone / WASSCE WAEC)</option>
                  <option value="1-9">Échelle Stanine 1 à 9 (Ghana GES)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('settings.default_language')}
                </label>
                <select
                  value={form.defaultLanguage}
                  onChange={(e) => setForm({ ...form, defaultLanguage: e.target.value as 'fr' | 'en' })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="fr">Français (French)</option>
                  <option value="en">English (Anglais)</option>
                </select>
              </div>
            </div>

            {/* Currency settings (Configurable for all African countries) */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{language === 'en' ? 'Operating Currency & Symbol' : 'Devise de Fonctionnement & Symbole Monétaire'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'en' ? 'Currency Code (ISO)' : 'Code de la Devise (ISO 4217)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })}
                    placeholder="XOF, GHS, NGN, KES, ZAR, GNF, CDF, XAF..."
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                  />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                    {language === 'en'
                      ? 'XOF (Benin/Togo/Ivory Coast), GHS (Ghana), NGN (Nigeria), KES (Kenya), ZAR (South Africa)...'
                      : 'XOF (Bénin/Togo/CI), GHS (Ghana), NGN (Nigéria), KES (Kenya), ZAR (Afrique du Sud)...'}
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'en' ? 'Currency Display Symbol' : 'Symbole d’Affichage sur les Reçus & Factures'}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.currencySymbol}
                    onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })}
                    placeholder="FCFA, GH₵, ₦, KSh, R, FG, FC..."
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                    {language === 'en'
                      ? 'Example of 50,000 in this school: ' + formatCurrency(50000, form.currency, form.currencySymbol)
                      : 'Exemple pour 50 000 dans cette école : ' + formatCurrency(50000, form.currency, form.currencySymbol)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Location and Contact */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>3. {language === 'en' ? 'Location & Official Contact' : 'Localisation & Coordonnées Officielles'}</span>
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'en' ? 'City / Town' : 'Ville'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'en' ? 'Full Address / Campus District' : 'Adresse complète / Quartier du Campus'}
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'en' ? 'Official Telephone' : 'Téléphone Officiel de l’Établissement'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'en' ? 'Official Email' : 'Email Officiel'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Active Academic Year */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>4. {language === 'en' ? 'Active Academic Session' : 'Session & Année Scolaire Active'}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'en' ? 'Active Academic Year' : 'Année Scolaire en Cours'}
              </label>
              <input
                type="text"
                value={form.currentAcademicYear}
                onChange={(e) => setForm({ ...form, currentAcademicYear: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'en' ? 'School Logo URL' : "URL du Logo de l'Établissement"}
              </label>
              <input
                type="text"
                placeholder="https://..."
                value={form.logo}
                onChange={(e) => setForm({ ...form, logo: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Historical Integrity Guarantee Notice */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold">
              {language === 'en'
                ? 'Historical Records Integrity Guarantee'
                : 'Garantie de non-altération des données historiques'}
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
              {language === 'en'
                ? 'Modifications to education systems, grading scales, subject coefficients, and currencies strictly apply to ongoing and future terms. All past report cards, archival grades, and financial ledger receipts are immutable and cryptographically preserved.'
                : "La modification des barèmes pédagogiques, devises ou coefficients s'applique strictement aux périodes et devoirs à venir. L'intégralité des bulletins archivés et reçus financiers antérieurs demeure immuable et juridiquement protégée."}
            </p>
          </div>
        </div>

        {/* Subscription Info Card */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 dark:text-white">
              {language === 'en' ? 'SaaS Subscription Plan' : "Abonnement SaaS de l'Établissement"}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {currentSchool.subscriptionStatus}
            </span>
          </div>
          <div className="text-slate-600 dark:text-slate-400 text-xs">
            {language === 'en' ? 'Active tier: ' : 'Formule active : '}
            <strong className="text-slate-900 dark:text-white">{currentPlan?.name || 'Standard Pro'}</strong> ·{' '}
            {language === 'en' ? 'Scheduled renewal on ' : 'Renouvellement prévu le '}
            <strong className="text-slate-900 dark:text-white">{formatDateFR(currentSchool.subscriptionRenewsAt, true)}</strong>.
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-emerald-400 dark:text-white" />
            <span>{t('settings.save')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
