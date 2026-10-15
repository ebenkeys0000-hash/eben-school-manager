import {
  School,
  User,
  AcademicYear,
  ClassRoom,
  Subject,
  Student,
  FeeStructure,
  Payment,
  Assessment,
  Grade,
  AttendanceRecord,
  TimetableSlot,
  Announcement,
  SubscriptionPlan,
  AuditLog,
  UserRole,
  SupportTicket,
  SupportCategory,
  SupportStatus,
  SupportInternalNote
} from '../types';
import { getCountryConfig } from '../data/countries';
import { MASTER_SUBJECT_CATALOG } from '../data/subjectCatalog';

const STORAGE_KEY = 'eben_school_manager_db_v1';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_standard',
    name: 'Formule Scolaire Standard',
    tagline: 'Pour écoles primaires et collèges de quartier',
    priceMonthlyXOF: 25000,
    priceYearlyXOF: 250000,
    maxStudents: 300,
    features: [
      "Jusqu'à 300 élèves",
      'Gestion administrative & inscriptions',
      'Recouvrement des scolarités & reçus',
      'Bulletins trimestriels officiels',
      'Accès pour 10 enseignants',
      'Support par WhatsApp & Email'
    ]
  },
  {
    id: 'plan_pro',
    name: 'Formule Excellence Pro',
    tagline: 'Pour complexes scolaires et lycées dynamiques',
    priceMonthlyXOF: 55000,
    priceYearlyXOF: 550000,
    maxStudents: 1000,
    popular: true,
    features: [
      "Jusqu'à 1 000 élèves",
      'Toutes les fonctionnalités Standard',
      'Portail Parents sécurisé en ligne',
      'Gestion des présences & retards',
      'Emploi du temps & détection des conflits',
      'Historique comptable & journal de caisse',
      'Enseignants et personnel illimités',
      'Assistance prioritaire 6j/7'
    ]
  },
  {
    id: 'plan_elite',
    name: 'Formule Réseau Élite',
    tagline: 'Pour grands groupes scolaires et diocèses',
    priceMonthlyXOF: 110000,
    priceYearlyXOF: 1100000,
    maxStudents: 3500,
    features: [
      'Élèves et classes illimités',
      'Multi-campus ou multi-sites',
      'Rapprochement bancaire et Mobile Money',
      'Statistiques prédictives de recouvrement',
      'Archivage sécurisé à vie des diplômes',
      'Accompagnement & formation sur site',
      'Chef de projet dédié 24h/24'
    ]
  }
];

interface DatabaseSchema {
  schools: School[];
  users: User[];
  academicYears: AcademicYear[];
  classes: ClassRoom[];
  subjects: Subject[];
  students: Student[];
  feeStructures: FeeStructure[];
  payments: Payment[];
  assessments: Assessment[];
  grades: Grade[];
  attendance: AttendanceRecord[];
  timetables: TimetableSlot[];
  announcements: Announcement[];
  auditLogs: AuditLog[];
  supportTickets: SupportTicket[];
}

