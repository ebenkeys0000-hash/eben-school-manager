import React, { useState } from 'react';
import {
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Shield,
  User,
  Building2,
  ChevronDown,
  ExternalLink,
  LifeBuoy,
  Sparkles,
  Inbox
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { dataService } from '../../services/dataService';
import { SupportCategory, SupportTicket } from '../../types';
import { getSupportCategoryLabel, getSupportStatusLabel, formatDateFR } from '../../utils/formatters';

interface SupportCenterProps {
  onBackToApp?: () => void;
  isStandalone?: boolean;
}

export const SupportCenter: React.FC<SupportCenterProps> = ({ onBackToApp, isStandalone = false }) => {
  const { currentUser, currentSchool, isSuperAdmin } = useAuth();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'contact_form' | 'my_tickets' | 'faq'>('contact_form');

  // Form State
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [schoolName, setSchoolName] = useState(currentSchool?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [whatsappNumber, setWhatsappNumber] = useState(currentUser?.phone || '');
  const [category, setCategory] = useState<SupportCategory>('PROBLEME_TECHNIQUE');
  const [description, setDescription] = useState('');

  const [formError, setFormError] = useState<string | null>(null);
  const [submittedTicket, setSubmittedTicket] = useState<SupportTicket | null>(null);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Retrieve user tickets
  const myTickets = dataService.getSupportTickets({
    userId: currentUser?.id,
    userEmail: currentUser?.email,
    schoolId: currentSchool?.id,
    isSuperAdmin: false // in user portal, only show their own tickets
  });

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim()) {
      setFormError(language === 'en' ? 'Please enter your full name.' : 'Veuillez saisir votre nom complet.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError(language === 'en' ? 'Please enter a valid email address.' : 'Veuillez renseigner une adresse email valide.');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setFormError(language === 'en' ? 'Please describe your request in at least 10 characters.' : 'Veuillez détailler votre problème (au moins 10 caractères).');
      return;
    }

    try {
      const ticket = dataService.createSupportTicket({
        fullName: fullName.trim(),
        schoolName: schoolName.trim() || undefined,
        email: email.trim(),
        whatsappNumber: whatsappNumber.trim() || undefined,
        category,
        description: description.trim(),
        userId: currentUser?.id || null,
        schoolId: currentSchool?.id || null
      });

      setSubmittedTicket(ticket);
      setDescription('');
    } catch (err: any) {
      setFormError(err?.message || "Erreur lors de l'enregistrement de votre demande d'assistance.");
    }
  };

  const faqs = [
    {
      q: language === 'en' ? 'How to report an issue or bug quickly?' : 'Comment signaler un problème ou un bug efficacement ?',
      a: language === 'en'
        ? 'Use the form on this page or message us directly on WhatsApp (+229 95 44 16 02). Please specify the affected student, class, or transaction reference and describe what you expected versus what occurred.'
        : 'Utilisez le formulaire ci-dessous ou contactez-nous directement sur WhatsApp (+229 95 44 16 02). Précisez l’élève, la classe ou le numéro de reçu concerné, et décrivez les étapes ayant mené au problème.'
    },
    {
      q: language === 'en' ? 'Can I receive support on WhatsApp in the evening or weekend?' : 'Puis-je obtenir de l’aide sur WhatsApp le soir ou le week-end ?',
      a: language === 'en'
        ? 'Yes! Our technical team led by Eben Keys in Comé, Benin is reachable 6 days a week on WhatsApp (+229 95 44 16 02) to assist headmasters, teachers, and accountants during critical periods such as exams and tuition deadlines.'
        : 'Oui ! Notre équipe technique dirigée par Eben Keys à Comé est joignable 6j/7 sur WhatsApp (+229 95 44 16 02) pour assister les directeurs et comptables, en particulier lors des clôtures de trimestre et des échéances de scolarité.'
    },
    {
      q: language === 'en' ? 'How do receipt numbers and student balances work?' : 'Comment fonctionne la numérotation des reçus et le solde des élèves ?',
      a: language === 'en'
        ? 'Every receipt has an immutable sequential number (e.g. REC-CSLR-2025-0042). When a payment is recorded, the student remaining balance is automatically recalculated against the class fee structure.'
        : 'Chaque reçu possède une référence unique chronologique infalsifiable (ex: REC-CSLR-2025-0042). Dès qu’un versement est validé, le solde restant de l’élève est immédiatement mis à jour selon la grille tarifaire de sa classe.'
    },
    {
      q: language === 'en' ? 'Is our school data isolated and safe from other schools?' : 'Nos données sont-elles strictement isolées de celles des autres établissements ?',
      a: language === 'en'
        ? 'Yes. Eben School Manager enforces complete multi-tenant database isolation. An administrator or accountant of one school can never access or view another institution’s students, financial ledgers, grades, or settings.'
        : 'Absolument. Eben School Manager applique une isolation multi-tenant étanche. Un utilisateur d’une école ne peut en aucun cas accéder aux élèves, finances, bulletins ou relevés d’un autre établissement.'
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner / Platform Contact Header */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-3">
              <LifeBuoy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Assistance & Support Technique Officiel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Eben School Manager · Centre d'Assistance
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Une équipe d'ingénieurs et de conseillers pédagogiques dédiée à votre écoute pour accompagner la réussite administrative de votre établissement scolaire.
            </p>

            {/* Official Contact Metadata Strip */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Responsable :</strong> Eben Keys</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Localisation :</strong> Comé, Bénin</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Disponibilité :</strong> Lun - Sam (07h30 - 19h00)</span>
              </div>
            </div>
          </div>

          {/* Quick Direct Actions: WhatsApp & Email Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-72 shrink-0">
            {/* WhatsApp Contact Button */}
            <a
              href="https://wa.me/22995441602"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-white shrink-0" />
              <span>Contacter l'assistance sur WhatsApp</span>
            </a>

            {/* Email Contact Button */}
            <a
              href="mailto:ebenkeys0000@gmail.com"
              className="inline-flex items-center justify-center gap-2.5 px-4 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all"
            >
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Nous contacter par e-mail</span>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('contact_form')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'contact_form'
              ? 'bg-slate-900 dark:bg-emerald-600 text-white font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {language === 'en' ? 'Submit Support Request' : 'Ouvrir un Ticket d’Assistance'}
        </button>

        <button
          onClick={() => setActiveTab('my_tickets')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'my_tickets'
              ? 'bg-slate-900 dark:bg-emerald-600 text-white font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'My Requests' : 'Mes Demandes'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono">
            {myTickets.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'faq'
              ? 'bg-slate-900 dark:bg-emerald-600 text-white font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {language === 'en' ? 'FAQs & Troubleshooting' : 'Foire aux Questions & Guides'}
        </button>
      </div>

      {/* TAB 1: SUPPORT REQUEST FORM */}
      {activeTab === 'contact_form' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Formulaire de Demande d'Assistance Technique
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Remplissez les informations ci-dessous. Votre requête sera immédiatement transmise à notre service support avec génération d’un numéro de suivi.
            </p>

            {submittedTicket && (
              <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Votre demande a été enregistrée avec succès !</span>
                </div>
                <p className="text-emerald-800 dark:text-emerald-300">
                  Numéro de ticket de suivi : <strong className="font-mono">{submittedTicket.ticketNumber}</strong>.
                  Notre responsable <strong>Eben Keys</strong> a reçu votre notification et vous répondra sur <strong>{submittedTicket.email}</strong> ou WhatsApp sous peu.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={`https://wa.me/22995441602?text=${encodeURIComponent(`Bonjour Eben Keys, je viens de soumettre le ticket ${submittedTicket.ticketNumber} (${submittedTicket.fullName}). Merci de m'assister.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-[11px] hover:bg-emerald-700"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>Suivre en direct sur WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmittedTicket(null)}
                    className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:underline text-[11px]"
                  >
                    Envoyer une autre demande
                  </button>
                </div>
              </div>
            )}

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nom et Prénoms <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: M. Marcellin Agbossou"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nom de l'École / Établissement (facultatif)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Complexe Scolaire La Renaissance"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Adresse E-mail de contact <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nom@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Numéro WhatsApp (recommandé pour réponse rapide)
                  </label>
                  <input
                    type="tel"
                    placeholder="+229 95 XX XX XX"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Catégorie de la demande <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SupportCategory)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  <option value="CONNEXION_COMPTE">Connexion et compte</option>
                  <option value="INSCRIPTION_ECOLE">Inscription de mon école</option>
                  <option value="GESTION_ELEVES">Gestion des élèves</option>
                  <option value="SCOLARITE_PAIEMENTS">Scolarité et paiements</option>
                  <option value="NOTES_BULLETINS">Notes et bulletins</option>
                  <option value="ABONNEMENT">Abonnement</option>
                  <option value="PROBLEME_TECHNIQUE">Problème technique</option>
                  <option value="AUTRE">Autre demande</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description détaillée du problème <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Décrivez votre besoin ou le comportement constaté avec précision (message d'erreur, classe, élève concerné, etc.)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Date de soumission : <strong>{formatDateFR(new Date().toISOString(), true)}</strong>
                </span>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer la Demande</span>
                </button>
              </div>
            </form>
          </div>

          {/* Side Info & Direct Support Cards */}
          <div className="space-y-4">
            {/* Direct WhatsApp Callout */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 text-xs text-emerald-950 dark:text-emerald-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm">
                <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400" />
                <span>Assistance WhatsApp Directe</span>
              </div>
              <p className="leading-relaxed text-[11px] text-emerald-800 dark:text-emerald-300">
                Vous avez besoin d’une réponse urgente sur une opération de rentrée ou un encaissement ? Écrivez-nous directement sur WhatsApp au :
              </p>
              <div className="font-mono font-extrabold text-base text-emerald-900 dark:text-emerald-200 bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
                +229 95 44 16 02
              </div>
              <a
                href="https://wa.me/22995441602"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-center block text-xs"
              >
                Ouvrir WhatsApp
              </a>
            </div>

            {/* Email Contact Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Courriel d'Assistance</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pour l’envoi de pièces jointes officielles, grilles d'agrégation ou conventions :
              </p>
              <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                ebenkeys0000@gmail.com
              </div>
              <a
                href="mailto:ebenkeys0000@gmail.com"
                className="text-emerald-700 dark:text-emerald-400 hover:underline font-bold block pt-1 text-[11px]"
              >
                Écrire par e-mail →
              </a>
            </div>

            {/* Platform Information Card */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <div className="font-bold text-slate-900 dark:text-white">Conseils pour un traitement rapide :</div>
              <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li>Indiquez le nom exact de votre école</li>
                <li>Mentionnez le matricule de l'élève si applicable</li>
                <li>Joignez le numéro du reçu en cas de question financière</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY TICKETS LIST */}
      {activeTab === 'my_tickets' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Historique de vos Demandes de Support
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Suivi transparent du traitement de vos requêtes par l’équipe d’Eben Keys.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
              {myTickets.length} ticket(s)
            </span>
          </div>

          {myTickets.length === 0 ? (
            <div className="p-12 text-center text-slate-400 dark:text-slate-500 text-xs">
              <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p>Vous n'avez pas encore soumis de demande d'assistance.</p>
              <button
                onClick={() => setActiveTab('contact_form')}
                className="mt-3 px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Ouvrir un ticket maintenant
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {myTickets.map((t) => {
                const statusMeta = getSupportStatusLabel(t.status, language as any);

                return (
                  <div key={t.id} className="p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors text-xs space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {t.ticketNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {getSupportCategoryLabel(t.category, language as any)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusMeta.color}`}>
                          {statusMeta.label}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {formatDateFR(t.createdAt, true)}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                      {t.description}
                    </p>

                    {/* Direct Contact Button */}
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Responsable assigné : <strong>Eben Keys</strong>
                      </span>

                      <a
                        href={`https://wa.me/22995441602?text=${encodeURIComponent(`Bonjour Eben Keys, je consulte mon ticket ${t.ticketNumber} (${t.fullName}). Pouvons-nous faire le point ?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Relancer sur WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FAQ SECTION */}
      {activeTab === 'faq' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Questions Fréquentes & Procédures de Dépannage
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Retrouvez les réponses immédiates aux interrogations récurrentes des équipes pédagogiques.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs text-slate-900 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center justify-between gap-4 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${openFaqIndex === idx ? 'rotate-180 text-emerald-600' : ''}`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
