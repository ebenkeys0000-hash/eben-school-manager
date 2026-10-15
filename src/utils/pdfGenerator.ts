import { jsPDF } from 'jspdf';
import { Payment, Student, ClassRoom, School, Subject } from '../types';
import { formatXOF, formatDateFR, numberToFrenchWords, getPaymentMethodLabel, getFeeCategoryLabel } from './formatters';

export function formatCurrencyAmount(amount: number, currency = 'XOF', currencySymbol = 'FCFA'): string {
  const formatted = Math.round(amount).toLocaleString('fr-FR');
  return `${formatted} ${currencySymbol || currency}`;
}

export function generatePaymentReceiptPDF(options: {
  payment: Payment;
  student?: Student;
  classRoom?: ClassRoom;
  school: School;
  language?: 'fr' | 'en';
  totalPaid?: number;
  remainingBalance?: number;
}) {
  const { payment, student, classRoom, school, language = 'fr', totalPaid, remainingBalance } = options;
  const isEn = language === 'en';
  const currencySymbol = school.currencySymbol || (school.currency === 'XOF' ? 'FCFA' : school.currency);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5' // 148 x 210 mm
  });

  const pageWidth = 148;
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;

  // Background card styling
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, margin, contentWidth, 190, 3, 3, 'S');

  // School Header
  doc.setFillColor(248, 250, 252);
  doc.rect(margin + 0.5, margin + 0.5, contentWidth - 1, 26, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(school.name.toUpperCase(), margin + 4, margin + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`${school.address} · ${school.city}, ${school.country}`, margin + 4, margin + 12);
  doc.text(`Tél : ${school.phone} · Email : ${school.email}`, margin + 4, margin + 16);
  if (school.registrationNumber) {
    doc.setFontSize(7);
    doc.text(`Agrément / Reg. N° : ${school.registrationNumber}`, margin + 4, margin + 20);
  }

  // Receipt Number & Date Banner
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? 'RECEIPT NO:' : 'REÇU N° :', margin + 85, margin + 12);
  doc.setTextColor(5, 150, 105);
  doc.text(payment.receiptNumber, margin + 105, margin + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`${isEn ? 'Date:' : 'Date :'} ${formatDateFR(payment.date, true)}`, margin + 85, margin + 17);
  doc.text(`${isEn ? 'Year:' : 'Année :'} ${school.currentAcademicYear}`, margin + 85, margin + 21);

  // Divider
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, margin + 27, margin + contentWidth, margin + 27);

  // Document Title
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, margin + 27, contentWidth, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(
    isEn ? 'OFFICIAL TUITION PAYMENT RECEIPT' : 'REÇU OFFICIEL DE VERSEMENT DE SCOLARITÉ',
    pageWidth / 2,
    margin + 32.5,
    { align: 'center' }
  );

  // Student Details Block
  let y = margin + 41;
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);

  const studentName = student ? `${student.lastName.toUpperCase()} ${student.firstName}` : payment.payerName;
  const matricule = student?.matricule || 'N/A';
  const className = classRoom?.name || 'Standard';

  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'Student Name:' : 'Nom de l’Élève :', margin + 4, y);
  doc.setFont('helvetica', 'normal');
  doc.text(studentName, margin + 35, y);

  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'Student ID:' : 'Matricule :', margin + 85, y);
  doc.setFont('helvetica', 'normal');
  doc.text(matricule, margin + 105, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'Class:' : 'Classe :', margin + 4, y);
  doc.setFont('helvetica', 'normal');
  doc.text(className, margin + 35, y);

  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'Payer:' : 'Payeur :', margin + 85, y);
  doc.setFont('helvetica', 'normal');
  doc.text(payment.payerName, margin + 105, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'Fee Item:' : 'Objet du versement :', margin + 4, y);
  doc.setFont('helvetica', 'normal');
  doc.text(getFeeCategoryLabel(payment.feeCategory), margin + 35, y);

  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'Payment Method:' : 'Mode de paiement :', margin + 85, y);
  doc.setFont('helvetica', 'normal');
  doc.text(getPaymentMethodLabel(payment.method), margin + 105, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'Reference:' : 'Référence trans. :', margin + 4, y);
  doc.setFont('helvetica', 'normal');
  doc.text(payment.reference || 'ESP-DIRECT', margin + 35, y);

  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'Cashier / Admin:' : 'Encaissé par :', margin + 85, y);
  doc.setFont('helvetica', 'normal');
  doc.text(payment.recordedByName, margin + 105, y);

  // Amount Highlight Box
  y += 9;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(148, 163, 184);
  doc.roundedRect(margin + 4, y, contentWidth - 8, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? 'AMOUNT PAID:' : 'MONTANT REÇU :', margin + 8, y + 7);

  doc.setFontSize(13);
  doc.setTextColor(5, 150, 105);
  doc.text(formatCurrencyAmount(payment.amount, school.currency, currencySymbol), margin + contentWidth - 12, y + 7.5, { align: 'right' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  const words = numberToFrenchWords(payment.amount);
  doc.text(
    isEn
      ? `Received in full for academic fees: ${payment.amount} ${currencySymbol}.`
      : `Arrêté le présent reçu à la somme de : ${words} francs CFA.`,
    margin + 8,
    y + 14
  );

  // Financial Balance Status
  y += 24;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);

  if (totalPaid !== undefined && remainingBalance !== undefined) {
    doc.text(
      isEn
        ? `Total paid to date: ${formatCurrencyAmount(totalPaid, school.currency, currencySymbol)}`
        : `Total versé à ce jour : ${formatCurrencyAmount(totalPaid, school.currency, currencySymbol)}`,
      margin + 6,
      y
    );

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(remainingBalance > 0 ? 180 : 5, remainingBalance > 0 ? 83 : 150, remainingBalance > 0 ? 9 : 105);
    doc.text(
      isEn
        ? `Remaining Balance: ${formatCurrencyAmount(remainingBalance, school.currency, currencySymbol)}`
        : `Solde restant dû : ${formatCurrencyAmount(remainingBalance, school.currency, currencySymbol)}`,
      margin + contentWidth - 6,
      y,
      { align: 'right' }
    );
  }

  // Stamp & Signatures Box
  y += 12;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin + 4, y, margin + contentWidth - 4, y);

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);

  doc.text(isEn ? 'Payer Signature' : 'Signature du Payeur', margin + 12, y);
  doc.text(isEn ? 'School Cashier / Stamp' : 'Le Caissier / Cachet de l’École', margin + 78, y);

  // Stamp simulation
  doc.setDrawColor(5, 150, 105);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin + 74, y + 4, 46, 24, 2, 2, 'S');

  doc.setFontSize(7);
  doc.setTextColor(5, 150, 105);
  doc.text(school.name.substring(0, 22).toUpperCase(), margin + 97, y + 11, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'PAID & VERIFIED' : 'PAYÉ / CAISSE', margin + 97, y + 17, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDateFR(payment.date), margin + 97, y + 23, { align: 'center' });

  // Security Footer
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    isEn
      ? 'Generated securely via Eben School Manager · Verified Multi-Tenant SaaS'
      : 'Document officiel généré via Eben School Manager · Certification électronique',
    pageWidth / 2,
    margin + 185,
    { align: 'center' }
  );

  doc.save(`Recu_${payment.receiptNumber}.pdf`);
}