function getInitialData(): DatabaseSchema {
  // School 1: Complexe Scolaire La Renaissance (Cotonou)
  const school1: School = {
    id: 'school-cslr',
    name: 'Complexe Scolaire La Renaissance',
    code: 'CSLR-COT',
    type: 'COMPLEXE_SCOLAIRE',
    address: 'Lot 142, Quartier Haie Vive, Rue des Palmiers',
    city: 'Cotonou',
    country: 'Bénin',
    phone: '+229 21 30 12 45',
    email: 'contact@larenaissance-cotonou.bj',
    registrationNumber: 'Agrément MESTFP N° 048/2019/MESTFP/DC/SGM',
    directorName: 'Mme Solange Dossou-Yovo',
    currency: 'XOF',
    currentAcademicYear: '2025-2026',
    subscriptionPlanId: 'plan_pro',
    subscriptionStatus: 'ACTIF',
    subscriptionRenewsAt: '2027-08-31',
    createdAt: '2024-09-01'
  };

  // School 2: Collège Catholique Saint-Jean (Porto-Novo)
  const school2: School = {
    id: 'school-ccsj',
    name: 'Collège Catholique Saint-Jean',
    code: 'CCSJ-PN',
    type: 'COLLEGE_LYCEE',
    address: 'Avenue Mgr de Souza, Quartier Ouando',
    city: 'Porto-Novo',
    country: 'Bénin',
    phone: '+229 20 22 18 90',
    email: 'direction@saintjean-portonovo.bj',
    registrationNumber: 'Agrément MESTFP N° 112/2018/MESTFP/DC/SGM',
    directorName: 'Père Emmanuel Houngbédji',
    currency: 'XOF',
    currentAcademicYear: '2025-2026',
    subscriptionPlanId: 'plan_standard',
    subscriptionStatus: 'ACTIF',
    subscriptionRenewsAt: '2027-09-15',
    createdAt: '2024-10-10'
  };

  const users: User[] = [
    // Super admin
    {
      id: 'user-superadmin',
      schoolId: null,
      name: 'Ébénézer Amedendi',
      email: 'admin@ebenschool.bj',
      role: 'SUPER_ADMIN',
      phone: '+229 97 00 11 22',
      createdAt: '2024-01-01'
    },
    // School 1 Users
    {
      id: 'user-cslr-dir',
      schoolId: 'school-cslr',
      name: 'Mme Solange Dossou-Yovo',
      email: 'directrice@larenaissance-cotonou.bj',
      role: 'DIRECTOR',
      phone: '+229 97 12 34 56',
      createdAt: '2024-09-01'
    },
    {
      id: 'user-cslr-acct',
      schoolId: 'school-cslr',
      name: 'M. Marcellin Agbossou',
      email: 'comptable@larenaissance-cotonou.bj',
      role: 'ACCOUNTANT',
      phone: '+229 95 44 33 22',
      createdAt: '2024-09-05'
    },
    {
      id: 'user-cslr-prof-math',
      schoolId: 'school-cslr',
      name: 'Prof. Édouard Kpodékon',
      email: 'prof.maths@larenaissance-cotonou.bj',
      role: 'TEACHER',
      phone: '+229 96 88 77 66',
      assignedClassIds: ['cls-cslr-6a', 'cls-cslr-3b'],
      assignedSubjectIds: ['subj-cslr-math'],
      createdAt: '2024-09-10'
    },
    {
      id: 'user-cslr-prof-fr',
      schoolId: 'school-cslr',
      name: 'Mme Bernadette Tossou',
      email: 'prof.francais@larenaissance-cotonou.bj',
      role: 'TEACHER',
      phone: '+229 97 55 44 33',
      assignedClassIds: ['cls-cslr-6a', 'cls-cslr-tled'],
      assignedSubjectIds: ['subj-cslr-fr'],
      createdAt: '2024-09-10'
    },
    {
      id: 'user-cslr-parent-mensah',
      schoolId: 'school-cslr',
      name: 'Mme Clarisse Mensah',
      email: 'parent.mensah@gmail.com',
      role: 'PARENT',
      phone: '+229 97 22 88 11',
      childrenStudentIds: ['stu-cslr-001', 'stu-cslr-003'],
      createdAt: '2024-09-15'
    },
    // School 2 Users
    {
      id: 'user-ccsj-dir',
      schoolId: 'school-ccsj',
      name: 'Père Emmanuel Houngbédji',
      email: 'direction@saintjean-portonovo.bj',
      role: 'DIRECTOR',
      phone: '+229 96 11 22 33',
      createdAt: '2024-10-10'
    },
    {
      id: 'user-ccsj-teacher',
      schoolId: 'school-ccsj',
      name: 'M. Justin Hounkpatin',
      email: 'j.hounkpatin@saintjean-portonovo.bj',
      role: 'TEACHER',
      phone: '+229 95 33 22 11',
      assignedClassIds: ['cls-ccsj-6st'],
      assignedSubjectIds: ['subj-ccsj-fr'],
      createdAt: '2024-10-12'
    },
    {
      id: 'user-ccsj-parent',
      schoolId: 'school-ccsj',
      name: 'M. Gérard Houndéla',
      email: 'parent.houndegla@gmail.com',
      role: 'PARENT',
      phone: '+229 97 44 11 00',
      childrenStudentIds: ['stu-ccsj-001'],
      createdAt: '2024-10-15'
    }
  ];

  const academicYears: AcademicYear[] = [
    {
      id: 'ay-cslr-2526',
      schoolId: 'school-cslr',
      name: '2025-2026',
      startDate: '2025-09-15',
      endDate: '2026-06-30',
      isCurrent: true
    },
    {
      id: 'ay-ccsj-2526',
      schoolId: 'school-ccsj',
      name: '2025-2026',
      startDate: '2025-09-15',
      endDate: '2026-06-30',
      isCurrent: true
    }
  ];

  const classes: ClassRoom[] = [
    // School 1 Classes
    {
      id: 'cls-cslr-6a',
      schoolId: 'school-cslr',
      name: '6ème A',
      level: 'Collège',
      academicYearId: 'ay-cslr-2526',
      mainTeacherId: 'user-cslr-prof-math',
      capacity: 45,
      roomNumber: 'Bâtiment B - Salle 12'
    },
    {
      id: 'cls-cslr-3b',
      schoolId: 'school-cslr',
      name: '3ème B',
      level: 'Collège',
      academicYearId: 'ay-cslr-2526',
      mainTeacherId: 'user-cslr-prof-math',
      capacity: 40,
      roomNumber: 'Bâtiment B - Salle 24'
    },
    {
      id: 'cls-cslr-tled',
      schoolId: 'school-cslr',
      name: 'Terminale D',
      level: 'Lycée',
      academicYearId: 'ay-cslr-2526',
      mainTeacherId: 'user-cslr-prof-fr',
      capacity: 35,
      roomNumber: 'Bâtiment C - Salle 04'
    },
    // School 2 Classes
    {
      id: 'cls-ccsj-6st',
      schoolId: 'school-ccsj',
      name: '6ème Sainte-Thérèse',
      level: 'Collège',
      academicYearId: 'ay-ccsj-2526',
      mainTeacherId: 'user-ccsj-teacher',
      capacity: 40,
      roomNumber: 'Pavillon Saint-Joseph'
    },
    {
      id: 'cls-ccsj-3aug',
      schoolId: 'school-ccsj',
      name: '3ème Saint-Augustin',
      level: 'Collège',
      academicYearId: 'ay-ccsj-2526',
      capacity: 42,
      roomNumber: 'Pavillon Sainte-Monique'
    }
  ];

  const subjects: Subject[] = [
    // School 1 Subjects
    {
      id: 'subj-cslr-fr',
      schoolId: 'school-cslr',
      name: 'Français & Expression Écrite',
      code: 'FRAN',
      defaultCoefficient: 4,
      level: 'Collège'
    },
    {
      id: 'subj-cslr-math',
      schoolId: 'school-cslr',
      name: 'Mathématiques',
      code: 'MATH',
      defaultCoefficient: 4,
      level: 'Collège'
    },
    {
      id: 'subj-cslr-ang',
      schoolId: 'school-cslr',
      name: 'Anglais',
      code: 'ANG',
      defaultCoefficient: 2,
      level: 'Collège'
    },
    {
      id: 'subj-cslr-hg',
      schoolId: 'school-cslr',
      name: 'Histoire & Géographie',
      code: 'HG',
      defaultCoefficient: 2,
      level: 'Collège'
    },
    {
      id: 'subj-cslr-svt',
      schoolId: 'school-cslr',
      name: 'Sciences de la Vie et de la Terre (SVT)',
      code: 'SVT',
      defaultCoefficient: 3,
      level: 'Collège'
    },
    {
      id: 'subj-cslr-pct',
      schoolId: 'school-cslr',
      name: 'Physique, Chimie & Technologie (PCT)',
      code: 'PCT',
      defaultCoefficient: 3,
      level: 'Collège'
    },
    {
      id: 'subj-cslr-eps',
      schoolId: 'school-cslr',
      name: 'Éducation Physique & Sportive (EPS)',
      code: 'EPS',
      defaultCoefficient: 1,
      level: 'Collège'
    },
    // School 2 Subjects
    {
      id: 'subj-ccsj-fr',
      schoolId: 'school-ccsj',
      name: 'Français',
      code: 'FR',
      defaultCoefficient: 4,
      level: 'Collège'
    },
    {
      id: 'subj-ccsj-math',
      schoolId: 'school-ccsj',
      name: 'Mathématiques',
      code: 'MATH',
      defaultCoefficient: 4,
      level: 'Collège'
    }
  ];

  const feeStructures: FeeStructure[] = [
    {
      id: 'fee-cslr-6e',
      schoolId: 'school-cslr',
      classId: 'cls-cslr-6a',
      academicYearId: 'ay-cslr-2526',
      registrationFee: 25000,
      tuitionFee: 180000,
      installment1: 70000,
      installment2: 60000,
      installment3: 50000,
      canteenFee: 45000,
      uniformFee: 15000
    },
    {
      id: 'fee-cslr-3e',
      schoolId: 'school-cslr',
      classId: 'cls-cslr-3b',
      academicYearId: 'ay-cslr-2526',
      registrationFee: 25000,
      tuitionFee: 220000,
      installment1: 90000,
      installment2: 70000,
      installment3: 60000,
      uniformFee: 15000
    },
    {
      id: 'fee-cslr-tle',
      schoolId: 'school-cslr',
      classId: 'cls-cslr-tled',
      academicYearId: 'ay-cslr-2526',
      registrationFee: 30000,
      tuitionFee: 260000,
      installment1: 110000,
      installment2: 80000,
      installment3: 70000,
      uniformFee: 15000
    },
    // School 2
    {
      id: 'fee-ccsj-6e',
      schoolId: 'school-ccsj',
      classId: 'cls-ccsj-6st',
      academicYearId: 'ay-ccsj-2526',
      registrationFee: 30000,
      tuitionFee: 160000,
      installment1: 60000,
      installment2: 50000,
      installment3: 50000,
      uniformFee: 20000
    }
  ];

  const students: Student[] = [
    // School 1 Students
    {
      id: 'stu-cslr-001',
      schoolId: 'school-cslr',
      matricule: 'CSLR-2025-001',
      firstName: 'Yannick',
      lastName: 'Mensah',
      gender: 'M',
      dateOfBirth: '2013-05-14',
      placeOfBirth: 'Cotonou (Bénin)',
      classId: 'cls-cslr-6a',
      academicYearId: 'ay-cslr-2526',
      enrollmentDate: '2025-09-08',
      status: 'EN_REGLE',
      parentName: 'Mme Clarisse Mensah',
      parentPhone: '+229 97 22 88 11',
      parentEmail: 'parent.mensah@gmail.com',
      parentAddress: 'Haie Vive, Cotonou'
    },
    {
      id: 'stu-cslr-002',
      schoolId: 'school-cslr',
      matricule: 'CSLR-2025-002',
      firstName: 'Amina',
      lastName: 'Bio Guéra',
      gender: 'F',
      dateOfBirth: '2013-08-22',
      placeOfBirth: 'Parakou (Bénin)',
      classId: 'cls-cslr-6a',
      academicYearId: 'ay-cslr-2526',
      enrollmentDate: '2025-09-10',
      status: 'EN_RETARD',
      parentName: 'M. Ousmane Bio Guéra',
      parentPhone: '+229 96 44 12 30',
      parentEmail: 'ousmane.bioguera@yahoo.fr',
      parentAddress: 'Akpakpa, Cotonou'
    },
    {
      id: 'stu-cslr-003',
      schoolId: 'school-cslr',
      matricule: 'CSLR-2025-003',
      firstName: 'Grâce',
      lastName: 'Mensah',
      gender: 'F',
      dateOfBirth: '2010-11-04',
      placeOfBirth: 'Cotonou (Bénin)',
      classId: 'cls-cslr-3b',
      academicYearId: 'ay-cslr-2526',
      enrollmentDate: '2025-09-08',
      status: 'EN_REGLE',
      parentName: 'Mme Clarisse Mensah',
      parentPhone: '+229 97 22 88 11',
      parentEmail: 'parent.mensah@gmail.com',
      parentAddress: 'Haie Vive, Cotonou'
    },
    {
      id: 'stu-cslr-004',
      schoolId: 'school-cslr',
      matricule: 'CSLR-2025-004',
      firstName: 'Arnaud',
      lastName: 'Codjia',
      gender: 'M',
      dateOfBirth: '2008-03-19',
      placeOfBirth: 'Ouidah (Bénin)',
      classId: 'cls-cslr-tled',
      academicYearId: 'ay-cslr-2526',
      enrollmentDate: '2025-09-05',
      status: 'EN_REGLE',
      parentName: 'M. Rodrigue Codjia',
      parentPhone: '+229 97 88 99 00',
      parentEmail: 'rodrigue.codjia@gmail.com',
      parentAddress: 'Fidjrossè Plage, Cotonou'
    },
    {
      id: 'stu-cslr-005',
      schoolId: 'school-cslr',
      matricule: 'CSLR-2025-005',
      firstName: 'Sylvie',
      lastName: 'Zinsou',
      gender: 'F',
      dateOfBirth: '2013-01-30',
      placeOfBirth: 'Abomey-Calavi (Bénin)',
      classId: 'cls-cslr-6a',
      academicYearId: 'ay-cslr-2526',
      enrollmentDate: '2025-09-12',
      status: 'INSCRIT',
      parentName: 'M. Jean Zinsou',
      parentPhone: '+229 95 67 89 01',
      parentEmail: 'jean.zinsou@gmail.com',
      parentAddress: 'Godomey, Abomey-Calavi'
    },
    // School 2 Student (Strictly isolated!)
    {
      id: 'stu-ccsj-001',
      schoolId: 'school-ccsj',
      matricule: 'CCSJ-2025-001',
      firstName: 'Bernice',
      lastName: 'Houndéla',
      gender: 'F',
      dateOfBirth: '2013-09-12',
      placeOfBirth: 'Porto-Novo (Bénin)',
      classId: 'cls-ccsj-6st',
      academicYearId: 'ay-ccsj-2526',
      enrollmentDate: '2025-09-15',
      status: 'EN_REGLE',
      parentName: 'M. Gérard Houndéla',
      parentPhone: '+229 97 44 11 00',
      parentEmail: 'parent.houndegla@gmail.com',
      parentAddress: 'Quartier Ouando, Porto-Novo'
    }
  ];

  const payments: Payment[] = [
    {
      id: 'pay-cslr-001',
      schoolId: 'school-cslr',
      studentId: 'stu-cslr-001',
      receiptNumber: 'REC-CSLR-25-001',
      amount: 25000,
      currency: 'XOF',
      date: '2025-09-08',
      method: 'ESPECES',
      reference: 'ESP-0908-01',
      feeCategory: 'INSCRIPTION',
      payerName: 'Mme Clarisse Mensah',
      recordedByUserId: 'user-cslr-acct',
      recordedByName: 'M. Marcellin Agbossou',
      status: 'VALIDE',
      notes: "Inscription rentrée 2025-2026 acquittée à l'accueil"
    },
    {
      id: 'pay-cslr-002',
      schoolId: 'school-cslr',
      studentId: 'stu-cslr-001',
      receiptNumber: 'REC-CSLR-25-002',
      amount: 70000,
      currency: 'XOF',
      date: '2025-09-18',
      method: 'MTN_MOMO',
      reference: 'TXN-MTN-29481023',
      feeCategory: 'TRANCHE_1',
      payerName: 'Mme Clarisse Mensah',
      recordedByUserId: 'user-cslr-acct',
      recordedByName: 'M. Marcellin Agbossou',
      status: 'VALIDE',
      notes: 'Paiement de la 1ère tranche via MTN Mobile Money'
    },
    {
      id: 'pay-cslr-003',
      schoolId: 'school-cslr',
      studentId: 'stu-cslr-003',
      receiptNumber: 'REC-CSLR-25-003',
      amount: 115000,
      currency: 'XOF',
      date: '2025-09-08',
      method: 'VIREMENT',
      reference: 'VIR-BOA-884920',
      feeCategory: 'TRANCHE_1',
      payerName: 'Mme Clarisse Mensah',
      recordedByUserId: 'user-cslr-acct',
      recordedByName: 'M. Marcellin Agbossou',
      status: 'VALIDE',
      notes: 'Inscription + 1ère tranche de Grâce Mensah (3ème B)'
    },
    {
      id: 'pay-cslr-004',
      schoolId: 'school-cslr',
      studentId: 'stu-cslr-002',
      receiptNumber: 'REC-CSLR-25-004',
      amount: 25000,
      currency: 'XOF',
      date: '2025-09-10',
      method: 'MOOV_MONEY',
      reference: 'MOOV-MM-583019',
      feeCategory: 'INSCRIPTION',
      payerName: 'M. Ousmane Bio Guéra',
      recordedByUserId: 'user-cslr-acct',
      recordedByName: 'M. Marcellin Agbossou',
      status: 'VALIDE',
      notes: "Frais d'inscription uniquement. 1ère tranche en attente."
    },
    // School 2 Payment
    {
      id: 'pay-ccsj-001',
      schoolId: 'school-ccsj',
      studentId: 'stu-ccsj-001',
      receiptNumber: 'REC-CCSJ-25-001',
      amount: 90000,
      currency: 'XOF',
      date: '2025-09-15',
      method: 'ESPECES',
      reference: 'ESP-CC-1509',
      feeCategory: 'TRANCHE_1',
      payerName: 'M. Gérard Houndéla',
      recordedByUserId: 'user-ccsj-dir',
      recordedByName: 'Père Emmanuel Houngbédji',
      status: 'VALIDE'
    }
  ];

  const assessments: Assessment[] = [
    {
      id: 'asm-cslr-001',
      schoolId: 'school-cslr',
      classId: 'cls-cslr-6a',
      subjectId: 'subj-cslr-math',
      teacherId: 'user-cslr-prof-math',
      academicYearId: 'ay-cslr-2526',
      term: 'TRIMESTRE_1',
      title: 'Interrogation Écrite N°1 - Arithmétique & Nombres Entiers',
      type: 'INTERRO',
      maxScore: 20,
      coefficient: 1,
      date: '2025-10-05'
    },
    {
      id: 'asm-cslr-002',
      schoolId: 'school-cslr',
      classId: 'cls-cslr-6a',
      subjectId: 'subj-cslr-math',
      teacherId: 'user-cslr-prof-math',
      academicYearId: 'ay-cslr-2526',
      term: 'TRIMESTRE_1',
      title: 'Devoir Surveillé N°1 - Calcul & Géométrie plane',
      type: 'DEVOIR_1',
      maxScore: 20,
      coefficient: 2,
      date: '2025-10-25'
    },
    {
      id: 'asm-cslr-003',
      schoolId: 'school-cslr',
      classId: 'cls-cslr-6a',
      subjectId: 'subj-cslr-fr',
      teacherId: 'user-cslr-prof-fr',
      academicYearId: 'ay-cslr-2526',
      term: 'TRIMESTRE_1',
      title: 'Devoir Surveillé N°1 - Grammaire et Vocabulaire',
      type: 'DEVOIR_1',
      maxScore: 20,
      coefficient: 2,
      date: '2025-10-28'
    }
  ];

  const grades: Grade[] = [
    {
      id: 'grd-001',
      schoolId: 'school-cslr',
      assessmentId: 'asm-cslr-001',
      studentId: 'stu-cslr-001',
      score: 16.5,
      remarks: 'Très bon raisonnement'
    },
    {
      id: 'grd-002',
      schoolId: 'school-cslr',
      assessmentId: 'asm-cslr-001',
      studentId: 'stu-cslr-002',
      score: 13.0,
      remarks: 'Bon travail, attention au soin'
    },
    {
      id: 'grd-003',
      schoolId: 'school-cslr',
      assessmentId: 'asm-cslr-001',
      studentId: 'stu-cslr-005',
      score: 11.5,
      remarks: 'Passable, revoir les définitions'
    },
    {
      id: 'grd-004',
      schoolId: 'school-cslr',
      assessmentId: 'asm-cslr-002',
      studentId: 'stu-cslr-001',
      score: 17.0,
      remarks: 'Excellent devoir, rigoureux'
    },
    {
      id: 'grd-005',
      schoolId: 'school-cslr',
      assessmentId: 'asm-cslr-002',
      studentId: 'stu-cslr-002',
      score: 14.5,
      remarks: 'Nette progression'
    },
    {
      id: 'grd-006',
      schoolId: 'school-cslr',
      assessmentId: 'asm-cslr-003',
      studentId: 'stu-cslr-001',
      score: 15.0,
      remarks: 'Bonne maîtrise de la conjugaison'
    }
  ];

  const attendance: AttendanceRecord[] = [
    {
      id: 'att-001',
      schoolId: 'school-cslr',
      classId: 'cls-cslr-6a',
      studentId: 'stu-cslr-001',
      date: '2025-10-14',
      session: 'MATIN',
      status: 'PRESENT',
      recordedBy: 'M. Édouard Kpodékon'
    },
    {
      id: 'att-002',
      schoolId: 'school-cslr',
      classId: 'cls-cslr-6a',
      studentId: 'stu-cslr-002',
      date: '2025-10-14',
      session: 'MATIN',
      status: 'RETARD',
      recordedBy: 'M. Édouard Kpodékon',
      reason: 'Embouteillages carrefour Akpakpa (15 min)'
    },
    {
      id: 'att-003',
      schoolId: 'school-cslr',
      classId: 'cls-cslr-6a',
      studentId: 'stu-cslr-005',
      date: '2025-10-14',
      session: 'MATIN',
      status: 'PRESENT',
      recordedBy: 'M. Édouard Kpodékon'
    }
  ];

  const timetables: TimetableSlot[] = [
    {
      id: 'tt-001',
      schoolId: 'school-cslr',
      classId: 'cls-cslr-6a',
      subjectId: 'subj-cslr-math',
      teacherId: 'user-cslr-prof-math',
      dayOfWeek: 1, // Lundi
      startTime: '07:30',
      endTime: '09:30',
      room: 'Salle 12'
    },
    {
      id: 'tt-002',
      schoolId: 'school-cslr',
      classId: 'cls-cslr-6a',
      subjectId: 'subj-cslr-fr',
      teacherId: 'user-cslr-prof-fr',
      dayOfWeek: 1, // Lundi
      startTime: '09:45',
      endTime: '11:45',
      room: 'Salle 12'
    },
    {
      id: 'tt-003',
      schoolId: 'school-cslr',
      classId: 'cls-cslr-3b',
      subjectId: 'subj-cslr-math',
      teacherId: 'user-cslr-prof-math',
      dayOfWeek: 2, // Mardi
      startTime: '07:30',
      endTime: '09:30',
      room: 'Salle 24'
    }
  ];

  const announcements: Announcement[] = [
    {
      id: 'ann-001',
      schoolId: 'school-cslr',
      title: 'Rentrée Académique 2025-2026 & Réunion des Parents d’Élèves',
      content: 'La Direction générale informe tous les parents que la grande réunion de rentrée se tiendra ce samedi à 09h00 précises dans la cour principale. La présence de tous les tuteurs est vivement souhaitée.',
      targetRole: 'TOUS',
      date: '2025-10-10',
      authorName: 'Mme Solange Dossou-Yovo (Directrice)',
      priority: 'NORMALE'
    },
    {
      id: 'ann-002',
      schoolId: 'school-cslr',
      title: 'Rappel pour le règlement de la 1ère tranche de scolarité',
      content: 'Chers parents, la date butoir pour le versement intégral de la 1ère tranche est fixée au 31 octobre 2025. Les règlements peuvent s’effectuer par MTN MoMo, Moov Money ou au secrétariat de la caisse.',
      targetRole: 'PARENTS',
      date: '2025-10-12',
      authorName: 'Service Comptabilité & Caisse',
      priority: 'URGENTE'
    }
  ];

  const auditLogs: AuditLog[] = [
    {
      id: 'log-001',
      schoolId: 'school-cslr',
      timestamp: '2025-10-14 08:30:12',
      userId: 'user-cslr-acct',
      userName: 'M. Marcellin Agbossou',
      action: 'ENCAISSEMENT_SCOLARITE',
      details: 'Enregistrement reçu REC-CSLR-25-002 pour Yannick Mensah (70 000 FCFA MTN MoMo)'
    },
    {
      id: 'log-002',
      schoolId: 'school-cslr',
      timestamp: '2025-10-14 10:15:00',
      userId: 'user-cslr-prof-math',
      userName: 'Prof. Édouard Kpodékon',
      action: 'SAISIE_NOTES',
      details: 'Saisie des notes pour Interrogation Écrite N°1 en 6ème A'
    }
  ];

  const supportTickets: SupportTicket[] = [
    {
      id: 'tick-001',
      ticketNumber: 'TICK-2026-0001',
      userId: 'user-cslr-acct',
      schoolId: 'school-cslr',
      fullName: 'M. Marcellin Agbossou',
      schoolName: 'Complexe Scolaire La Renaissance',
      email: 'm.agbossou@renaissance-cotonou.bj',
      whatsappNumber: '+229 97 12 34 56',
      category: 'SCOLARITE_PAIEMENTS',
      description: 'Demande d’assistance sur la génération des reçus groupés avec QR Code pour les virements bancaires.',
      status: 'EN_COURS',
      createdAt: '2026-10-12T09:30:00Z',
      updatedAt: '2026-10-12T14:15:00Z',
      internalNotes: [
        {
          id: 'note-1',
          authorName: 'Eben Keys',
          content: 'Contacté sur WhatsApp pour confirmation des maquettes. Ticket en cours de traitement.',
          createdAt: '2026-10-12T14:15:00Z'
        }
      ]
    },
    {
      id: 'tick-002',
      ticketNumber: 'TICK-2026-0002',
      userId: 'user-ccsj-dir',
      schoolId: 'school-ccsj',
      fullName: 'Père Emmanuel Houngbédji',
      schoolName: 'Collège Catholique Saint-Jean',
      email: 'direction@saintjean-portonovo.bj',
      whatsappNumber: '+229 96 11 22 33',
      category: 'NOTES_BULLETINS',
      description: 'Aide souhaitée pour la configuration des coefficients en Seconde A4 et Terminale D.',
      status: 'RESOLU',
      createdAt: '2026-10-10T11:00:00Z',
      updatedAt: '2026-10-11T16:30:00Z',
      internalNotes: [
        {
          id: 'note-2',
          authorName: 'Eben Keys',
          content: 'Résolu. Le directeur a été assisté par téléphone et le tableau de coefficients est opérationnel.',
          createdAt: '2026-10-11T16:30:00Z'
        }
      ]
    },
    {
      id: 'tick-003',
      ticketNumber: 'TICK-2026-0003',
      userId: null,
      schoolId: null,
      fullName: 'Dr. Théophile Houndégnon',
      schoolName: 'Institut Polyvalent de Comé',
      email: 'houndegnon.theo@yahoo.fr',
      whatsappNumber: '+229 95 88 77 66',
      category: 'INSCRIPTION_ECOLE',
      description: 'Bonjour M. Eben Keys, nous souhaitons déployer Eben School Manager pour notre établissement technique à Comé. Merci de nous guider.',
      status: 'NOUVEAU',
      createdAt: '2026-10-14T17:45:00Z',
      updatedAt: '2026-10-14T17:45:00Z',
      internalNotes: []
    }
  ];

  return {
    schools: [school1, school2],
    users,
    academicYears,
    classes,
    subjects,
    students,
    feeStructures,
    payments,
    assessments,
    grades,
    attendance,
    timetables,
    announcements,
    auditLogs,
    supportTickets
  };
}

