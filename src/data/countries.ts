export interface CountryEducationConfig {
  code: string; // ISO 2-letter
  nameFr: string;
  nameEn: string;
  currency: string;
  currencySymbol: string;
  defaultLanguage: 'fr' | 'en';
  educationSystemName: string;
  educationSystemNameEn: string;
  academicPeriods: 'TRIMESTRE' | 'SEMESTRE' | 'TERM';
  periodNamesFr: string[];
  periodNamesEn: string[];
  gradingScale: '/20' | '/100%' | 'A-F' | '1-9';
  gradingScaleLabel: string;
  phonePrefix: string;
  defaultCycles: {
    level: 'Primaire' | 'Collège' | 'Lycée' | 'Nursery' | 'Primary' | 'Secondary';
    classes: string[];
  }[];
}

export const COUNTRIES_CONFIG: Record<string, CountryEducationConfig> = {
  Benin: {
    code: 'BJ',
    nameFr: 'Bénin',
    nameEn: 'Benin',
    currency: 'XOF',
    currencySymbol: 'FCFA',
    defaultLanguage: 'fr',
    educationSystemName: 'Système National Béninois (MESTFP / MEMP)',
    educationSystemNameEn: 'Benin National Curriculum (MESTFP / MEMP)',
    academicPeriods: 'TRIMESTRE',
    periodNamesFr: ['1er Trimestre', '2ème Trimestre', '3ème Trimestre'],
    periodNamesEn: ['1st Term', '2nd Term', '3rd Term'],
    gradingScale: '/20',
    gradingScaleLabel: 'Barème standard sur 20',
    phonePrefix: '+229',
    defaultCycles: [
      {
        level: 'Primaire',
        classes: ['CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2']
      },
      {
        level: 'Collège',
        classes: ['6ème A', '6ème B', '5ème A', '5ème B', '4ème A', '4ème B', '3ème A', '3ème B']
      },
      {
        level: 'Lycée',
        classes: ['Seconde AB', 'Seconde CD', 'Première A', 'Première D', 'Terminale A', 'Terminale C', 'Terminale D']
      }
    ]
  },
  Togo: {
    code: 'TG',
    nameFr: 'Togo',
    nameEn: 'Togo',
    currency: 'XOF',
    currencySymbol: 'FCFA',
    defaultLanguage: 'fr',
    educationSystemName: 'Système National Togolais (MEPSTA)',
    educationSystemNameEn: 'Togo National Curriculum (MEPSTA)',
    academicPeriods: 'TRIMESTRE',
    periodNamesFr: ['1er Trimestre', '2ème Trimestre', '3ème Trimestre'],
    periodNamesEn: ['1st Term', '2nd Term', '3rd Term'],
    gradingScale: '/20',
    gradingScaleLabel: 'Barème standard sur 20',
    phonePrefix: '+228',
    defaultCycles: [
      {
        level: 'Primaire',
        classes: ['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2']
      },
      {
        level: 'Collège',
        classes: ['6ème', '5ème', '4ème', '3ème']
      },
      {
        level: 'Lycée',
        classes: ['Seconde A4', 'Seconde S', 'Première A4', 'Première D', 'Terminale A4', 'Terminale D', 'Terminale C']
      }
    ]
  },
  'Ivory Coast': {
    code: 'CI',
    nameFr: "Côte d'Ivoire",
    nameEn: 'Ivory Coast',
    currency: 'XOF',
    currencySymbol: 'FCFA',
    defaultLanguage: 'fr',
    educationSystemName: 'Système National Ivoirien (MENA)',
    educationSystemNameEn: 'Ivorian National Curriculum (MENA)',
    academicPeriods: 'TRIMESTRE',
    periodNamesFr: ['1er Trimestre', '2ème Trimestre', '3ème Trimestre'],
    periodNamesEn: ['1st Term', '2nd Term', '3rd Term'],
    gradingScale: '/20',
    gradingScaleLabel: 'Barème standard sur 20',
    phonePrefix: '+225',
    defaultCycles: [
      {
        level: 'Primaire',
        classes: ['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2']
      },
      {
        level: 'Collège',
        classes: ['6ème 1', '5ème 1', '4ème 1', '3ème 1']
      },
      {
        level: 'Lycée',
        classes: ['2nde A', '2nde C', '1ère A', '1ère D', 'Tle A', 'Tle D', 'Tle C']
      }
    ]
  },
  Senegal: {
    code: 'SN',
    nameFr: 'Sénégal',
    nameEn: 'Senegal',
    currency: 'XOF',
    currencySymbol: 'FCFA',
    defaultLanguage: 'fr',
    educationSystemName: 'Système Éducatif Sénégalais (MEN)',
    educationSystemNameEn: 'Senegalese National Curriculum (MEN)',
    academicPeriods: 'SEMESTRE',
    periodNamesFr: ['1er Semestre', '2ème Semestre'],
    periodNamesEn: ['1st Semester', '2nd Semester'],
    gradingScale: '/20',
    gradingScaleLabel: 'Barème standard sur 20',
    phonePrefix: '+221',
    defaultCycles: [
      {
        level: 'Primaire',
        classes: ['CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2']
      },
      {
        level: 'Collège',
        classes: ['6ème', '5ème', '4ème', '3ème']
      },
      {
        level: 'Lycée',
        classes: ['Seconde L', 'Seconde S', 'Première L', 'Première S', 'Terminale L', 'Terminale S']
      }
    ]
  },
  'Burkina Faso': {
    code: 'BF',
    nameFr: 'Burkina Faso',
    nameEn: 'Burkina Faso',
    currency: 'XOF',
    currencySymbol: 'FCFA',
    defaultLanguage: 'fr',
    educationSystemName: 'Système National Burkinabè (MENAPLN)',
    educationSystemNameEn: 'Burkina Faso National Curriculum (MENAPLN)',
    academicPeriods: 'TRIMESTRE',
    periodNamesFr: ['1er Trimestre', '2ème Trimestre', '3ème Trimestre'],
    periodNamesEn: ['1st Term', '2nd Term', '3rd Term'],
    gradingScale: '/20',
    gradingScaleLabel: 'Barème standard sur 20',
    phonePrefix: '+226',
    defaultCycles: [
      {
        level: 'Primaire',
        classes: ['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2']
      },
      {
        level: 'Collège',
        classes: ['6ème', '5ème', '4ème', '3ème']
      },
      {
        level: 'Lycée',
        classes: ['2nde A', '2nde C', '1ère A', '1ère D', 'Tle A', 'Tle D']
      }
    ]
  },
  Niger: {
    code: 'NE',
    nameFr: 'Niger',
    nameEn: 'Niger',
    currency: 'XOF',
    currencySymbol: 'FCFA',
    defaultLanguage: 'fr',
    educationSystemName: 'Système National Nigérien (MEN)',
    educationSystemNameEn: 'Niger National Curriculum (MEN)',
    academicPeriods: 'TRIMESTRE',
    periodNamesFr: ['1er Trimestre', '2ème Trimestre', '3ème Trimestre'],
    periodNamesEn: ['1st Term', '2nd Term', '3rd Term'],
    gradingScale: '/20',
    gradingScaleLabel: 'Barème standard sur 20',
    phonePrefix: '+227',
    defaultCycles: [
      {
        level: 'Primaire',
        classes: ['CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2']
      },
      {
        level: 'Collège',
        classes: ['6ème', '5ème', '4ème', '3ème']
      },
      {
        level: 'Lycée',
        classes: ['2nde A', '2nde C', '1ère A', '1ère D', 'Tle A', 'Tle D']
      }
    ]
  },
  Mali: {
    code: 'ML',
    nameFr: 'Mali',
    nameEn: 'Mali',
    currency: 'XOF',
    currencySymbol: 'FCFA',
    defaultLanguage: 'fr',
    educationSystemName: 'Système Éducatif Malien (MEN)',
    educationSystemNameEn: 'Malian National Curriculum (MEN)',
    academicPeriods: 'TRIMESTRE',
    periodNamesFr: ['1er Trimestre', '2ème Trimestre', '3ème Trimestre'],
    periodNamesEn: ['1st Term', '2nd Term', '3rd Term'],
    gradingScale: '/20',
    gradingScaleLabel: 'Barème standard sur 20',
    phonePrefix: '+223',
    defaultCycles: [
      {
        level: 'Primaire',
        classes: ['1ère Année', '2ème Année', '3ème Année', '4ème Année', '5ème Année', '6ème Année']
      },
      {
        level: 'Collège',
        classes: ['7ème Année', '8ème Année', '9ème Année']
      },
      {
        level: 'Lycée',
        classes: ['10ème Lettres', '10ème Sciences', '11ème LL', '11ème SE', '12ème LL', '12ème TSE']
      }
    ]
  },
  Ghana: {
    code: 'GH',
    nameFr: 'Ghana',
    nameEn: 'Ghana',
    currency: 'GHS',
    currencySymbol: 'GH₵',
    defaultLanguage: 'en',
    educationSystemName: 'Ghana Standards-Based Curriculum (GES / WAEC)',
    educationSystemNameEn: 'Ghana Standards-Based Curriculum (GES / WAEC)',
    academicPeriods: 'TERM',
    periodNamesFr: ['1er Trimestre', '2ème Trimestre', '3ème Trimestre'],
    periodNamesEn: ['Term 1', 'Term 2', 'Term 3'],
    gradingScale: '1-9',
    gradingScaleLabel: 'Stanine Scale (1-9) & WASSCE Grades (A1-F9)',
    phonePrefix: '+233',
    defaultCycles: [
      {
        level: 'Primary',
        classes: ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5', 'Basic 6']
      },
      {
        level: 'Collège',
        classes: ['JHS 1', 'JHS 2', 'JHS 3']
      },
      {
        level: 'Lycée',
        classes: ['SHS 1 General Arts', 'SHS 1 Science', 'SHS 2 General Arts', 'SHS 2 Science', 'SHS 3']
      }
    ]
  },
  Nigeria: {
    code: 'NG',
    nameFr: 'Nigeria',
    nameEn: 'Nigeria',
    currency: 'NGN',
    currencySymbol: '₦',
    defaultLanguage: 'en',
    educationSystemName: 'Nigerian Universal Basic Education (UBEC / NERDC / WAEC)',
    educationSystemNameEn: 'Nigerian Universal Basic Education (UBEC / NERDC / WAEC)',
    academicPeriods: 'TERM',
    periodNamesFr: ['1er Trimestre', '2ème Trimestre', '3ème Trimestre'],
    periodNamesEn: ['1st Term', '2nd Term', '3rd Term'],
    gradingScale: 'A-F',
    gradingScaleLabel: 'Percentage (0-100%) and Letter Grades (A1-F9)',
    phonePrefix: '+234',
    defaultCycles: [
      {
        level: 'Primary',
        classes: ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6']
      },
      {
        level: 'Collège',
        classes: ['JSS 1', 'JSS 2', 'JSS 3']
      },
      {
        level: 'Lycée',
        classes: ['SSS 1 Arts', 'SSS 1 Science', 'SSS 2', 'SSS 3 WAEC']
      }
    ]
  },
  Guinea: {
    code: 'GN',
    nameFr: 'Guinée',
    nameEn: 'Guinea',
    currency: 'GNF',
    currencySymbol: 'FG',
    defaultLanguage: 'fr',
    educationSystemName: 'Système National Guinéen (MEPU-A)',
    educationSystemNameEn: 'Guinean National Curriculum (MEPU-A)',
    academicPeriods: 'TRIMESTRE',
    periodNamesFr: ['1er Trimestre', '2ème Trimestre', '3ème Trimestre'],
    periodNamesEn: ['1st Term', '2nd Term', '3rd Term'],
    gradingScale: '/20',
    gradingScaleLabel: 'Barème standard sur 20',
    phonePrefix: '+224',
    defaultCycles: [
      {
        level: 'Primaire',
        classes: ['1ère Année', '2ème Année', '3ème Année', '4ème Année', '5ème Année', '6ème Année']
      },
      {
        level: 'Collège',
        classes: ['7ème Année', '8ème Année', '9ème Année', '10ème Année (Brevet)']
      },
      {
        level: 'Lycée',
        classes: ['11ème SS', '11ème SM', '12ème SS', '12ème SM', 'Terminale SS', 'Terminale SM']
      }
    ]
  },
  Gabon: {
    code: 'GA',
    nameFr: 'Gabon',
    nameEn: 'Gabon',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    defaultLanguage: 'fr',
    educationSystemName: 'Système National Gabonais (MEN)',
    educationSystemNameEn: 'Gabonese National Curriculum (MEN)',
    academicPeriods: 'TRIMESTRE',
    periodNamesFr: ['1er Trimestre', '2ème Trimestre', '3ème Trimestre'],
    periodNamesEn: ['1st Term', '2nd Term', '3rd Term'],
    gradingScale: '/20',
    gradingScaleLabel: 'Barème standard sur 20',
    phonePrefix: '+241',
    defaultCycles: [
      {
        level: 'Primaire',
        classes: ['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2']
      },
      {
        level: 'Collège',
        classes: ['6ème', '5ème', '4ème', '3ème']
      },
      {
        level: 'Lycée',
        classes: ['2nde A', '2nde C', '1ère A1', '1ère D', 'Tle A1', 'Tle D', 'Tle C']
      }
    ]
  },
  Cameroon: {
    code: 'CM',
    nameFr: 'Cameroun',
    nameEn: 'Cameroon',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    defaultLanguage: 'fr',
    educationSystemName: 'Système Bilingue Camerounais (MINESEC / MINEDUB)',
    educationSystemNameEn: 'Cameroon Bilingual Education System (MINESEC / MINEDUB)',
    academicPeriods: 'TRIMESTRE',
    periodNamesFr: ['1er Trimestre', '2ème Trimestre', '3ème Trimestre'],
    periodNamesEn: ['1st Term', '2nd Term', '3rd Term'],
    gradingScale: '/20',
    gradingScaleLabel: 'Barème officiel sur 20 et GCE Letter Grades',
    phonePrefix: '+237',
    defaultCycles: [
      {
        level: 'Primaire',
        classes: ['SIL', 'CP', 'CE1', 'CE2', 'CM1', 'CM2', 'Class 1-6']
      },
      {
        level: 'Collège',
        classes: ['6ème', '5ème', '4ème', '3ème', 'Form 1-5']
      },
      {
        level: 'Lycée',
        classes: ['2nde C', '2nde A', 'Première D', 'Première A', 'Terminale D', 'Terminale A', 'Lower/Upper Sixth']
      }
    ]
  },
  'Democratic Republic of the Congo': {
    code: 'CD',
    nameFr: 'République Démocratique du Congo',
    nameEn: 'Democratic Republic of the Congo',
    currency: 'CDF',
    currencySymbol: 'FC',
    defaultLanguage: 'fr',
    educationSystemName: 'Système Éducatif Congolais (EPST)',
    educationSystemNameEn: 'DR Congo Education System (EPST)',
    academicPeriods: 'SEMESTRE',
    periodNamesFr: ['1er Semestre', '2ème Semestre'],
    periodNamesEn: ['1st Semester', '2nd Semester'],
    gradingScale: '/100%',
    gradingScaleLabel: 'Système de cotation sur 100%',
    phonePrefix: '+243',
    defaultCycles: [
      {
        level: 'Primaire',
        classes: ['1ère Primaire', '2ème Primaire', '3ème Primaire', '4ème Primaire', '5ème Primaire', '6ème Primaire']
      },
      {
        level: 'Collège',
        classes: ['7ème Éducation de Base', '8ème Éducation de Base']
      },
      {
        level: 'Lycée',
        classes: ['1ère Humanités', '2ème Humanités', '3ème Humanités', '4ème Humanités (Examen d’État)']
      }
    ]
  },
  Kenya: {
    code: 'KE',
    nameFr: 'Kenya',
    nameEn: 'Kenya',
    currency: 'KES',
    currencySymbol: 'KSh',
    defaultLanguage: 'en',
    educationSystemName: 'Competency-Based Curriculum (CBC / KNEC)',
    educationSystemNameEn: 'Competency-Based Curriculum (CBC / KNEC)',
    academicPeriods: 'TERM',
    periodNamesFr: ['1er Trimestre', '2ème Trimestre', '3ème Trimestre'],
    periodNamesEn: ['Term 1', 'Term 2', 'Term 3'],
    gradingScale: '/100%',
    gradingScaleLabel: 'Performance Level (Exceeding, Meeting, Approaching Expectations) & %',
    phonePrefix: '+254',
    defaultCycles: [
      {
        level: 'Primary',
        classes: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6']
      },
      {
        level: 'Collège',
        classes: ['Junior Secondary Grade 7', 'Junior Secondary Grade 8', 'Junior Secondary Grade 9']
      },
      {
        level: 'Lycée',
        classes: ['Senior Secondary Grade 10', 'Senior Secondary Grade 11', 'Senior Secondary Grade 12']
      }
    ]
  },
  'South Africa': {
    code: 'ZA',
    nameFr: 'Afrique du Sud',
    nameEn: 'South Africa',
    currency: 'ZAR',
    currencySymbol: 'R',
    defaultLanguage: 'en',
    educationSystemName: 'Curriculum and Assessment Policy Statement (CAPS / DBE)',
    educationSystemNameEn: 'Curriculum and Assessment Policy Statement (CAPS / DBE)',
    academicPeriods: 'TERM',
    periodNamesFr: ['1er Trimestre', '2ème Trimestre', '3ème Trimestre', '4ème Trimestre'],
    periodNamesEn: ['Term 1', 'Term 2', 'Term 3', 'Term 4'],
    gradingScale: '/100%',
    gradingScaleLabel: 'Level 1 to 7 Rating Scale & Percentage',
    phonePrefix: '+27',
    defaultCycles: [
      {
        level: 'Primary',
        classes: ['Grade R', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7']
      },
      {
        level: 'Lycée',
        classes: ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12 (Matric)']
      }
    ]
  }
};

export const COUNTRIES_LIST = Object.keys(COUNTRIES_CONFIG);

export function getCountryConfig(countryName: string): CountryEducationConfig {
  return COUNTRIES_CONFIG[countryName] || COUNTRIES_CONFIG['Benin'];
}
