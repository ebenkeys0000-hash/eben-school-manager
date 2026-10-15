export type UserRole =
  | 'SUPER_ADMIN'
  | 'DIRECTOR'
  | 'ADMIN'
  | 'ACCOUNTANT'
  | 'TEACHER'
  | 'SECRETARY'
  | 'SUPERVISOR'
  | 'PARENT';

export interface School {
  id: string;
  name: string;
  code: string; // e.g. "CSLR-COT"
  type: 'MATERNELLE_PRIMAIRE' | 'COLLEGE_LYCEE' | 'COMPLEXE_SCOLAIRE' | 'TECHNIQUE';
  logo?: string;
  address: string;
  city: string;
  country: string;
  countryCode?: string; // ISO 2-letter e.g. "BJ", "TG", "CI", "GH", "NG"
  phone: string;
  email: string;
  registrationNumber: string; // Agrément ministériel
  directorName: string;
  currency: string; // default "XOF"
  currencySymbol?: string; // "FCFA", "GH₵", "₦", "KSh", etc.
  defaultLanguage?: 'fr' | 'en';
  educationSystem?: string;
  gradingScale?: '/20' | '/100%' | 'A-F' | '1-9';
  academicPeriodType?: 'TRIMESTRE' | 'SEMESTRE' | 'TERM';
  currentAcademicYear: string; // "2025-2026"
  subscriptionPlanId: string;
  subscriptionStatus: 'ACTIF' | 'ESSAI' | 'SUSPENDU' | 'EXPIRE';
  subscriptionRenewsAt: string;
  createdAt: string;
}

export interface User {
  id: string;
  schoolId: string | null; // null for SUPER_ADMIN
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  assignedClassIds?: string[]; // for teachers
  assignedSubjectIds?: string[]; // for teachers
  childrenStudentIds?: string[]; // for parents
  createdAt: string;
}

export interface AcademicYear {
  id: string;
  schoolId: string;
  name: string; // e.g. "2025-2026"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export type EducationLevel = 'Primaire' | 'Collège' | 'Lycée' | 'Primary' | 'Secondary' | 'Nursery';

export interface ClassRoom {
  id: string;
  schoolId: string;
  name: string; // e.g. "6ème A", "Terminale D", "Grade 7"
  level: EducationLevel;
  academicYearId: string;
  mainTeacherId?: string;
  capacity: number;
  roomNumber?: string;
}

export interface Subject {
  id: string;
  schoolId: string;
  name: string; // e.g. "Mathématiques", "Français", "SVT"
  nameEn?: string; // e.g. "Mathematics", "French", "Biology"
  code: string; // e.g. "MATH", "FRAN"
  defaultCoefficient: number;
  level: EducationLevel | 'Tous';
  isActive?: boolean;
  category?: 'SCIENCES' | 'LANGUES' | 'HUMANITES' | 'TECHNIQUE' | 'ARTS_SPORT' | 'COMMERCE';
}

export interface Student {
  id: string;
  schoolId: string;
  matricule: string; // unique per school, e.g. "CSLR-2025-001"
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  dateOfBirth: string;
  placeOfBirth: string;
  classId: string;
  academicYearId: string;
  enrollmentDate: string;
  status: 'INSCRIT' | 'EN_REGLE' | 'EN_RETARD' | 'ARCHIVE';
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  parentAddress?: string;
  photoUrl?: string;
  documents?: { name: string; url: string; date: string }[];
}

export interface FeeStructure {
  id: string;
  schoolId: string;
  classId: string;
  academicYearId: string;
  registrationFee: number; // Frais d'inscription
  tuitionFee: number;      // Scolarité totale
  installment1: number;    // 1ère tranche (rentrée)
  installment2: number;    // 2ème tranche (décembre)
  installment3: number;    // 3ème tranche (février)
  canteenFee?: number;     // Optionnel
  transportFee?: number;   // Optionnel
  uniformFee?: number;     // Tenue scolaire
}

export type PaymentMethod =
  | 'ESPECES'
  | 'VIREMENT'
  | 'CHEQUE'
  | 'MTN_MOMO'
  | 'MOOV_MONEY'
  | 'CELTIIS_CASH';

export type FeeCategory =
  | 'INSCRIPTION'
  | 'TRANCHE_1'
  | 'TRANCHE_2'
  | 'TRANCHE_3'
  | 'FRAIS_ANNEXES'
  | 'AUTRE';

export interface Payment {
  id: string;
  schoolId: string;
  studentId: string;
  receiptNumber: string; // e.g. "REC-CSLR-2025-0042"
  amount: number;
  currency: string; // "XOF"
  date: string;
  method: PaymentMethod;
  reference: string; // Transaction reference or receipt ref
  feeCategory: FeeCategory;
  payerName: string;
  recordedByUserId: string;
  recordedByName: string;
  status: 'VALIDE' | 'ANNULE';
  notes?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  cancelledByName?: string;
}

export type TermPeriod = 'TRIMESTRE_1' | 'TRIMESTRE_2' | 'TRIMESTRE_3';

export interface Assessment {
  id: string;
  schoolId: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  academicYearId: string;
  term: TermPeriod;
  title: string; // e.g. "Devoir Surveillé N°1"
  type: 'INTERRO' | 'DEVOIR_1' | 'DEVOIR_2' | 'COMPOSITION';
  maxScore: number; // 20
  coefficient: number;
  date: string;
}

export interface Grade {
  id: string;
  schoolId: string;
  assessmentId: string;
  studentId: string;
  score: number; // out of 20
  remarks?: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'RETARD' | 'EXCUSE';

export interface AttendanceRecord {
  id: string;
  schoolId: string;
  classId: string;
  studentId: string;
  date: string;
  session: 'MATIN' | 'APRES_MIDI';
  status: AttendanceStatus;
  recordedBy: string;
  reason?: string;
}

export interface TimetableSlot {
  id: string;
  schoolId: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: number; // 1 = Lundi, 2 = Mardi, 3 = Mercredi, 4 = Jeudi, 5 = Vendredi, 6 = Samedi
  startTime: string; // "07:30"
  endTime: string;   // "09:30"
  room: string;
}

export interface Announcement {
  id: string;
  schoolId: string;
  title: string;
  content: string;
  targetRole: 'TOUS' | 'PARENTS' | 'ENSEIGNANTS' | 'PERSONNEL';
  date: string;
  authorName: string;
  priority: 'NORMALE' | 'URGENTE';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tagline: string;
  priceMonthlyXOF: number;
  priceYearlyXOF: number;
  maxStudents: number;
  features: string[];
  popular?: boolean;
}

export interface AuditLog {
  id: string;
  schoolId: string | null;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
}

export type SupportCategory =
  | 'CONNEXION_COMPTE'
  | 'INSCRIPTION_ECOLE'
  | 'GESTION_ELEVES'
  | 'SCOLARITE_PAIEMENTS'
  | 'NOTES_BULLETINS'
  | 'ABONNEMENT'
  | 'PROBLEME_TECHNIQUE'
  | 'AUTRE';

export type SupportStatus = 'NOUVEAU' | 'EN_COURS' | 'RESOLU';

export interface SupportInternalNote {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string; // e.g. "TICK-2026-0042"
  userId?: string | null;
  schoolId?: string | null;
  fullName: string;
  schoolName?: string;
  email: string;
  whatsappNumber?: string;
  category: SupportCategory;
  description: string;
  status: SupportStatus;
  createdAt: string;
  updatedAt?: string;
  internalNotes?: SupportInternalNote[];
}
