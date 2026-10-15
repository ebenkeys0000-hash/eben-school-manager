import { PaymentMethod, FeeCategory, AttendanceStatus, UserRole, TermPeriod } from '../types';

/**
 * Format an amount in XOF (FCFA)
 */
export function formatXOF(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 FCFA';
  return `${Math.round(amount).toLocaleString('fr-FR')} FCFA`;
}

/**
 * Format an amount in any configured currency with symbol
 */
export function formatCurrency(amount: number, currency = 'XOF', symbol?: string): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    const sym = symbol || (currency === 'XOF' || currency === 'XAF' ? 'FCFA' : currency);
    return `0 ${sym}`;
  }
  const formatted = Math.round(amount).toLocaleString('fr-FR');
  const sym = symbol || (currency === 'XOF' || currency === 'XAF' ? 'FCFA' : currency);
  return `${formatted} ${sym}`;
}

/**
 * Convert integer to English words for official receipts in anglophone schools
 */
export function numberToEnglishWords(num: number): string {
  const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  num = Math.floor(Math.abs(num));
  if (num === 0) return 'zero';

  function convertChunk(n: number): string {
    let chunk = '';
    const h = Math.floor(n / 100);
    const rem = n % 100;
    if (h > 0) {
      chunk += units[h] + ' hundred ';
    }
    if (rem > 0 && h > 0) {
      chunk += 'and ';
    }
    if (rem >= 10 && rem < 20) {
      chunk += teens[rem - 10] + ' ';
    } else if (rem >= 20) {
      const t = Math.floor(rem / 10);
      const u = rem % 10;
      chunk += tens[t] + (u > 0 ? '-' + units[u] : '') + ' ';
    } else if (rem > 0) {
      chunk += units[rem] + ' ';
    }
    return chunk.trim();
  }

  if (num < 1000) return convertChunk(num);

  const millions = Math.floor(num / 1000000);
  const thousands = Math.floor((num % 1000000) / 1000);
  const rest = num % 1000;

  let words = '';
  if (millions > 0) words += convertChunk(millions) + ' million ';
  if (thousands > 0) words += convertChunk(thousands) + ' thousand ';
  if (rest > 0) words += convertChunk(rest);

  return words.trim();
}

/**
 * Format dates in French (e.g., "15 oct. 2025" or "15/10/2025")
 */
export function formatDateFR(dateStr: string, full = false): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  if (full) {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Convert integer to French words for official school receipts (e.g. 150000 -> cent cinquante mille)
 */
export function numberToFrenchWords(num: number): string {
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingts', 'quatre-vingt-dix'];

  num = Math.floor(Math.abs(num));
  if (num === 0) return 'zéro';

  function convertChunk(n: number): string {
    let chunk = '';
    const h = Math.floor(n / 100);
    const remainder = n % 100;

    if (h > 0) {
      if (h === 1) {
        chunk += 'cent ';
      } else {
        chunk += units[h] + ' cent' + (remainder === 0 ? 's ' : ' ');
      }
    }

    if (remainder >= 10 && remainder < 20) {
      chunk += teens[remainder - 10] + ' ';
    } else if (remainder >= 20 && remainder < 70) {
      const t = Math.floor(remainder / 10);
      const u = remainder % 10;
      if (u === 1) {
        chunk += tens[t] + ' et un ';
      } else {
        chunk += tens[t] + (u > 0 ? '-' + units[u] : '') + ' ';
      }
    } else if (remainder >= 70 && remainder < 80) {
      const u = remainder % 20;
      if (u === 11) {
        chunk += 'soixante et onze ';
      } else {
        chunk += 'soixante-' + teens[u - 10] + ' ';
      }
    } else if (remainder >= 80 && remainder < 90) {
      const u = remainder % 10;
      chunk += (u === 0 ? 'quatre-vingts ' : 'quatre-vingt-' + units[u] + ' ');
    } else if (remainder >= 90 && remainder < 100) {
      const u = remainder % 20;
      chunk += 'quatre-vingt-' + teens[u - 10] + ' ';
    } else if (remainder > 0 && remainder < 10) {
      chunk += units[remainder] + ' ';
    }

    return chunk.trim();
  }

  if (num < 1000) {
    return convertChunk(num);
  }

  let words = '';
  const millions = Math.floor(num / 1000000);
  const thousands = Math.floor((num % 1000000) / 1000);
  const rest = num % 1000;

  if (millions > 0) {
    if (millions === 1) {
      words += 'un million ';
    } else {
      words += convertChunk(millions) + ' millions ';
    }
  }

  if (thousands > 0) {
    if (thousands === 1) {
      words += 'mille ';
    } else {
      words += convertChunk(thousands) + ' mille ';
    }
  }

  if (rest > 0) {
    words += convertChunk(rest);
  }

  return words.trim();
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case 'ESPECES':
      return 'Espèces (Caisse)';
    case 'MTN_MOMO':
      return 'MTN Mobile Money';
    case 'MOOV_MONEY':
      return 'Moov Money';
    case 'CELTIIS_CASH':
      return 'Celtiis Cash';
    case 'VIREMENT':
      return 'Virement Bancaire';
    case 'CHEQUE':
      return 'Chèque';
    default:
      return method;
  }
}