class DataService {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: DatabaseSchema = JSON.parse(stored);
        if (parsed.schools) {
          parsed.schools = parsed.schools.map((s) => {
            const countryCfg = getCountryConfig(s.country || 'Benin');
            return {
              ...s,
              countryCode: s.countryCode || countryCfg.code,
              currency: s.currency || countryCfg.currency,
              currencySymbol: s.currencySymbol || countryCfg.currencySymbol,
              defaultLanguage: s.defaultLanguage || countryCfg.defaultLanguage,
              educationSystem: s.educationSystem || countryCfg.educationSystemName,
              gradingScale: s.gradingScale || countryCfg.gradingScale,
              academicPeriodType: s.academicPeriodType || countryCfg.academicPeriods
            };
          });
        }
        if (parsed.subjects) {
          parsed.subjects = parsed.subjects.map((sub) => ({
            ...sub,
            isActive: sub.isActive !== undefined ? sub.isActive : true,
            nameEn: sub.nameEn || MASTER_SUBJECT_CATALOG.find((m) => m.code === sub.code)?.nameEn || sub.name
          }));
        }
        if (!parsed.supportTickets || !Array.isArray(parsed.supportTickets) || parsed.supportTickets.length === 0) {
          parsed.supportTickets = getInitialData().supportTickets;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse stored DB, resetting to defaults', e);
    }
    const initial = getInitialData();
    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseSchema) {
    this.data = data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  public resetToDefaults(): DatabaseSchema {
    const initial = getInitialData();
    this.saveData(initial);
    return initial;
  }

  // Multi-Tenant Isolation Checks:
  // Ensures that all queries for school-owned records require an authorized schoolId.

  public getSchools(): School[] {
    return [...this.data.schools];
  }

  public getSchoolById(schoolId: string): School | undefined {
    return this.data.schools.find((s) => s.id === schoolId);
  }

  public registerSchool(input: {
    name: string;
    type: School['type'];
    address: string;
    city: string;
    country: string;
    phone: string;
    email: string;
    registrationNumber: string;
    directorName: string;
    adminEmail: string;
    logo?: string;
    subscriptionPlanId?: string;
    educationSystem?: string;
    currency?: string;
    currencySymbol?: string;
    defaultLanguage?: 'fr' | 'en';
    gradingScale?: '/20' | '/100%' | 'A-F' | '1-9';
    academicPeriodType?: 'TRIMESTRE' | 'SEMESTRE' | 'TERM';
  }): { school: School; adminUser: User } {
    const countryConfig = getCountryConfig(input.country || 'Benin');
    const cleanPrefix = input.name
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .substring(0, 4) || 'SCH';
    const code = `${cleanPrefix}-${input.city.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const schoolId = `school-${Date.now()}`;

    const newSchool: School = {
      id: schoolId,
      name: input.name,
      code,
      type: input.type,
      logo: input.logo,
      address: input.address,
      city: input.city,
      country: input.country || 'Bénin',
      countryCode: countryConfig.code,
      phone: input.phone,
      email: input.email,
      registrationNumber: input.registrationNumber,
      directorName: input.directorName,
      currency: input.currency || countryConfig.currency,
      currencySymbol: input.currencySymbol || countryConfig.currencySymbol,
      defaultLanguage: input.defaultLanguage || countryConfig.defaultLanguage,
      educationSystem: input.educationSystem || countryConfig.educationSystemName,
      gradingScale: input.gradingScale || countryConfig.gradingScale,
      academicPeriodType: input.academicPeriodType || countryConfig.academicPeriods,
      currentAcademicYear: '2025-2026',
      subscriptionPlanId: input.subscriptionPlanId || 'plan_standard',
      subscriptionStatus: 'ESSAI',
      subscriptionRenewsAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0]
    };

    const academicYearId = `ay-${schoolId}-2526`;
    const academicYear: AcademicYear = {
      id: academicYearId,
      schoolId,
      name: '2025-2026',
      startDate: '2025-09-15',
      endDate: '2026-06-30',
      isCurrent: true
    };

    const adminUser: User = {
      id: `user-${schoolId}-admin`,
      schoolId,
      name: input.directorName,
      email: input.adminEmail,
      role: 'DIRECTOR',
      phone: input.phone,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Country-tailored default classes
    const defaultClasses: ClassRoom[] = [];
    if (countryConfig.defaultCycles && countryConfig.defaultCycles.length > 0) {
      const primaryCycle = countryConfig.defaultCycles[0];
      const secondaryCycle = countryConfig.defaultCycles[1] || countryConfig.defaultCycles[0];
      
      defaultClasses.push({
        id: `cls-${schoolId}-c1`,
        schoolId,
        name: secondaryCycle.classes[0] || '6ème A',
        level: (secondaryCycle.level as any) || 'Collège',
        academicYearId,
        capacity: 45,
        roomNumber: 'Salle 01'
      });
      defaultClasses.push({
        id: `cls-${schoolId}-c2`,
        schoolId,
        name: secondaryCycle.classes[1] || secondaryCycle.classes[0] || '5ème A',
        level: (secondaryCycle.level as any) || 'Collège',
        academicYearId,
        capacity: 40,
        roomNumber: 'Salle 02'
      });
    } else {
      defaultClasses.push(
        {
          id: `cls-${schoolId}-6a`,
          schoolId,
          name: '6ème A',
          level: 'Collège',
          academicYearId,
          capacity: 45,
          roomNumber: 'Salle 01'
        },
        {
          id: `cls-${schoolId}-3a`,
          schoolId,
          name: '3ème A',
          level: 'Collège',
          academicYearId,
          capacity: 40,
          roomNumber: 'Salle 04'
        }
      );
    }

    // Default subjects from master catalog with bilingual support
    const defaultSubjects: Subject[] = [
      { id: `subj-${schoolId}-math`, schoolId, name: 'Mathématiques', nameEn: 'Mathematics', code: 'MATH', defaultCoefficient: 4, level: 'Collège', isActive: true, category: 'SCIENCES' },
      { id: `subj-${schoolId}-fr`, schoolId, name: 'Français', nameEn: 'French', code: 'FRAN', defaultCoefficient: 4, level: 'Collège', isActive: true, category: 'LANGUES' },
      { id: `subj-${schoolId}-ang`, schoolId, name: 'Anglais', nameEn: 'English', code: 'ANG', defaultCoefficient: 2, level: 'Collège', isActive: true, category: 'LANGUES' },
      { id: `subj-${schoolId}-svt`, schoolId, name: 'Sciences de la Vie et de la Terre (SVT)', nameEn: 'Life and Earth Sciences', code: 'SVT', defaultCoefficient: 3, level: 'Collège', isActive: true, category: 'SCIENCES' },
      { id: `subj-${schoolId}-hg`, schoolId, name: 'Histoire-Géographie', nameEn: 'History & Geography', code: 'HG', defaultCoefficient: 2, level: 'Collège', isActive: true, category: 'HUMANITES' },
      { id: `subj-${schoolId}-info`, schoolId, name: 'Informatique', nameEn: 'Computer Science', code: 'INFO', defaultCoefficient: 2, level: 'Collège', isActive: true, category: 'TECHNIQUE' }
    ];

    // Default fee structure
    const defaultFees: FeeStructure[] = [
      {
        id: `fee-${schoolId}-6a`,
        schoolId,
        classId: defaultClasses[0].id,
        academicYearId,
        registrationFee: 25000,
        tuitionFee: 150000,
        installment1: 60000,
        installment2: 50000,
        installment3: 40000,
        uniformFee: 15000
      }
    ];

    const auditLog: AuditLog = {
      id: `log-${Date.now()}`,
      schoolId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: adminUser.id,
      userName: adminUser.name,
      action: 'CREATION_ETABLISSEMENT',
      details: `Création du nouvel établissement ${input.name} (${code})`
    };

    this.data.schools.push(newSchool);
    this.data.users.push(adminUser);
    this.data.academicYears.push(academicYear);
    this.data.classes.push(...defaultClasses);
    this.data.subjects.push(...defaultSubjects);
    this.data.feeStructures.push(...defaultFees);
    this.data.auditLogs.unshift(auditLog);

    this.saveData(this.data);
    return { school: newSchool, adminUser };
  }

  public updateSchoolProfile(schoolId: string, updates: Partial<School>): School {
    const idx = this.data.schools.findIndex((s) => s.id === schoolId);
    if (idx === -1) throw new Error('Établissement non trouvé');
    this.data.schools[idx] = { ...this.data.schools[idx], ...updates };
    this.saveData(this.data);
    return this.data.schools[idx];
  }

  // --- Users & Staff (Isolated by schoolId) ---
  public getUsers(schoolId: string | null): User[] {
    if (!schoolId) return this.data.users; // Super admin
    return this.data.users.filter((u) => u.schoolId === schoolId);
  }

  public addUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.data.users.push(newUser);
    this.saveData(this.data);
    return newUser;
  }

  public updateUser(userId: string, updates: Partial<User>): User {
    const idx = this.data.users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('Utilisateur non trouvé');
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.saveData(this.data);
    return this.data.users[idx];
  }

  // --- Academic Years ---
  public getAcademicYears(schoolId: string): AcademicYear[] {
    return this.data.academicYears.filter((ay) => ay.schoolId === schoolId);
  }

  public addAcademicYear(schoolId: string, name: string, startDate: string, endDate: string): AcademicYear {
    const newAy: AcademicYear = {
      id: `ay-${schoolId}-${Date.now()}`,
      schoolId,
      name,
      startDate,
      endDate,
      isCurrent: true
    };
    // set others to false
    this.data.academicYears.forEach((ay) => {
      if (ay.schoolId === schoolId) ay.isCurrent = false;
    });
    this.data.academicYears.push(newAy);
    this.saveData(this.data);
    return newAy;
  }

  // --- Classes & Subjects (Isolated by schoolId) ---
  public getClasses(schoolId: string): ClassRoom[] {
    return this.data.classes.filter((c) => c.schoolId === schoolId);
  }

  public addClass(classRoom: Omit<ClassRoom, 'id'>): ClassRoom {
    const newClass: ClassRoom = {
      ...classRoom,
      id: `cls-${classRoom.schoolId}-${Date.now()}`
    };
    this.data.classes.push(newClass);
    this.saveData(this.data);
    return newClass;
  }

  public updateClass(classId: string, updates: Partial<ClassRoom>): ClassRoom {
    const idx = this.data.classes.findIndex((c) => c.id === classId);
    if (idx === -1) throw new Error('Classe non trouvée');
    this.data.classes[idx] = { ...this.data.classes[idx], ...updates };
    this.saveData(this.data);
    return this.data.classes[idx];
  }

  public getSubjects(schoolId: string, onlyActive = false): Subject[] {
    return this.data.subjects.filter((s) => {
      if (s.schoolId !== schoolId) return false;
      if (onlyActive && s.isActive === false) return false;
      return true;
    });
  }

  public addSubject(subject: Omit<Subject, 'id'>): Subject {
    const newSubj: Subject = {
      ...subject,
      isActive: subject.isActive !== undefined ? subject.isActive : true,
      id: `subj-${subject.schoolId}-${Date.now()}`
    };
    this.data.subjects.push(newSubj);
    this.saveData(this.data);
    return newSubj;
  }

  public updateSubject(schoolId: string, subjectId: string, updates: Partial<Subject>): Subject {
    const idx = this.data.subjects.findIndex((s) => s.id === subjectId && s.schoolId === schoolId);
    if (idx === -1) throw new Error('Matière non trouvée');
    // Historical grades safety: only update subject definition metadata for future periods
    this.data.subjects[idx] = { ...this.data.subjects[idx], ...updates };
    this.saveData(this.data);
    return this.data.subjects[idx];
  }

  public toggleSubjectActive(schoolId: string, subjectId: string, isActive: boolean): Subject {
    return this.updateSubject(schoolId, subjectId, { isActive });
  }

  public importMasterSubjects(schoolId: string, subjectCodes: string[]): Subject[] {
    const imported: Subject[] = [];
    subjectCodes.forEach((code) => {
      const template = MASTER_SUBJECT_CATALOG.find((m) => m.code === code);
      if (template) {
        const exists = this.data.subjects.some((s) => s.schoolId === schoolId && s.code === code);
        if (!exists) {
          const newSubj: Subject = {
            id: `subj-${schoolId}-${code.toLowerCase()}-${Date.now()}`,
            schoolId,
            name: template.nameFr,
            nameEn: template.nameEn,
            code: template.code,
            defaultCoefficient: template.defaultCoefficient,
            level: template.level === 'Tous' ? 'Collège' : (template.level as any),
            isActive: true,
            category: template.category
          };
          this.data.subjects.push(newSubj);
          imported.push(newSubj);
        }
      }
    });
    this.saveData(this.data);
    return imported;
  }

  // --- Students (Isolated by schoolId) ---
  public getStudents(schoolId: string, options?: { classId?: string; status?: Student['status']; search?: string }): Student[] {
    return this.data.students.filter((st) => {
      if (st.schoolId !== schoolId) return false;
      if (options?.classId && st.classId !== options.classId) return false;
      if (options?.status && st.status !== options.status) return false;
      if (options?.search) {
        const q = options.search.toLowerCase();
        const matchesName = `${st.firstName} ${st.lastName}`.toLowerCase().includes(q);
        const matchesMatricule = st.matricule.toLowerCase().includes(q);
        const matchesParent = st.parentName.toLowerCase().includes(q);
        if (!matchesName && !matchesMatricule && !matchesParent) return false;
      }
      return true;
    });
  }

  public getStudentById(schoolId: string, studentId: string): Student | undefined {
    return this.data.students.find((st) => st.schoolId === schoolId && st.id === studentId);
  }

  public addStudent(studentData: Omit<Student, 'id' | 'matricule'>): Student {
    const school = this.getSchoolById(studentData.schoolId);
    const existingSchoolStudents = this.data.students.filter((st) => st.schoolId === studentData.schoolId);
    const nextNum = existingSchoolStudents.length + 1;
    const yearSuffix = '2025';
    const code = school?.code.split('-')[0] || 'STU';
    const matricule = `${code}-${yearSuffix}-${String(nextNum).padStart(3, '0')}`;

    // Prevent duplicate matricule
    const dup = this.data.students.some((s) => s.schoolId === studentData.schoolId && s.matricule === matricule);
    const finalMatricule = dup ? `${matricule}-${Math.floor(Math.random() * 90 + 10)}` : matricule;

    const newStudent: Student = {
      ...studentData,
      id: `stu-${studentData.schoolId}-${Date.now()}`,
      matricule: finalMatricule
    };

    this.data.students.push(newStudent);
    this.addAuditLog(studentData.schoolId, 'INSCRIPTION_ELEVE', `Inscription élève ${newStudent.firstName} ${newStudent.lastName} (${finalMatricule})`);
    this.saveData(this.data);
    return newStudent;
  }

  public updateStudent(studentId: string, schoolId: string, updates: Partial<Student>): Student {
    const idx = this.data.students.findIndex((st) => st.id === studentId && st.schoolId === schoolId);
    if (idx === -1) throw new Error('Élève non trouvé dans cet établissement');
    this.data.students[idx] = { ...this.data.students[idx], ...updates };
    this.saveData(this.data);
    return this.data.students[idx];
  }

  // --- Fee Structures & Payments (Isolated by schoolId) ---
  public getFeeStructures(schoolId: string): FeeStructure[] {
    return this.data.feeStructures.filter((f) => f.schoolId === schoolId);
  }

  public getFeeStructureForClass(schoolId: string, classId: string): FeeStructure | undefined {
    return this.data.feeStructures.find((f) => f.schoolId === schoolId && f.classId === classId);
  }

  public saveFeeStructure(fee: Omit<FeeStructure, 'id'> & { id?: string }): FeeStructure {
    if (fee.id) {
      const idx = this.data.feeStructures.findIndex((f) => f.id === fee.id && f.schoolId === fee.schoolId);
      if (idx !== -1) {
        this.data.feeStructures[idx] = { ...this.data.feeStructures[idx], ...fee } as FeeStructure;
        this.saveData(this.data);
        return this.data.feeStructures[idx];
      }
    }
    const newFee: FeeStructure = {
      ...fee,
      id: `fee-${fee.schoolId}-${Date.now()}`
    };
    this.data.feeStructures.push(newFee);
    this.saveData(this.data);
    return newFee;
  }

  public getPayments(schoolId: string, studentId?: string): Payment[] {
    return this.data.payments.filter((p) => {
      if (p.schoolId !== schoolId) return false;
      if (studentId && p.studentId !== studentId) return false;
      return true;
    });
  }

  public recordPayment(paymentData: Omit<Payment, 'id' | 'receiptNumber' | 'status'> & { receiptNumber?: string }): Payment {
    const school = this.getSchoolById(paymentData.schoolId);
    const existingSchoolPayments = this.data.payments.filter((p) => p.schoolId === paymentData.schoolId);
    const nextReceiptNum = existingSchoolPayments.length + 1;
    const code = school?.code.split('-')[0] || 'REC';
    const autoReceipt = `REC-${code}-25-${String(nextReceiptNum).padStart(4, '0')}`;

    // Prevent duplicate references
    if (paymentData.reference) {
      const existingRef = this.data.payments.some(
        (p) => p.schoolId === paymentData.schoolId && p.reference === paymentData.reference && p.status === 'VALIDE'
      );
      if (existingRef) {
        throw new Error(`Une transaction valide avec la référence "${paymentData.reference}" existe déjà dans cet établissement.`);
      }
    }

    const newPayment: Payment = {
      ...paymentData,
      id: `pay-${paymentData.schoolId}-${Date.now()}`,
      receiptNumber: paymentData.receiptNumber || autoReceipt,
      currency: 'XOF',
      status: 'VALIDE'
    };

    this.data.payments.push(newPayment);

    // Update student status based on balance
    this.refreshStudentPaymentStatus(paymentData.schoolId, paymentData.studentId);

    this.addAuditLog(
      paymentData.schoolId,
      'ENCAISSEMENT_PAIEMENT',
      `Reçu ${newPayment.receiptNumber} émis: ${newPayment.amount} FCFA (${paymentData.feeCategory}) par ${paymentData.recordedByName}`
    );

    this.saveData(this.data);
    return newPayment;
  }

  public cancelPayment(schoolId: string, paymentId: string, reason: string, cancelledByName: string): Payment {
    const idx = this.data.payments.findIndex((p) => p.id === paymentId && p.schoolId === schoolId);
    if (idx === -1) throw new Error('Paiement non trouvé');
    const payment = this.data.payments[idx];
    if (payment.status === 'ANNULE') throw new Error('Ce paiement est déjà annulé');

    payment.status = 'ANNULE';
    payment.cancellationReason = reason;
    payment.cancelledAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
    payment.cancelledByName = cancelledByName;

    this.refreshStudentPaymentStatus(schoolId, payment.studentId);
    this.addAuditLog(schoolId, 'ANNULATION_PAIEMENT', `Annulation reçu ${payment.receiptNumber} (${payment.amount} FCFA). Motif: ${reason}`);
    this.saveData(this.data);
    return payment;
  }

  public refreshStudentPaymentStatus(schoolId: string, studentId: string) {
    const student = this.data.students.find((s) => s.id === studentId && s.schoolId === schoolId);
    if (!student) return;
    const fee = this.getFeeStructureForClass(schoolId, student.classId);
    if (!fee) return;

    const validPayments = this.data.payments.filter((p) => p.schoolId === schoolId && p.studentId === studentId && p.status === 'VALIDE');
    const totalPaid = validPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalExpected = (fee.registrationFee || 0) + (fee.tuitionFee || 0);

    if (totalPaid >= totalExpected) {
      student.status = 'EN_REGLE';
    } else if (totalPaid > 0) {
      student.status = 'EN_RETARD';
    } else {
      student.status = 'INSCRIT';
    }
  }

  public getStudentFinancialSummary(schoolId: string, studentId: string) {
    const student = this.getStudentById(schoolId, studentId);
    const fee = student ? this.getFeeStructureForClass(schoolId, student.classId) : undefined;
    const payments = this.getPayments(schoolId, studentId);
    const validPayments = payments.filter((p) => p.status === 'VALIDE');

    const totalRegistration = fee?.registrationFee || 0;
    const totalTuition = fee?.tuitionFee || 0;
    const totalAnnexes = (fee?.canteenFee || 0) + (fee?.uniformFee || 0) + (fee?.transportFee || 0);
    const totalDue = totalRegistration + totalTuition + totalAnnexes;

    const totalPaid = validPayments.reduce((acc, p) => acc + p.amount, 0);
    const balance = totalDue - totalPaid;

    return {
      feeStructure: fee,
      totalDue,
      totalPaid,
      balance,
      isFullyPaid: balance <= 0,
      payments
    };
  }

  // --- Assessments & Grades (Isolated by schoolId) ---
  public getAssessments(schoolId: string, classId?: string, term?: string): Assessment[] {
    return this.data.assessments.filter((a) => {
      if (a.schoolId !== schoolId) return false;
      if (classId && a.classId !== classId) return false;
      if (term && a.term !== term) return false;
      return true;
    });
  }

  public createAssessment(assessment: Omit<Assessment, 'id'>): Assessment {
    const newAsm: Assessment = {
      ...assessment,
      id: `asm-${assessment.schoolId}-${Date.now()}`
    };
    this.data.assessments.push(newAsm);
    this.saveData(this.data);
    return newAsm;
  }

  public getGrades(schoolId: string, assessmentId?: string): Grade[] {
    return this.data.grades.filter((g) => {
      if (g.schoolId !== schoolId) return false;
      if (assessmentId && g.assessmentId !== assessmentId) return false;
      return true;
    });
  }

  public saveGrade(gradeInput: Omit<Grade, 'id'>): Grade {
    const existingIdx = this.data.grades.findIndex(
      (g) => g.schoolId === gradeInput.schoolId && g.assessmentId === gradeInput.assessmentId && g.studentId === gradeInput.studentId
    );
    if (existingIdx !== -1) {
      this.data.grades[existingIdx].score = gradeInput.score;
      this.data.grades[existingIdx].remarks = gradeInput.remarks;
      this.saveData(this.data);
      return this.data.grades[existingIdx];
    }
    const newGrade: Grade = {
      ...gradeInput,
      id: `grd-${gradeInput.schoolId}-${Date.now()}`
    };
    this.data.grades.push(newGrade);
    this.saveData(this.data);
    return newGrade;
  }

  // --- Attendance (Isolated by schoolId) ---
  public getAttendance(schoolId: string, classId?: string, date?: string): AttendanceRecord[] {
    return this.data.attendance.filter((att) => {
      if (att.schoolId !== schoolId) return false;
      if (classId && att.classId !== classId) return false;
      if (date && att.date !== date) return false;
      return true;
    });
  }

  public recordAttendance(record: Omit<AttendanceRecord, 'id'>): AttendanceRecord {
    // Prevent duplicate attendance entries for same student, date and session
    const existingIdx = this.data.attendance.findIndex(
      (a) => a.schoolId === record.schoolId && a.studentId === record.studentId && a.date === record.date && a.session === record.session
    );
    if (existingIdx !== -1) {
      this.data.attendance[existingIdx] = {
        ...this.data.attendance[existingIdx],
        ...record
      };
      this.saveData(this.data);
      return this.data.attendance[existingIdx];
    }
    const newRecord: AttendanceRecord = {
      ...record,
      id: `att-${record.schoolId}-${Date.now()}`
    };
    this.data.attendance.push(newRecord);
    this.saveData(this.data);
    return newRecord;
  }

  // --- Timetables (Isolated by schoolId) ---
  public getTimetableSlots(schoolId: string, classId?: string, teacherId?: string): TimetableSlot[] {
    return this.data.timetables.filter((t) => {
      if (t.schoolId !== schoolId) return false;
      if (classId && t.classId !== classId) return false;
      if (teacherId && t.teacherId !== teacherId) return false;
      return true;
    });
  }

  public checkTimetableConflict(slot: Omit<TimetableSlot, 'id'>, excludeId?: string): { hasConflict: boolean; reason?: string } {
    const conflicts = this.data.timetables.filter((t) => {
      if (t.schoolId !== slot.schoolId) return false;
      if (excludeId && t.id === excludeId) return false;
      if (t.dayOfWeek !== slot.dayOfWeek) return false;

      // Time overlap check: start1 < end2 and start2 < end1
      const overlap = slot.startTime < t.endTime && t.startTime < slot.endTime;
      if (!overlap) return false;

      // Check teacher conflict
      if (t.teacherId === slot.teacherId) return true;
      // Check room conflict
      if (t.room.toLowerCase() === slot.room.toLowerCase()) return true;
      // Check class conflict
      if (t.classId === slot.classId) return true;

      return false;
    });

    if (conflicts.length > 0) {
      const c = conflicts[0];
      if (c.teacherId === slot.teacherId) {
        return { hasConflict: true, reason: "Cet enseignant a déjà un cours programmé sur ce créneau horaire." };
      }
      if (c.room.toLowerCase() === slot.room.toLowerCase()) {
        return { hasConflict: true, reason: `La salle "${slot.room}" est déjà occupée sur ce créneau horaire.` };
      }
      if (c.classId === slot.classId) {
        return { hasConflict: true, reason: "Cette classe a déjà un cours prévu à cette heure." };
      }
    }
    return { hasConflict: false };
  }

  public addTimetableSlot(slot: Omit<TimetableSlot, 'id'>): TimetableSlot {
    const conflictCheck = this.checkTimetableConflict(slot);
    if (conflictCheck.hasConflict) {
      throw new Error(conflictCheck.reason);
    }
    const newSlot: TimetableSlot = {
      ...slot,
      id: `tt-${slot.schoolId}-${Date.now()}`
    };
    this.data.timetables.push(newSlot);
    this.saveData(this.data);
    return newSlot;
  }

  public deleteTimetableSlot(schoolId: string, slotId: string) {
    this.data.timetables = this.data.timetables.filter((t) => !(t.id === slotId && t.schoolId === schoolId));
    this.saveData(this.data);
  }

  // --- Announcements (Isolated by schoolId) ---
  public getAnnouncements(schoolId: string, userRole?: UserRole): Announcement[] {
    return this.data.announcements.filter((a) => {
      if (a.schoolId !== schoolId) return false;
      if (!userRole) return true;
      if (a.targetRole === 'TOUS') return true;
      if (userRole === 'PARENT' && a.targetRole === 'PARENTS') return true;
      if (userRole === 'TEACHER' && a.targetRole === 'ENSEIGNANTS') return true;
      if (['DIRECTOR', 'ADMIN', 'ACCOUNTANT', 'SECRETARY', 'SUPERVISOR'].includes(userRole) && a.targetRole === 'PERSONNEL') return true;
      return true;
    });
  }

  public addAnnouncement(announcement: Omit<Announcement, 'id'>): Announcement {
    const newAnn: Announcement = {
      ...announcement,
      id: `ann-${announcement.schoolId}-${Date.now()}`
    };
    this.data.announcements.unshift(newAnn);
    this.saveData(this.data);
    return newAnn;
  }

  // --- Audit Logs ---
  public getAuditLogs(schoolId?: string | null): AuditLog[] {
    if (!schoolId) return this.data.auditLogs;
    return this.data.auditLogs.filter((l) => l.schoolId === schoolId);
  }

  public addAuditLog(schoolId: string | null, action: string, details: string, userId = 'system', userName = 'Système') {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      schoolId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId,
      userName,
      action,
      details
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 200);
    }
    this.saveData(this.data);
  }

  // --- SaaS Subscriptions (Super Admin) ---
  public updateSchoolSubscription(schoolId: string, planId: string, status: School['subscriptionStatus'], renewsAt?: string) {
    const school = this.data.schools.find((s) => s.id === schoolId);
    if (!school) throw new Error('Établissement non trouvé');
    school.subscriptionPlanId = planId;
    school.subscriptionStatus = status;
    if (renewsAt) school.subscriptionRenewsAt = renewsAt;
    this.saveData(this.data);
    return school;
  }

  // --- Support Tickets & Customer Care ---
  public getSupportTickets(options?: {
    userId?: string | null;
    schoolId?: string | null;
    userEmail?: string;
    isSuperAdmin?: boolean;
    category?: string;
    status?: string;
    search?: string;
  }): SupportTicket[] {
    let tickets = this.data.supportTickets || [];

    // Security & Data Isolation:
    // If not super admin, users can only view tickets they filed (by userId, userEmail, or their authorized school)
    if (!options?.isSuperAdmin) {
      tickets = tickets.filter((t) => {
        if (options?.userId && t.userId === options.userId) return true;
        if (options?.userEmail && t.email.toLowerCase() === options.userEmail.toLowerCase()) return true;
        if (options?.schoolId && t.schoolId === options.schoolId) return true;
        return false;
      });
    }

    if (options?.category && options.category !== 'ALL') {
      tickets = tickets.filter((t) => t.category === options.category);
    }
    if (options?.status && options.status !== 'ALL') {
      tickets = tickets.filter((t) => t.status === options.status);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      tickets = tickets.filter(
        (t) =>
          t.ticketNumber.toLowerCase().includes(q) ||
          t.fullName.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.schoolName && t.schoolName.toLowerCase().includes(q))
      );
    }

    return [...tickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getSupportTicketById(ticketId: string): SupportTicket | undefined {
    return (this.data.supportTickets || []).find((t) => t.id === ticketId);
  }

  public createSupportTicket(input: {
    fullName: string;
    schoolName?: string;
    email: string;
    whatsappNumber?: string;
    category: SupportCategory;
    description: string;
    userId?: string | null;
    schoolId?: string | null;
  }): SupportTicket {
    const ticketId = `tick-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const ticketNumber = `TICK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket: SupportTicket = {
      id: ticketId,
      ticketNumber,
      userId: input.userId || null,
      schoolId: input.schoolId || null,
      fullName: input.fullName.trim(),
      schoolName: input.schoolName?.trim() || undefined,
      email: input.email.trim(),
      whatsappNumber: input.whatsappNumber?.trim() || undefined,
      category: input.category,
      description: input.description.trim(),
      status: 'NOUVEAU',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      internalNotes: []
    };

    if (!this.data.supportTickets) {
      this.data.supportTickets = [];
    }
    this.data.supportTickets.unshift(newTicket);

    this.addAuditLog(
      input.schoolId || null,
      'SUPPORT_TICKET_SOUMIS',
      `Nouveau ticket d'assistance ${ticketNumber} (${input.category}) soumis par ${input.fullName} (${input.email})`,
      input.userId || 'visiteur',
      input.fullName
    );

    this.saveData(this.data);
    return newTicket;
  }

  public updateSupportTicketStatus(ticketId: string, status: SupportStatus, adminUser?: { id: string; name: string }): SupportTicket {
    const ticket = (this.data.supportTickets || []).find((t) => t.id === ticketId);
    if (!ticket) throw new Error("Ticket d'assistance non trouvé");

    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();

    this.addAuditLog(
      ticket.schoolId || null,
      'SUPPORT_TICKET_STATUT',
      `Ticket ${ticket.ticketNumber} passé au statut ${status} par ${adminUser?.name || 'Support Eben Keys'}`,
      adminUser?.id || 'eben-keys-admin',
      adminUser?.name || 'Eben Keys'
    );

    this.saveData(this.data);
    return ticket;
  }

  public addSupportTicketInternalNote(ticketId: string, noteContent: string, authorName: string): SupportTicket {
    const ticket = (this.data.supportTickets || []).find((t) => t.id === ticketId);
    if (!ticket) throw new Error("Ticket d'assistance non trouvé");

    if (!ticket.internalNotes) {
      ticket.internalNotes = [];
    }

    const note: SupportInternalNote = {
      id: `note-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      authorName: authorName || 'Eben Keys (Support)',
      content: noteContent.trim(),
      createdAt: new Date().toISOString()
    };

    ticket.internalNotes.push(note);
    ticket.updatedAt = new Date().toISOString();

    this.saveData(this.data);
    return ticket;
  }
}

export const dataService = new DataService();
