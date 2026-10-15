export interface CatalogSubject {
  code: string;
  nameFr: string;
  nameEn: string;
  category: 'SCIENCES' | 'LANGUES' | 'HUMANITES' | 'TECHNIQUE' | 'ARTS_SPORT' | 'COMMERCE';
  defaultCoefficient: number;
  level: 'Primaire' | 'Collège' | 'Lycée' | 'Tous';
}

export const MASTER_SUBJECT_CATALOG: CatalogSubject[] = [
  // Sciences & Mathematics
  { code: 'MATH', nameFr: 'Mathématiques', nameEn: 'Mathematics', category: 'SCIENCES', defaultCoefficient: 4, level: 'Tous' },
  { code: 'GEOM', nameFr: 'Géométrie', nameEn: 'Geometry', category: 'SCIENCES', defaultCoefficient: 2, level: 'Collège' },
  { code: 'SVT', nameFr: 'Sciences de la Vie et de la Terre (SVT)', nameEn: 'Life and Earth Sciences', category: 'SCIENCES', defaultCoefficient: 3, level: 'Collège' },
  { code: 'BIO', nameFr: 'Biologie', nameEn: 'Biology', category: 'SCIENCES', defaultCoefficient: 3, level: 'Lycée' },
  { code: 'PHYS', nameFr: 'Physique', nameEn: 'Physics', category: 'SCIENCES', defaultCoefficient: 3, level: 'Lycée' },
  { code: 'CHIM', nameFr: 'Chimie', nameEn: 'Chemistry', category: 'SCIENCES', defaultCoefficient: 3, level: 'Lycée' },
  { code: 'PCT', nameFr: 'Physique, Chimie & Technologie (PCT)', nameEn: 'Physics, Chemistry & Technology', category: 'SCIENCES', defaultCoefficient: 3, level: 'Collège' },

  // Languages & Literacy
  { code: 'FRAN', nameFr: 'Français', nameEn: 'French', category: 'LANGUES', defaultCoefficient: 4, level: 'Tous' },
  { code: 'ANGL', nameFr: 'Anglais', nameEn: 'English', category: 'LANGUES', defaultCoefficient: 3, level: 'Tous' },
  { code: 'ESP', nameFr: 'Espagnol', nameEn: 'Spanish', category: 'LANGUES', defaultCoefficient: 2, level: 'Collège' },
  { code: 'ALL', nameFr: 'Allemand', nameEn: 'German', category: 'LANGUES', defaultCoefficient: 2, level: 'Collège' },
  { code: 'ARAB', nameFr: 'Arabe', nameEn: 'Arabic', category: 'LANGUES', defaultCoefficient: 2, level: 'Collège' },
  { code: 'LECT', nameFr: 'Lecture', nameEn: 'Reading', category: 'LANGUES', defaultCoefficient: 2, level: 'Primaire' },
  { code: 'ECRI', nameFr: 'Écriture', nameEn: 'Writing', category: 'LANGUES', defaultCoefficient: 2, level: 'Primaire' },
  { code: 'EXPR', nameFr: 'Expression Orale', nameEn: 'Oral Expression', category: 'LANGUES', defaultCoefficient: 2, level: 'Primaire' },

  // Humanities & Citizenship
  { code: 'HIST', nameFr: 'Histoire', nameEn: 'History', category: 'HUMANITES', defaultCoefficient: 2, level: 'Tous' },
  { code: 'GEOG', nameFr: 'Géographie', nameEn: 'Geography', category: 'HUMANITES', defaultCoefficient: 2, level: 'Tous' },
  { code: 'HG', nameFr: 'Histoire-Géographie', nameEn: 'History & Geography', category: 'HUMANITES', defaultCoefficient: 2, level: 'Collège' },
  { code: 'CIVIC', nameFr: 'Éducation Civique', nameEn: 'Civic Education', category: 'HUMANITES', defaultCoefficient: 1, level: 'Tous' },
  { code: 'MORAL', nameFr: 'Éducation Morale', nameEn: 'Moral Education', category: 'HUMANITES', defaultCoefficient: 1, level: 'Primaire' },
  { code: 'PHIL', nameFr: 'Philosophie', nameEn: 'Philosophy', category: 'HUMANITES', defaultCoefficient: 4, level: 'Lycée' },

  // Digital & Technology
  { code: 'INFO', nameFr: 'Informatique', nameEn: 'Computer Science', category: 'TECHNIQUE', defaultCoefficient: 2, level: 'Tous' },
  { code: 'LITNUM', nameFr: 'Littératie Numérique', nameEn: 'Digital Literacy', category: 'TECHNIQUE', defaultCoefficient: 2, level: 'Collège' },
  { code: 'GENELEC', nameFr: 'Génie Électrique', nameEn: 'Electrical Engineering', category: 'TECHNIQUE', defaultCoefficient: 3, level: 'Lycée' },
  { code: 'GENMEC', nameFr: 'Génie Mécanique', nameEn: 'Mechanical Engineering', category: 'TECHNIQUE', defaultCoefficient: 3, level: 'Lycée' },
  { code: 'ELEC', nameFr: 'Électronique', nameEn: 'Electronics', category: 'TECHNIQUE', defaultCoefficient: 3, level: 'Lycée' },
  { code: 'TECH', nameFr: 'Enseignement Technique', nameEn: 'Technical Education', category: 'TECHNIQUE', defaultCoefficient: 3, level: 'Collège' },

  // Economics & Management
  { code: 'ECON', nameFr: 'Économie', nameEn: 'Economics', category: 'COMMERCE', defaultCoefficient: 3, level: 'Lycée' },
  { code: 'COMPT', nameFr: 'Comptabilité', nameEn: 'Accounting', category: 'COMMERCE', defaultCoefficient: 3, level: 'Lycée' },
  { code: 'GEST', nameFr: 'Gestion', nameEn: 'Management', category: 'COMMERCE', defaultCoefficient: 3, level: 'Lycée' },
  { code: 'AGRI', nameFr: 'Agriculture', nameEn: 'Agriculture', category: 'TECHNIQUE', defaultCoefficient: 2, level: 'Tous' },

  // Arts & Sports
  { code: 'MUSIQ', nameFr: 'Musique', nameEn: 'Music', category: 'ARTS_SPORT', defaultCoefficient: 1, level: 'Tous' },
  { code: 'ARTS', nameFr: 'Arts Plastiques', nameEn: 'Visual Arts', category: 'ARTS_SPORT', defaultCoefficient: 1, level: 'Tous' },
  { code: 'EPS', nameFr: 'Éducation Physique & Sportive (EPS)', nameEn: 'Physical Education (PE)', category: 'ARTS_SPORT', defaultCoefficient: 1, level: 'Tous' }
];