export function generateReportCardPDF(options: {
  student: Student;
  classRoom: ClassRoom;
  school: School;
  bulletinData: {
    subjectRows: {
      subject: Subject;
      coef: number;
      score: number;
      weightedScore: number;
      appreciation: string;
    }[];
    sumCoef: number;
    sumWeighted: number;
    generalAverage: number;
    distinction: string;
  };
  termLabel: string;
  language?: 'fr' | 'en';
  totalStudents?: number;
}) {
  const { student, classRoom, school, bulletinData, termLabel, language = 'fr', totalStudents = 35 } = options;
  const isEn = language === 'en';

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4' // 210 x 297 mm
  });

  const margin = 12;
  const contentWidth = 210 - margin * 2;

  // Header Box
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.6);
  doc.rect(margin, margin, contentWidth, 32, 'S');

  // Country header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(
    school.country.toUpperCase() === 'BÉNIN' || school.country.toUpperCase() === 'BENIN'
      ? 'RÉPUBLIQUE DU BÉNIN · MESTFP / MEMP'
      : `${school.country.toUpperCase()} · MINISTRY OF EDUCATION`,
    margin + 4,
    margin + 6
  );

  // School name
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(school.name.toUpperCase(), margin + 4, margin + 14);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`${school.address} - ${school.city}, ${school.country}`, margin + 4, margin + 19);
  doc.text(`Tél : ${school.phone} · Email : ${school.email}`, margin + 4, margin + 23);
  if (school.registrationNumber) {
    doc.text(`Agrément N° : ${school.registrationNumber}`, margin + 4, margin + 27);
  }

  // Right Header: Term & Academic Year
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105);
  doc.text(
    isEn ? 'OFFICIAL REPORT CARD' : 'BULLETIN DE NOTES OFFICIEL',
    margin + contentWidth - 4,
    margin + 10,
    { align: 'right' }
  );

  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(termLabel.toUpperCase(), margin + contentWidth - 4, margin + 16, { align: 'right' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(
    `${isEn ? 'Academic Year:' : 'Année Scolaire :'} ${school.currentAcademicYear}`,
    margin + contentWidth - 4,
    margin + 22,
    { align: 'right' }
  );

  // Student Identity Strip
  let y = margin + 36;
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 14, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, 14, 'S');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);

  doc.text(isEn ? 'Student:' : 'Élève :', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${student.lastName.toUpperCase()} ${student.firstName}`, margin + 24, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'Student ID:' : 'Matricule :', margin + 100, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(student.matricule, margin + 125, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'Class:' : 'Classe :', margin + 4, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(classRoom.name, margin + 24, y + 10);

  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'Class Size:' : 'Effectif :', margin + 100, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${totalStudents} ${isEn ? 'students' : 'élèves'}`, margin + 125, y + 10);

  // Grades Table Header
  y += 18;
  const colX = {
    subj: margin,
    coef: margin + 75,
    score: margin + 95,
    points: margin + 118,
    remark: margin + 142
  };

  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(isEn ? 'SUBJECT / CURRICULUM' : 'MATIÈRES ENSEIGNÉES', colX.subj + 3, y + 5.5);
  doc.text(isEn ? 'COEF' : 'COEF', colX.coef + 2, y + 5.5);
  doc.text(isEn ? 'SCORE' : 'NOTE /20', colX.score + 2, y + 5.5);
  doc.text(isEn ? 'POINTS' : 'POINTS', colX.points + 2, y + 5.5);
  doc.text(isEn ? 'TEACHER REMARK' : 'APPRÉCIATIONS DU PROFESSEUR', colX.remark + 3, y + 5.5);

  y += 8;

  // Subject Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  bulletinData.subjectRows.forEach((row, idx) => {
    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 7, 'F');
    }

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 7, margin + contentWidth, y + 7);

    doc.setTextColor(15, 23, 42);
    const subjName = isEn && row.subject.nameEn ? row.subject.nameEn : row.subject.name;
    doc.text(subjName.substring(0, 36), colX.subj + 3, y + 4.8);

    doc.text(String(row.coef), colX.coef + 5, y + 4.8, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.text(row.score.toFixed(2), colX.score + 6, y + 4.8, { align: 'center' });

    doc.text(row.weightedScore.toFixed(2), colX.points + 7, y + 4.8, { align: 'center' });

    doc.setFont('helvetica', 'italic');
    doc.setTextColor(71, 85, 105);
    doc.text(row.appreciation, colX.remark + 3, y + 4.8);
    doc.setFont('helvetica', 'normal');

    y += 7;
  });

  // Totals Row
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.4);
  doc.line(margin, y, margin + contentWidth, y);
  doc.line(margin, y + 8, margin + contentWidth, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? 'TOTALS:' : 'TOTAUX GÉNÉRAUX :', colX.subj + 3, y + 5.5);
  doc.text(String(bulletinData.sumCoef), colX.coef + 5, y + 5.5, { align: 'center' });
  doc.text('-', colX.score + 6, y + 5.5, { align: 'center' });
  doc.text(bulletinData.sumWeighted.toFixed(2), colX.points + 7, y + 5.5, { align: 'center' });

  // Results & Averages Card
  y += 12;
  const cardWidth = (contentWidth - 6) / 2;

  // Left summary
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, cardWidth, 34, 2, 2, 'S');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? 'Term Academic Performance' : 'Bilan Pédagogique du Trimestre', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(isEn ? 'Overall Average:' : 'Moyenne Générale :', margin + 4, y + 13);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(5, 150, 105);
  doc.text(`${bulletinData.generalAverage.toFixed(2)} / 20`, margin + cardWidth - 4, y + 13, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? 'Class Rank:' : 'Rang de l’élève :', margin + 4, y + 20);
  doc.setFont('helvetica', 'bold');
  doc.text(`2ème / ${totalStudents}`, margin + cardWidth - 4, y + 20, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.text(isEn ? 'Class Average:' : 'Moyenne de classe :', margin + 4, y + 27);
  doc.text('12.45 / 20', margin + cardWidth - 4, y + 27, { align: 'right' });

  // Right summary: Council Remarks
  doc.roundedRect(margin + cardWidth + 6, y, cardWidth, 34, 2, 2, 'S');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? 'Academic Council Remark' : 'Décision du Conseil des Professeurs', margin + cardWidth + 10, y + 6);

  doc.setFontSize(9);
  doc.setTextColor(5, 150, 105);
  doc.text(bulletinData.distinction, margin + cardWidth + 10, y + 14);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(71, 85, 105);
  doc.text(
    isEn
      ? 'Very good performance. Keep up the high standard in upcoming term.'
      : 'Très bon trimestre d’ensemble. Poursuivre avec régularité.',
    margin + cardWidth + 10,
    y + 22,
    { maxWidth: cardWidth - 10 }
  );

  // Signatures Section
  y += 42;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);

  doc.text(isEn ? 'Class Teacher Signature' : 'Le Professeur Principal', margin + 20, y);
  doc.text(isEn ? 'Principal / Head of School' : 'Le Chef d’Établissement', margin + contentWidth - 40, y, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(school.directorName, margin + contentWidth - 40, y + 4, { align: 'center' });

  // School stamp area
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin + contentWidth - 62, y + 7, 44, 22, 'S');
  doc.setFontSize(6.5);
  doc.text(isEn ? 'School Seal & Stamp' : 'Cachet & Sceau Officiel', margin + contentWidth - 40, y + 18, { align: 'center' });

  // Security Footer
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    isEn
      ? 'Official Grade Report · Eben School Manager Education Platform · Certified Authenticity'
      : 'Document officiel d’évaluation · Plateforme Eben School Manager · Certifié conforme',
    105,
    285,
    { align: 'center' }
  );

  doc.save(`Bulletin_${student.matricule}_${termLabel.replace(/\s+/g, '_')}.pdf`);
}
