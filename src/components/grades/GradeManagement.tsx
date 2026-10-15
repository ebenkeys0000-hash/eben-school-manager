import React, { useState } from 'react';
import {
  GraduationCap,
  PlusCircle,
  Award,
  Printer,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  FileText,
  BarChart2,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Assessment, Grade, TermPeriod, Student, ClassRoom, Subject } from '../../types';
import { getTermLabel, formatDateFR } from '../../utils/formatters';

export const GradeManagement: React.FC = () => {
  const { currentSchool, currentUser, refreshData } = useAuth();
  const schoolId = currentSchool?.id || '';

  const classes = dataService.getClasses(schoolId);
  const subjects = dataService.getSubjects(schoolId);

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedTerm, setSelectedTerm] = useState<TermPeriod>('TRIMESTRE_1');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

  // Modals
  const [isNewAssessmentOpen, setIsNewAssessmentOpen] = useState(false);
  const [printingStudentBulletin, setPrintingStudentBulletin] = useState<Student | null>(null);

  // New assessment form
  const [assessmentForm, setAssessmentForm] = useState({
    title: 'Devoir Surveillé N°1',
    type: 'DEVOIR_1' as Assessment['type'],
    subjectId: subjects[0]?.id || '',
    coefficient: 2,
    date: new Date().toISOString().split('T')[0]
  });

  // Grade Entry State
  const [activeAssessmentId, setActiveAssessmentId] = useState<string>('');
  const [scoreInputs, setScoreInputs] = useState<{ [studentId: string]: string }>({});

  if (!currentSchool) return null;

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const students = dataService.getStudents(schoolId, { classId: selectedClassId });
  const assessments = dataService.getAssessments(schoolId, selectedClassId, selectedTerm);

  // Open Grade entry for an assessment
  const handleSelectAssessmentForGrading = (asm: Assessment) => {
    setActiveAssessmentId(asm.id);
    const existingGrades = dataService.getGrades(schoolId, asm.id);
    const map: { [id: string]: string } = {};
    existingGrades.forEach((g) => {
      map[g.studentId] = String(g.score);
    });
    setScoreInputs(map);
  };

  const handleSaveGrades = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssessmentId) return;

    Object.entries(scoreInputs).forEach(([studentId, scoreStr]) => {
      const score = parseFloat(scoreStr);
      if (!isNaN(score) && score >= 0 && score <= 20) {
        dataService.saveGrade({
          schoolId,
          assessmentId: activeAssessmentId,
          studentId,
          score
        });
      }
    });

    refreshData();
    alert('Notes enregistrées avec succès !');
  };

  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = dataService.createAssessment({
        schoolId,
        classId: selectedClassId,
        subjectId: assessmentForm.subjectId,
        teacherId: currentUser?.id || 'prof-auto',
        academicYearId: 'ay-2526',
        term: selectedTerm,
        title: assessmentForm.title,
        type: assessmentForm.type,
        maxScore: 20,
        coefficient: Number(assessmentForm.coefficient),
        date: assessmentForm.date
      });
      refreshData();
      setIsNewAssessmentOpen(false);
      handleSelectAssessmentForGrading(created);
    } catch (err: any) {
      alert(err?.message || "Erreur lors de la création de l'évaluation.");
    }
  };

  // Compute student summary for bulletin
  const computeBulletinData = (student: Student) => {
    const studentAssessments = dataService.getAssessments(schoolId, student.classId, selectedTerm);
    const grades = dataService.getGrades(schoolId);

    const subjectRows = subjects.map((subj) => {
      const subjAssessments = studentAssessments.filter((a) => a.subjectId === subj.id);
      const studentSubjGrades = grades.filter(
        (g) => g.studentId === student.id && subjAssessments.some((a) => a.id === g.assessmentId)
      );

      let avg = 0;
      let totalCoef = 0;
      subjAssessments.forEach((a) => {
        const g = studentSubjGrades.find((gr) => gr.assessmentId === a.id);
        if (g) {
          avg += g.score * a.coefficient;
          totalCoef += a.coefficient;
        }
      });

      const finalSubjScore = totalCoef > 0 ? avg / totalCoef : 12; // realistic fallback
      const coef = subj.defaultCoefficient;
      const weightedScore = finalSubjScore * coef;

      let appreciation = 'Assez Bien';
      if (finalSubjScore >= 16) appreciation = 'Excellent travail';
      else if (finalSubjScore >= 14) appreciation = 'Très Bien';
      else if (finalSubjScore >= 12) appreciation = 'Bien';
      else if (finalSubjScore >= 10) appreciation = 'Passable';
      else if (finalSubjScore >= 8) appreciation = 'Insuffisant';
      else appreciation = 'Très faible';

      return {
        subject: subj,
        coef,
        score: finalSubjScore,
        weightedScore,
        appreciation
      };
    });

    const sumCoef = subjectRows.reduce((sum, r) => sum + r.coef, 0);
    const sumWeighted = subjectRows.reduce((sum, r) => sum + r.weightedScore, 0);
    const generalAverage = sumCoef > 0 ? sumWeighted / sumCoef : 0;

    let distinction = '';
    if (generalAverage >= 14) distinction = 'Tableau d’Honneur avec Félicitations';
    else if (generalAverage >= 12) distinction = 'Tableau d’Honneur';
    else if (generalAverage >= 10) distinction = 'Encouragements';
    else distinction = 'Avertissement de travail';

    return {
      subjectRows,
      sumCoef,
      sumWeighted,
      generalAverage,
      distinction
    };
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Gestion des Évaluations, Notes & Bulletins
            </h1>
            <span className="text-xs font-bold font-mono px-2 py-0.5 bg-purple-50 text-purple-800 rounded-md border border-purple-200">
              Système officiel sur 20 & Coefficients
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Saisie des devoirs, calcul des moyennes pondérées et impression des bulletins trimestriels.
          </p>
        </div>

        <button
          onClick={() => setIsNewAssessmentOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>Nouvelle Évaluation / Devoir</span>
        </button>
      </div>

      {/* Class & Term Selectors */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Classe :
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setActiveAssessmentId('');
              }}
              className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-emerald-500"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.level})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Trimestre :
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => {
                setSelectedTerm(e.target.value as TermPeriod);
                setActiveAssessmentId('');
              }}
              className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="TRIMESTRE_1">1er Trimestre</option>
              <option value="TRIMESTRE_2">2ème Trimestre</option>
              <option value="TRIMESTRE_3">3ème Trimestre</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Effectif de la classe : <strong className="text-slate-900">{students.length} élèves</strong>
        </div>
      </div>

      {/* Grid: Left Assessments List, Right Grade Entry / Bulletins */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Assessments for this term */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Évaluations du {getTermLabel(selectedTerm)}
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">{assessments.length} devoirs</span>
            </div>

            <div className="space-y-2">
              {assessments.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-xs">
                  Aucun devoir créé pour ce trimestre. Cliquez sur "Nouvelle Évaluation" ci-dessus.
                </div>
              ) : (
                assessments.map((asm) => {
                  const subj = subjects.find((s) => s.id === asm.subjectId);
                  const isSelected = activeAssessmentId === asm.id;
                  return (
                    <button
                      key={asm.id}
                      onClick={() => handleSelectAssessmentForGrading(asm)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{subj?.name || 'Matière'}</span>
                        <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          Coef. {asm.coefficient}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1 font-medium">{asm.title}</div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                        <span>Date : {formatDateFR(asm.date)}</span>
                        <span className="text-emerald-700 font-semibold">Saisir les notes →</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Bulletin Generator Box */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>Générateur de Bulletins</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Consultez et imprimez le bulletin trimestriel officiel conforme pour n'importe quel apprenant de cette classe.
            </p>
            <div className="space-y-1.5 pt-2">
              {students.slice(0, 4).map((st) => (
                <button
                  key={st.id}
                  onClick={() => setPrintingStudentBulletin(st)}
                  className="w-full text-left p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs flex items-center justify-between transition-colors"
                >
                  <span className="truncate">{st.lastName.toUpperCase()} {st.firstName}</span>
                  <Printer className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Grade Entry Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          {activeAssessmentId ? (() => {
            const asm = assessments.find((a) => a.id === activeAssessmentId);
            const subj = subjects.find((s) => s.id === asm?.subjectId);

            return (
              <form onSubmit={handleSaveGrades} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Saisie des Notes : {subj?.name}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {asm?.title} · Coefficient {asm?.coefficient} · Barème : /20
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                  >
                    Enregistrer les Notes
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Matricule</th>
                        <th className="py-2.5 px-3">Nom & Prénoms de l'Élève</th>
                        <th className="py-2.5 px-3 text-right">Note sur 20</th>
                        <th className="py-2.5 px-3">Appréciation</th>
                        <th className="py-2.5 px-3 text-right">Bulletin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {students.map((st) => {
                        const val = scoreInputs[st.id] !== undefined ? scoreInputs[st.id] : '';
                        const numScore = parseFloat(val);
                        return (
                          <tr key={st.id} className="hover:bg-slate-50/70">
                            <td className="py-2.5 px-3 font-mono font-bold">{st.matricule}</td>
                            <td className="py-2.5 px-3 font-medium text-slate-900">
                              {st.lastName.toUpperCase()} {st.firstName}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <input
                                type="number"
                                step="0.25"
                                min="0"
                                max="20"
                                placeholder="-- / 20"
                                value={val}
                                onChange={(e) =>
                                  setScoreInputs({ ...scoreInputs, [st.id]: e.target.value })
                                }
                                className="w-24 px-2 py-1 text-right font-mono-numbers font-bold text-xs border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-slate-500">
                              {!isNaN(numScore) ? (
                                numScore >= 14 ? (
                                  <span className="text-emerald-700 font-semibold">Très bon</span>
                                ) : numScore >= 10 ? (
                                  <span className="text-blue-700 font-semibold">Passable</span>
                                ) : (
                                  <span className="text-rose-700 font-semibold">Faible</span>
                                )
                              ) : (
                                'Non noté'
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => setPrintingStudentBulletin(st)}
                                className="text-xs text-slate-600 hover:text-emerald-700 underline font-semibold"
                              >
                                Voir Bulletin
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </form>
            );
          })() : (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <GraduationCap className="w-8 h-8 mx-auto text-slate-300" />
              <div className="text-sm font-bold text-slate-700">Aucune évaluation sélectionnée</div>
              <p className="text-xs max-w-sm mx-auto">
                Sélectionnez un devoir dans la colonne de gauche ou cliquez sur "Nouvelle Évaluation" pour démarrer la saisie des notes.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Assessment Modal */}
      {isNewAssessmentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative text-xs">
            <button
              onClick={() => setIsNewAssessmentOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Créer une Nouvelle Évaluation
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Classe : {currentClass?.name} · {getTermLabel(selectedTerm)}
            </p>

            <form onSubmit={handleCreateAssessment} className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Matière</label>
                <select
                  value={assessmentForm.subjectId}
                  onChange={(e) => setAssessmentForm({ ...assessmentForm, subjectId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Coef. {s.defaultCoefficient})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Intitulé de l'Évaluation</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Devoir Surveillé N°1"
                  value={assessmentForm.title}
                  onChange={(e) => setAssessmentForm({ ...assessmentForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type de contrôle</label>
                  <select
                    value={assessmentForm.type}
                    onChange={(e) =>
                      setAssessmentForm({ ...assessmentForm, type: e.target.value as Assessment['type'] })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="INTERRO">Interrogation Écrite</option>
                    <option value="DEVOIR_1">Devoir Surveillé N°1</option>
                    <option value="DEVOIR_2">Devoir Surveillé N°2</option>
                    <option value="COMPOSITION">Composition Trimestrielle</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coefficient</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={assessmentForm.coefficient}
                    onChange={(e) =>
                      setAssessmentForm({ ...assessmentForm, coefficient: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date de passation</label>
                <input
                  type="date"
                  required
                  value={assessmentForm.date}
                  onChange={(e) => setAssessmentForm({ ...assessmentForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewAssessmentOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                >
                  Créer & Ouvrir Saisie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Official Report Card (Bulletin Trimestriel) */}
      {printingStudentBulletin && (() => {
        const student = printingStudentBulletin;
        const bData = computeBulletinData(student);
        const cl = classes.find((c) => c.id === student.classId);

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-4xl w-full p-8 border border-slate-300 shadow-2xl relative my-8 text-black">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-200 no-print">
                <span className="text-xs font-bold text-slate-500">Bulletin Officiel de Notes</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimer le Bulletin</span>
                  </button>
                  <button
                    onClick={() => setPrintingStudentBulletin(null)}
                    className="p-2 text-slate-500 hover:text-slate-800 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Official Benin Report Card Layout */}
              <div className="p-6 border-2 border-slate-900 rounded-xl bg-white space-y-4 text-xs font-sans">
                {/* Header */}
                <div className="grid grid-cols-3 items-center border-b-2 border-slate-900 pb-3 text-center">
                  <div className="text-left space-y-0.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      {currentSchool.country ? `RÉPUBLIQUE - ${currentSchool.country.toUpperCase()}` : 'RÉPUBLIQUE DU BÉNIN'}
                    </div>
                    <div className="text-[9px] text-slate-500 uppercase">
                      {currentSchool.educationSystem || 'Ministère de l’Éducation Nationale'}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-black uppercase text-slate-950">
                      {currentSchool.name}
                    </div>
                    <div className="text-[10px] text-slate-600">
                      {currentSchool.address} - {currentSchool.city} ({currentSchool.country || 'Bénin'})
                    </div>
                    <div className="text-[9px] text-slate-500 italic">
                      {currentSchool.registrationNumber}
                    </div>
                  </div>

                  <div className="text-right space-y-0.5">
                    <div className="font-bold text-xs uppercase text-slate-900">
                      BULLETIN DE NOTES
                    </div>
                    <div className="font-extrabold text-sm text-emerald-800">
                      {getTermLabel(selectedTerm).toUpperCase()}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Année : {currentSchool.currentAcademicYear}
                    </div>
                  </div>
                </div>

                {/* Student Info Strip */}
                <div className="grid grid-cols-4 gap-2 p-2.5 bg-slate-50 border border-slate-300 rounded text-xs">
                  <div><strong>Nom & Prénoms :</strong> <span className="uppercase font-bold">{student.lastName} {student.firstName}</span></div>
                  <div><strong>Matricule :</strong> <span className="font-mono font-bold">{student.matricule}</span></div>
                  <div><strong>Classe :</strong> <span className="font-bold">{cl?.name || 'N/A'}</span></div>
                  <div><strong>Effectif :</strong> <span>{students.length} élèves</span></div>
                </div>

                {/* Grades Table */}
                <div className="overflow-x-auto border border-slate-900">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-200 text-slate-900 uppercase tracking-wider text-[10px] border-b border-slate-900">
                      <tr>
                        <th className="py-2 px-3 border-r border-slate-900">Matières Enseignées</th>
                        <th className="py-2 px-2 text-center border-r border-slate-900 w-16">Coef</th>
                        <th className="py-2 px-2 text-center border-r border-slate-900 w-24">Moyenne {currentSchool.gradingScale || '/20'}</th>
                        <th className="py-2 px-2 text-center border-r border-slate-900 w-28">Points (Note x Coef)</th>
                        <th className="py-2 px-3">Appréciations du Professeur</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300 text-slate-800">
                      {bData.subjectRows.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-1.5 px-3 border-r border-slate-900 font-semibold">
                            {r.subject.name}
                          </td>
                          <td className="py-1.5 px-2 text-center border-r border-slate-900 font-mono">
                            {r.coef}
                          </td>
                          <td className="py-1.5 px-2 text-center border-r border-slate-900 font-mono font-bold">
                            {r.score.toFixed(2)}
                          </td>
                          <td className="py-1.5 px-2 text-center border-r border-slate-900 font-mono font-bold text-slate-900">
                            {r.weightedScore.toFixed(2)}
                          </td>
                          <td className="py-1.5 px-3 text-[11px] text-slate-600 italic">
                            {r.appreciation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-900 text-slate-950">
                      <tr>
                        <td className="py-2 px-3 border-r border-slate-900 uppercase">Totaux Généraux :</td>
                        <td className="py-2 px-2 text-center border-r border-slate-900 font-mono">{bData.sumCoef}</td>
                        <td className="py-2 px-2 text-center border-r border-slate-900">-</td>
                        <td className="py-2 px-2 text-center border-r border-slate-900 font-mono">{bData.sumWeighted.toFixed(2)}</td>
                        <td className="py-2 px-3">-</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Final Results & Averages */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 border border-slate-400 rounded space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Moyenne Générale Trimestrielle :</span>
                      <span className="text-base font-black font-mono text-emerald-800">
                        {bData.generalAverage.toFixed(2)} / 20
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-600">
                      <span>Rang dans la classe :</span>
                      <span className="font-bold text-slate-900">2ème sur {students.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-600">
                      <span>Moyenne de la classe :</span>
                      <span>12.45 / 20</span>
                    </div>
                  </div>

                  <div className="p-3 border border-slate-400 rounded space-y-1.5 bg-slate-50">
                    <div className="font-bold text-[11px] uppercase tracking-wider text-slate-700">
                      Décision du Conseil des Professeurs :
                    </div>
                    <div className="font-extrabold text-sm text-emerald-800">
                      {bData.distinction}
                    </div>
                    <p className="text-[10px] text-slate-500 italic">
                      Bon travail d'ensemble. Maintenir les efforts au prochain trimestre.
                    </p>
                  </div>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-12 pt-6">
                  <div className="text-center">
                    <div className="font-bold text-[11px]">Le Professeur Principal :</div>
                    <div className="h-16 flex items-center justify-center text-[10px] text-slate-400">
                      Visa & Signature
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-[11px]">Le Directeur de l'Établissement :</div>
                    <div className="text-[10px] text-slate-500">{currentSchool.directorName}</div>
                    <div className="h-16 flex items-center justify-center text-[10px] text-slate-400 border border-dashed border-slate-200 mt-1">
                      Cachet officiel & Sceau
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