export function getFeeCategoryLabel(cat: FeeCategory): string {
  switch (cat) {
    case 'INSCRIPTION':
      return "Frais d'inscription";
    case 'TRANCHE_1':
      return '1ère Tranche (Rentrée)';
    case 'TRANCHE_2':
      return '2ème Tranche (Décembre)';
    case 'TRANCHE_3':
      return '3ème Tranche (Février)';
    case 'FRAIS_ANNEXES':
      return 'Frais annexes (Cantine / Tenue)';
    case 'AUTRE':
      return 'Autre versement';
    default:
      return cat;
  }
}

export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'Super Administrateur SaaS';
    case 'DIRECTOR':
      return "Directeur d'Établissement";
    case 'ADMIN':
      return 'Administrateur Scolaire';
    case 'ACCOUNTANT':
      return 'Comptable / Trésorier';
    case 'TEACHER':
      return 'Professeur / Enseignant';
    case 'SECRETARY':
      return 'Secrétaire Administratif';
    case 'SUPERVISOR':
      return 'Surveillant Général / Censeur';
    case 'PARENT':
      return 'Parent / Tuteur';
    default:
      return role;
  }
}

export function getTermLabel(term: TermPeriod): string {
  switch (term) {
    case 'TRIMESTRE_1':
      return '1er Trimestre';
    case 'TRIMESTRE_2':
      return '2ème Trimestre';
    case 'TRIMESTRE_3':
      return '3ème Trimestre';
    default:
      return term;
  }
}

export function getAttendanceStatusLabel(status: AttendanceStatus): { label: string; color: string } {
  switch (status) {
    case 'PRESENT':
      return { label: 'Présent', color: 'text-emerald-700 bg-emerald-50 border border-emerald-200' };
    case 'ABSENT':
      return { label: 'Absent', color: 'text-rose-700 bg-rose-50 border border-rose-200' };
    case 'RETARD':
      return { label: 'En retard', color: 'text-amber-700 bg-amber-50 border border-amber-200' };
    case 'EXCUSE':
      return { label: 'Absence justifiée', color: 'text-sky-700 bg-sky-50 border border-sky-200' };
  }
}

export function getSupportCategoryLabel(category: string, lang: 'fr' | 'en' = 'fr'): string {
  switch (category) {
    case 'CONNEXION_COMPTE':
      return lang === 'en' ? 'Login and Account' : 'Connexion et compte';
    case 'INSCRIPTION_ECOLE':
      return lang === 'en' ? 'School Registration' : 'Inscription de mon école';
    case 'GESTION_ELEVES':
      return lang === 'en' ? 'Student Management' : 'Gestion des élèves';
    case 'SCOLARITE_PAIEMENTS':
      return lang === 'en' ? 'Tuition and Payments' : 'Scolarité et paiements';
    case 'NOTES_BULLETINS':
      return lang === 'en' ? 'Grades and Report Cards' : 'Notes et bulletins';
    case 'ABONNEMENT':
      return lang === 'en' ? 'Subscription' : 'Abonnement';
    case 'PROBLEME_TECHNIQUE':
      return lang === 'en' ? 'Technical Problem' : 'Problème technique';
    case 'AUTRE':
    default:
      return lang === 'en' ? 'Other Request' : 'Autre demande';
  }
}

export function getSupportStatusLabel(status: string, lang: 'fr' | 'en' = 'fr'): { label: string; color: string } {
  switch (status) {
    case 'NOUVEAU':
      return {
        label: lang === 'en' ? 'New' : 'Nouveau',
        color: 'text-blue-700 bg-blue-50 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
      };
    case 'EN_COURS':
      return {
        label: lang === 'en' ? 'In Progress' : 'En cours',
        color: 'text-amber-700 bg-amber-50 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
      };
    case 'RESOLU':
      return {
        label: lang === 'en' ? 'Resolved' : 'Résolu',
        color: 'text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
      };
    default:
      return {
        label: status,
        color: 'text-slate-700 bg-slate-50 border border-slate-200'
      };
  }
}
