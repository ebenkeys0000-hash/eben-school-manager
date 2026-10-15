import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppLanguage = 'fr' | 'en';

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANG_STORAGE_KEY = 'eben_school_lang';

export const TRANSLATIONS: Record<AppLanguage, Record<string, string>> = {
  fr: {
    // Top Bar & Global
    'app.name': 'Eben School Manager',
    'app.tagline': 'Plateforme SaaS de Gestion Scolaire & Recouvrement',
    'nav.search_placeholder': 'Rechercher un élève, un enseignant, une classe, un reçu...',
    'nav.switch_role': 'Test Rôles & Isolation',
    'nav.school_view': 'Vue École :',
    'nav.public_site': 'Voir le site vitrine public',
    'nav.logout': 'Déconnexion',
    'nav.year': 'Année',
    'nav.tenant_isolation': 'Isolation Multi-Tenant Active',

    // Themes
    'theme.light': 'Mode clair',
    'theme.dark': 'Mode sombre',
    'theme.system': 'Mode système',

    // Languages
    'lang.fr': 'Français',
    'lang.en': 'English',

    // Navigation Menu
    'menu.dashboard': 'Tableau de Bord',
    'menu.students': 'Inscriptions & Élèves',
    'menu.classes': 'Classes & Matières',
    'menu.staff': 'Personnel & Enseignants',
    'menu.finance': 'Scolarité & Caisse',
    'menu.grades': 'Notes & Bulletins',
    'menu.attendance': 'Présences & Retards',
    'menu.timetable': 'Emplois du Temps',
    'menu.parent_portal': 'Espace Parents',
    'menu.announcements': 'Annonces & Circulaires',
    'menu.documents': 'Documents & Rapports',
    'menu.settings': "Paramètres de l'École",
    'menu.support': 'Aide et assistance',
    'menu.super_admin': 'Administration SaaS',

    // Dashboard
    'dash.title': 'Tableau de Bord Administratif & Financier',
    'dash.enrolled_students': 'Élèves Inscrits',
    'dash.expected_tuition': 'Scolarité Attendue',
    'dash.collected_tuition': 'Recouvrement Encaissé',
    'dash.outstanding_balance': 'Reste à Recouvrer',
    'dash.recovery_rate': 'Taux de recouvrement :',
    'dash.recent_payments': 'Derniers Encaissements de Scolarité',
    'dash.record_payment_btn': 'Encaisser une Scolarité',
    'dash.new_student_btn': 'Inscrire un Élève',
    'dash.view_journal': 'Voir tout le journal',
    'dash.attendance_card': 'Assiduité & Ponctualité',
    'dash.presents': 'Présents',
    'dash.lates': 'Retards',
    'dash.absents': 'Absents',
    'dash.take_attendance': "Faire l'appel de la séance",
    'dash.official_accreditation': 'Agrément Ministériel Validé',

    // Students
    'student.title': 'Gestion des Inscriptions & Élèves',
    'student.count': '{count} élèves',
    'student.new_btn': 'Nouvelle Inscription Élève',
    'student.search_placeholder': 'Rechercher par nom, prénom, matricule ou parent...',
    'student.all_classes': 'Toutes les classes',
    'student.all_statuses': 'Tous les statuts',
    'student.status_en_regle': 'En Règle (Scolarité soldée)',
    'student.status_en_retard': 'En Retard Tranche',
    'student.status_inscrit': 'Inscrit (En attente tranche)',
    'student.status_archive': 'Archivé',
    'student.matricule': 'Matricule',
    'student.name': 'Élève (Nom & Prénoms)',
    'student.class': 'Classe',
    'student.birth': 'Date Naissance',
    'student.parent': 'Parent / Tuteur',
    'student.payment_status': 'Statut Scolarité',
    'student.actions': 'Actions',
    'student.print_form': "Imprimer la Fiche d'Inscription",
    'student.edit': 'Modifier le dossier',
    'student.archive': 'Archiver',

    // Classes & Curriculum
    'class.title': 'Structure Pédagogique, Classes & Matières',
    'class.subtitle': 'Configuration des cycles, coefficients, professeurs principaux et salles.',
    'class.add_class_btn': 'Ajouter une Classe',
    'class.add_subject_btn': '+ Nouvelle Matière',
    'class.master_catalog_btn': 'Importer du Référentiel National',
    'class.main_teacher': 'Professeur Principal :',
    'class.print_roster': "Liste d'appel officielle",
    'class.subjects_table_title': 'Matières Enseignées & Coefficients Pédagogiques',
    'class.code': 'Code',
    'class.subject_name': 'Intitulé de la Matière',
    'class.subject_name_en': 'Nom Anglais',
    'class.level': 'Niveau',
    'class.coefficient': 'Coefficient Standard',
    'class.active': 'Active',

    // Staff
    'staff.title': 'Personnel Administratif & Corps Professoral',
    'staff.add_btn': 'Ajouter un Collaborateur',
    'staff.taught_subjects': 'Matières enseignées :',
    'staff.assigned_classes': 'Classes assignées :',

    // Finance
    'finance.title': 'Recouvrement des Scolarités & Caisse',
    'finance.total_collected': 'Total Encaissé en Caisse',
    'finance.total_receipts': 'Reçus Émis au Total',
    'finance.total_cancelled': 'Transactions Annulées',
    'finance.record_btn': 'Enregistrer un Encaissement',
    'finance.tab_ledger': 'Journal des Encaissements & Reçus',
    'finance.tab_statement': 'Relevé de Compte Élève & Échéancier',
    'finance.tab_fees': 'Grille Tarifaire des Frais par Classe',
    'finance.receipt_num': 'N° Reçu',
    'finance.fee_category': 'Catégorie de Frais',
    'finance.payment_method': 'Mode & Réf',
    'finance.amount': 'Montant ({currency})',
    'finance.recorded_by': 'Encaissé Par',
    'finance.print_receipt': 'Imprimer le Reçu Officiel',
    'finance.download_receipt_pdf': 'Télécharger le Reçu PDF',
    'finance.cancel_receipt': 'Annuler le paiement (Erreur)',

    // Grades & Report Cards
    'grade.title': 'Gestion des Évaluations, Notes & Bulletins',
    'grade.new_assessment': 'Nouvelle Évaluation / Devoir',
    'grade.class_selector': 'Classe :',
    'grade.term_selector': 'Période / Trimestre :',
    'grade.save_grades': 'Enregistrer les Notes',
    'grade.print_bulletin': 'Imprimer le Bulletin',
    'grade.download_bulletin_pdf': 'Télécharger le Bulletin PDF',
    'grade.view_bulletin': 'Voir Bulletin',
    'grade.bulletin_title': 'BULLETIN DE NOTES OFFICIEL',
    'grade.general_average': 'Moyenne Générale :',
    'grade.rank': 'Rang dans la classe :',
    'grade.council_appreciation': 'Décision du Conseil des Professeurs :',

    // Attendance & Timetable
    'att.title': 'Registre des Présences & Assiduité',
    'att.mark_all_present': 'Tout marquer Présent',
    'att.save_sheet': "Valider la Feuille d'Appel",
    'tt.title': 'Emplois du Temps & Planification des Salles',
    'tt.add_lesson': 'Ajouter un Cours',
    'tt.conflict_warning': "Conflit d'horaire détecté :",

    // Parent Portal
    'parent.portal_title': 'Espace Parent Sécurisé',
    'parent.child': 'Apprenant :',
    'parent.tuition_balance': 'Solde de Scolarité',
    'parent.grades_tab': 'Notes & Bulletins Scolaires',
    'parent.finance_tab': 'Scolarité & Reçus Officiels',
    'parent.attendance_tab': 'Assiduité & Retards',

    // Documents & Reports
    'doc.title': 'Documents Pédagogiques & Rapports Officiels',
    'doc.unpaid_title': 'État des Impayés de Scolarité',
    'doc.journal_title': 'Grand Livre & Journal de Caisse',
    'doc.print': 'Imprimer',
    'doc.download_pdf': 'Télécharger PDF',

    // Settings
    'settings.title': "Paramètres & Identité de l'Établissement",
    'settings.country': 'Pays de rattachement',
    'settings.education_system': 'Système Éducatif',
    'settings.currency': 'Devise & Symbole',
    'settings.grading_scale': 'Échelle de notation',
    'settings.default_language': 'Langue par défaut de l’école',
    'settings.save': 'Enregistrer les Paramètres',

    // Super Admin
    'admin.title': 'Supervision Globale de la Plateforme SaaS',
    'admin.schools_tab': 'Établissements Abonnés',
    'admin.isolation_test_tab': "Test d'Isolation Étanche (Multi-Tenant)",
    'admin.plans_tab': "Forfaits d'Abonnement",
    'admin.audit_tab': "Journal d'Audit Global",

    // Public Landing
    'landing.hero_badge': 'SaaS Éducatif Panafricain & Multi-Pays',
    'landing.hero_title': 'La gestion scolaire moderne, rigoureuse et sans compromis.',
    'landing.hero_desc': "Eben School Manager digitalise l’administration, les scolarités multi-devises, les bulletins officiels et la relation parentale des écoles au Bénin, au Togo et dans toute l'Afrique.",
    'landing.create_school_btn': "Créer l'Espace de mon École",
    'landing.demo_btn': 'Tester la Démo Immédiate',
    'landing.features_nav': 'Fonctionnalités',
    'landing.pricing_nav': 'Tarifs',
    'landing.faq_nav': 'FAQ',
    'landing.contact_nav': 'Contact',
    'landing.login_btn': 'Connexion',
    'landing.register_btn': 'Inscrire mon École',

    // Global Search
    'search.modal_title': 'Recherche Globale Sécurisée',
    'search.no_results': 'Aucun résultat trouvé pour "{query}".',
    'search.students_cat': 'Élèves & Inscriptions',
    'search.teachers_cat': 'Corps Enseignant',
    'search.classes_cat': 'Classes & Salles',
    'search.subjects_cat': 'Matières & Programmes',
    'search.receipts_cat': 'Reçus de Paiement',
    'search.view_record': 'Ouvrir la fiche →'
  },
  en: {
    // Top Bar & Global
    'app.name': 'Eben School Manager',
    'app.tagline': 'School Management & Tuition Administration Platform',
    'nav.search_placeholder': 'Search students, teachers, classes, receipts...',
    'nav.switch_role': 'Test Roles & Isolation',
    'nav.school_view': 'School View:',
    'nav.public_site': 'View public website',
    'nav.logout': 'Sign Out',
    'nav.year': 'Year',
    'nav.tenant_isolation': 'Multi-Tenant Data Isolation Active',

    // Themes
    'theme.light': 'Light mode',
    'theme.dark': 'Dark mode',
    'theme.system': 'System mode',

    // Languages
    'lang.fr': 'Français',
    'lang.en': 'English',

    // Navigation Menu
    'menu.dashboard': 'Dashboard',
    'menu.students': 'Students & Admissions',
    'menu.classes': 'Classes & Curriculum',
    'menu.staff': 'Staff & Teachers',
    'menu.finance': 'Tuition & Cash Ledger',
    'menu.grades': 'Grades & Report Cards',
    'menu.attendance': 'Attendance & Lates',
    'menu.timetable': 'Timetables',
    'menu.parent_portal': 'Parent Portal',
    'menu.announcements': 'Announcements & Circulars',
    'menu.documents': 'Documents & Reports',
    'menu.settings': 'School Settings',
    'menu.support': 'Help & Support',
    'menu.super_admin': 'SaaS Administration',

    // Dashboard
    'dash.title': 'Administrative & Financial Dashboard',
    'dash.enrolled_students': 'Enrolled Students',
    'dash.expected_tuition': 'Expected Tuition',
    'dash.collected_tuition': 'Collected Tuition',
    'dash.outstanding_balance': 'Outstanding Balance',
    'dash.recovery_rate': 'Collection Rate:',
    'dash.recent_payments': 'Recent Tuition Payments',
    'dash.record_payment_btn': 'Record Payment',
    'dash.new_student_btn': 'Enroll Student',
    'dash.view_journal': 'View full ledger',
    'dash.attendance_card': 'Attendance & Punctuality',
    'dash.presents': 'Present',
    'dash.lates': 'Late',
    'dash.absents': 'Absent',
    'dash.take_attendance': 'Take session roll call',
    'dash.official_accreditation': 'Government Accreditation Verified',

    // Students
    'student.title': 'Student Records & Admissions',
    'student.count': '{count} students',
    'student.new_btn': 'New Student Admission',
    'student.search_placeholder': 'Search by name, student ID or parent contact...',
    'student.all_classes': 'All classes',
    'student.all_statuses': 'All statuses',
    'student.status_en_regle': 'In Good Standing (Paid)',
    'student.status_en_retard': 'Tuition Overdue',
    'student.status_inscrit': 'Enrolled (Pending Installment)',
    'student.status_archive': 'Archived',
    'student.matricule': 'Student ID',
    'student.name': 'Student Name',
    'student.class': 'Class',
    'student.birth': 'Date of Birth',
    'student.parent': 'Parent / Guardian',
    'student.payment_status': 'Tuition Status',
    'student.actions': 'Actions',
    'student.print_form': 'Print Admission Form',
    'student.edit': 'Edit record',
    'student.archive': 'Archive',

    // Classes & Curriculum
    'class.title': 'Curriculum Structure, Classes & Subjects',
    'class.subtitle': 'Configure levels, coefficients, form tutors and classrooms.',
    'class.add_class_btn': 'Add New Class',
    'class.add_subject_btn': '+ New Subject',
    'class.master_catalog_btn': 'Import from National Catalog',
    'class.main_teacher': 'Form Tutor / Class Teacher:',
    'class.print_roster': 'Official Class Roster',
    'class.subjects_table_title': 'Taught Subjects & Academic Coefficients',
    'class.code': 'Code',
    'class.subject_name': 'Subject Name',
    'class.subject_name_en': 'English Name',
    'class.level': 'Level',
    'class.coefficient': 'Standard Coefficient',
    'class.active': 'Active',

    // Staff
    'staff.title': 'Administrative Staff & Faculty Directory',
    'staff.add_btn': 'Add Staff Member',
    'staff.taught_subjects': 'Taught subjects:',
    'staff.assigned_classes': 'Assigned classes:',

    // Finance
    'finance.title': 'Tuition Collection & Cash Ledger',
    'finance.total_collected': 'Total Collected in Cash',
    'finance.total_receipts': 'Total Issued Receipts',
    'finance.total_cancelled': 'Cancelled Transactions',
    'finance.record_btn': 'Record Payment Receipt',
    'finance.tab_ledger': 'Cash & Receipts Ledger',
    'finance.tab_statement': 'Student Account Statement',
    'finance.tab_fees': 'Fee Structure by Class',
    'finance.receipt_num': 'Receipt No.',
    'finance.fee_category': 'Fee Category',
    'finance.payment_method': 'Method & Ref',
    'finance.amount': 'Amount ({currency})',
    'finance.recorded_by': 'Received By',
    'finance.print_receipt': 'Print Official Receipt',
    'finance.download_receipt_pdf': 'Download Receipt PDF',
    'finance.cancel_receipt': 'Cancel Payment (Audit Error)',

    // Grades & Report Cards
    'grade.title': 'Assessments, Grades & Report Cards',
    'grade.new_assessment': 'New Assessment / Test',
    'grade.class_selector': 'Class:',
    'grade.term_selector': 'Period / Term:',
    'grade.save_grades': 'Save Grades',
    'grade.print_bulletin': 'Print Report Card',
    'grade.download_bulletin_pdf': 'Download Report Card PDF',
    'grade.view_bulletin': 'View Report Card',
    'grade.bulletin_title': 'OFFICIAL ACADEMIC REPORT CARD',
    'grade.general_average': 'Overall Average:',
    'grade.rank': 'Class Rank:',
    'grade.council_appreciation': 'Academic Board Remark:',

    // Attendance & Timetable
    'att.title': 'Student Attendance & Punctuality Registry',
    'att.mark_all_present': 'Mark All Present',
    'att.save_sheet': 'Submit Roll Call',
    'tt.title': 'Class Timetables & Room Scheduling',
    'tt.add_lesson': 'Schedule Lesson',
    'tt.conflict_warning': 'Scheduling Conflict Detected:',

    // Parent Portal
    'parent.portal_title': 'Secure Parent Portal',
    'parent.child': 'Child:',
    'parent.tuition_balance': 'Tuition Balance',
    'parent.grades_tab': 'Grades & Report Cards',
    'parent.finance_tab': 'Tuition & Official Receipts',
    'parent.attendance_tab': 'Attendance & Lates',

    // Documents & Reports
    'doc.title': 'Academic Documents & Official Reports',
    'doc.unpaid_title': 'Tuition Arrears & Overdue List',
    'doc.journal_title': 'Cash Ledger & Collection Book',
    'doc.print': 'Print Document',
    'doc.download_pdf': 'Download PDF',

    // Settings
    'settings.title': 'School Profile & Configuration',
    'settings.country': 'Country',
    'settings.education_system': 'Education System',
    'settings.currency': 'Currency & Symbol',
    'settings.grading_scale': 'Grading Scale',
    'settings.default_language': 'School Default Language',
    'settings.save': 'Save Configuration',

    // Super Admin
    'admin.title': 'SaaS Platform Global Administration',
    'admin.schools_tab': 'Subscribed Schools',
    'admin.isolation_test_tab': 'Strict Multi-Tenant Isolation Sandbox',
    'admin.plans_tab': 'Subscription Plans',
    'admin.audit_tab': 'Global Security Audit Logs',

    // Public Landing
    'landing.hero_badge': 'Pan-African & Multi-Country EdTech SaaS',
    'landing.hero_title': 'Modern, rigorous and reliable school management.',
    'landing.hero_desc': 'Eben School Manager digitalizes administration, multi-currency tuition, official report cards and parent communication for private schools in Benin, Togo and across Africa.',
    'landing.create_school_btn': 'Create School Workspace',
    'landing.demo_btn': 'Try Immediate Demo',
    'landing.features_nav': 'Features',
    'landing.pricing_nav': 'Pricing',
    'landing.faq_nav': 'FAQ',
    'landing.contact_nav': 'Contact',
    'landing.login_btn': 'Sign In',
    'landing.register_btn': 'Register School',

    // Global Search
    'search.modal_title': 'Secure Global Search',
    'search.no_results': 'No results found for "{query}".',
    'search.students_cat': 'Students & Admissions',
    'search.teachers_cat': 'Teaching Faculty',
    'search.classes_cat': 'Classes & Rooms',
    'search.subjects_cat': 'Subjects & Curriculum',
    'search.receipts_cat': 'Payment Receipts',
    'search.view_record': 'Open record →'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY) as AppLanguage;
      if (stored && ['fr', 'en'].includes(stored)) {
        return stored;
      }
    } catch (e) {
      // ignore
    }
    return 'fr';
  });

  const setLanguage = (newLang: AppLanguage) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    } catch (e) {
      console.warn('Failed to save language in localStorage', e);
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = TRANSLATIONS[language]?.[key] || TRANSLATIONS['fr']?.[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
