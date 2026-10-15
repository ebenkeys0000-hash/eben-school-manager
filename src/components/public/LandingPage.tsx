import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  CreditCard,
  FileText,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Lock,
  ChevronDown,
  Building2,
  Smartphone
} from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../../services/dataService';
import { formatXOF } from '../../utils/formatters';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenDemo: (role?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
  onOpenDemo,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showLegalModal, setShowLegalModal] = useState<'terms' | 'privacy' | null>(null);

  const faqs = [
    {
      q: "Comment Eben School Manager gère-t-il les tranches de scolarité en FCFA ?",
      a: "La plateforme permet de configurer pour chaque classe l'échéancier exact des versements (Frais d'inscription, 1ère tranche à la rentrée, 2ème tranche en décembre, 3ème tranche en février) ainsi que les frais annexes (cantine, tenue, transport). Les soldes et impayés sont recalculés automatiquement dès l'émission d'un reçu."
    },
    {
      q: "Les données de mon école sont-elles isolées et protégées des autres établissements ?",
      a: "Absolument. Eben School Manager intègre une architecture multi-tenant stricte : chaque établissement possède un identifiant unique (School ID). Aucun directeur, comptable ou enseignant d'une école ne peut visualiser ou manipuler les élèves, reçus ou notes d'un autre établissement."
    },
    {
      q: "Les bulletins de notes sont-ils conformes aux programmes éducatifs du Bénin et d'Afrique de l'Ouest ?",
      a: "Oui, nos bulletins respectent scrupuleusement le système officiel : notes sur 20, coefficients par matière, calcul automatique des moyennes pondérées, calcul du rang de classe, moyennes de classe (la plus forte, la plus faible, moyenne générale) et appréciations du conseil des professeurs."
    },
    {
      q: "Les parents peuvent-ils suivre les notes et les paiements à distance ?",
      a: "Tout à fait. Grâce au Portail Parents sécurisé, chaque parent accède aux données de ses propres enfants : consultation des bulletins de notes, vérification du solde de scolarité, téléchargement des reçus officiels et suivi des présences/retards."
    },
    {
      q: "Quels sont les modes de règlement de scolarité pris en charge ?",
      a: "Le module de caisse prend en charge les encaissements en espèces au guichet, les virements bancaires, les chèques, ainsi que les références des transactions Mobile Money (MTN MoMo, Moov Money et Celtiis Cash) très courantes au Bénin."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar Navigation (Strict 3-zone contract) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark (single element) */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap">
              Eben School Manager
            </span>
          </div>

          {/* Zone 2: Navigation Links (single line, no wrapping) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors whitespace-nowrap">Fonctionnalités</a>
            <a href="#pedagogy" className="hover:text-slate-900 transition-colors whitespace-nowrap">Pédagogie & Notes</a>
            <a href="#finance" className="hover:text-slate-900 transition-colors whitespace-nowrap">Recouvrement</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors whitespace-nowrap">Tarifs</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors whitespace-nowrap">FAQ</a>
            <a href="#contact" className="hover:text-slate-900 transition-colors whitespace-nowrap">Contact</a>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
            >
              Connexion
            </button>
            <button
              onClick={onOpenRegister}
              className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              Inscrire mon École
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-24 overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SaaS Éducatif Dédié au Bénin & à l'Afrique de l'Ouest</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-tight">
                La gestion scolaire moderne, rigoureuse et sans compromis.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Eben School Manager digitalise l’administration, la scolarité en FCFA, les bulletins officiels et la relation parentale des écoles privées, collèges et lycées. Données strictement isolées et sécurisées par établissement.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={onOpenRegister}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all whitespace-nowrap"
                >
                  <span>Créer l'Espace de mon École</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenDemo('DIRECTOR')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all whitespace-nowrap"
                >
                  <span>Tester la Démo Immédiate</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-2xl font-bold text-slate-900 font-mono-numbers">100%</div>
                  <div className="text-xs text-slate-500">Conforme Bénin / UEMOA</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 font-mono-numbers">XOF</div>
                  <div className="text-xs text-slate-500">Devise FCFA & MoMo</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 font-mono-numbers">Multi-Tenant</div>
                  <div className="text-xs text-slate-500">Isolation étanche garantie</div>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 aspect-[16/10] bg-slate-100">
                <img
                  src="/src/assets/images/eben_school_hero_1792053604455.jpg"
                  alt="Élèves d'un complexe scolaire en Afrique de l'Ouest"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                    Excellence Académique & Administrative
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Collèges, Lycées & Complexes Scolaires Privés
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Cotonou, Porto-Novo, Parakou, Abomey-Calavi et toute la sous-région
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">
              Une Solution Complète Clé en Main
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Tout ce dont votre établissement a besoin au quotidien
            </h3>
            <p className="text-base text-slate-600 mt-3">
              Développé avec les directeurs d'études, comptables et surveillants pour répondre précisément aux réalités de nos écoles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Gestion des Inscriptions & Élèves</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Génération automatique du matricule unique, suivi des dossiers complets, photos d'identité, coordonnées des parents et fiches d'inscription imprimables.
              </p>
              <span className="text-xs font-semibold text-emerald-700">Matricule & Fiche officielle d'inscription</span>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Recouvrement & Caisse en FCFA</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Échéanciers par tranches, encaissements espèces, chèques ou Mobile Money (MTN / Moov / Celtiis), émission instantanée de reçus légaux avec montant en lettres.
              </p>
              <span className="text-xs font-semibold text-blue-700">Reçus imprimables & Reste à payer calculé</span>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Bulletins Scolaires Trimestriels</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Saisie intuitive des interrogations, devoirs surveillés et compositions. Calcul automatique des moyennes pondérées selon les coefficients et attribution du rang.
              </p>
              <span className="text-xs font-semibold text-purple-700">Norme officielle MESTFP Bénin</span>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Portail Parents Sécurisé</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Les parents visualisent les notes, les retards, téléchargent les reçus de scolarité et reçoivent les communications importantes de la direction sur leur mobile.
              </p>
              <span className="text-xs font-semibold text-amber-700">Transparence & Réduction des contestations</span>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Emplois du Temps & Détection Conflits</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Planification hebdomadaire des salles et enseignants avec détection intelligente des chevauchements d'horaires et gestion de l'appel journalier.
              </p>
              <span className="text-xs font-semibold text-rose-700">Fin des doublons de cours ou de salles</span>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Architecture Multi-Tenant Étanche</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Contrôle d'accès rigoureux selon 8 rôles pré-définis (Directeur, Admin, Comptable, Enseignant, Parent...). Données hermétiquement cloisonnées.
              </p>
              <span className="text-xs font-semibold text-slate-800">Sécurité & Confidentialité bancaire</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">
              Tarification Transparente en Francs CFA
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Des forfaits adaptés à la taille de votre école
            </h3>
            <p className="text-base text-slate-600 mt-2">
              Pas de frais cachés. Démarrez dès aujourd'hui avec un essai gratuit sans engagement.
            </p>

            {/* Period Selector */}
            <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg mt-6 border border-slate-200">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${
                  billingPeriod === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Facturation Mensuelle
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center gap-1 ${
                  billingPeriod === 'yearly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Facturation Annuelle</span>
                <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-100 px-1.5 py-0.2 rounded">
                  -17%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const price = billingPeriod === 'monthly' ? plan.priceMonthlyXOF : plan.priceYearlyXOF;
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col justify-between p-8 rounded-2xl border transition-all ${
                    plan.popular
                      ? 'border-emerald-600 bg-white shadow-xl ring-2 ring-emerald-600/20'
                      : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-emerald-600 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                      Recommandé pour la rentrée
                    </div>
                  )}

                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{plan.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 mb-6">{plan.tagline}</p>

                    <div className="mb-6">
                      <span className="text-3xl font-extrabold text-slate-950 font-mono-numbers">
                        {formatXOF(price)}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">
                        /{billingPeriod === 'monthly' ? 'mois' : 'an'}
                      </span>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-200">
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 mt-6">
                    <button
                      onClick={onOpenRegister}
                      className={`w-full py-3 px-4 text-sm font-semibold rounded-xl transition-all shadow-sm ${
                        plan.popular
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      Démarrer un Essai Gratuit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Questions Fréquentes</h2>
            <h3 className="text-3xl font-extrabold text-slate-900">
              Tout ce que vous devez savoir avant d'adopter Eben School Manager
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-emerald-700 transition-colors"
                >
                  <span className="text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {activeFaq === i && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Assistance & Déploiement</span>
              <h3 className="text-3xl font-bold mt-2 mb-4 text-white">
                Besoin d'une démonstration sur mesure dans vos locaux ?
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Nos conseillers pédagogiques interviennent à Cotonou, Porto-Novo, Calavi et partout au Bénin pour former vos équipes de direction et vos comptables.
              </p>

              <div className="space-y-3 text-sm text-slate-200">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Siège social : Quartier Haie Vive, Cotonou, République du Bénin</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>+229 21 30 12 45 / +229 97 00 11 22 (Lundi au Vendredi, 08h - 18h)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>contact@ebenschool.bj</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 p-6 sm:p-8 rounded-2xl border border-slate-700">
              <h4 className="text-lg font-bold text-white mb-4">Écrire à notre équipe technique</h4>
              <form onSubmit={(e) => { e.preventDefault(); alert("Merci ! Votre demande a été transmise à notre service commercial qui vous répondra dans l'heure."); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nom de votre établissement</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Complexe Scolaire Le Flamboyant"
                    className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Votre Nom / Fonction</label>
                    <input
                      type="text"
                      required
                      placeholder="Directeur / Censeur"
                      className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Téléphone (WhatsApp)</label>
                    <input
                      type="tel"
                      required
                      placeholder="+229 97 XX XX XX"
                      className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                >
                  Demander un rappel commercial
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-base font-bold text-white">Eben School Manager</span>
            </div>

            <div className="flex items-center gap-6 text-xs">
              <button
                onClick={() => setShowLegalModal('terms')}
                className="hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                Conditions Générales d'Utilisation
              </button>
              <button
                onClick={() => setShowLegalModal('privacy')}
                className="hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                Politique de Confidentialité & RGPD/Bénin
              </button>
              <a href="#contact" className="hover:text-white transition-colors">
                Support Technique
              </a>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Eben School Manager. Tous droits réservés. Cotonou, Bénin.</p>
            <p>Plateforme SaaS Multi-Tenant pour l'Enseignement Privé Ouest-Africain.</p>
          </div>
        </div>
      </footer>

      {/* Legal Modal */}
      {showLegalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto border border-slate-200 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {showLegalModal === 'terms'
                ? "Conditions Générales d'Utilisation (CGU)"
                : "Politique de Confidentialité & Protection des Données Scolaires"}
            </h3>
            <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                <strong>1. Objet :</strong> La plateforme <em>Eben School Manager</em> fournit un service applicatif en mode SaaS dédié aux établissements d'enseignement primaire, secondaire et supérieur en République du Bénin et dans l'espace UEMOA/CEDEAO.
              </p>
              <p>
                <strong>2. Isolation Stricte des Données :</strong> Conformément aux exigences multi-tenants, chaque établissement scolaire bénéficie d'une base de données logique strictement étanche. Aucune passerelle non autorisée n'est admise entre les registres financiers, académiques et administratifs de deux écoles distinctes.
              </p>
              <p>
                <strong>3. Données des Mineurs et Élèves :</strong> Les informations des apprenants (identités, photos, bulletins scolaires, coordonnées parentales) ne sont ni commercialisées ni communiquées à des tiers publicitaires. L'établissement reste l'unique propriétaire légal de ses registres scolaires.
              </p>
              <p>
                <strong>4. Transactions et Reçus Financiers :</strong> Les reçus émis via Eben School Manager portent un numéro de série unique vérifiable. Les règlements par Mobile Money ou banque font l'objet d'un journal de caisse inviolable.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowLegalModal(null)}
                className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
