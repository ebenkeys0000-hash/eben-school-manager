import React, { useState } from 'react';
import {
  BookOpen,
  PlusCircle,
  Users,
  Printer,
  Edit2,
  Trash2,
  Award,
  Layers,
  CheckCircle,
  X,
  Search,
  Filter,
  Check,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  Sparkles,
  Download,
  AlertCircle,
  FolderPlus,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { dataService } from '../../services/dataService';
import { ClassRoom, Subject, EducationLevel } from '../../types';
import { MASTER_SUBJECT_CATALOG, CatalogSubject } from '../../data/subjectCatalog';

export const ClassManagement: React.FC = () => {
  const { currentSchool, refreshData } = useAuth();
  const { t, language } = useLanguage();
  const schoolId = currentSchool?.id || '';

  const classes = dataService.getClasses(schoolId);
  const subjects = dataService.getSubjects(schoolId);
  const teachers = dataService.getUsers(schoolId).filter((u) => u.role === 'TEACHER');

  // Main Tab
  const [activeTab, setActiveTab] = useState<'classes' | 'curriculum'>('classes');

  // Modals
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [isMasterCatalogOpen, setIsMasterCatalogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [printingClassRoster, setPrintingClassRoster] = useState<ClassRoom | null>(null);

  // Search & Filters for subjects
  const [subjectSearch, setSubjectSearch] = useState('');
  const [subjectCategoryFilter, setSubjectCategoryFilter] = useState<string>('ALL');
  const [subjectStatusFilter, setSubjectStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Master catalog selection
  const [selectedCatalogCodes, setSelectedCatalogCodes] = useState<string[]>([]);
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<string>('ALL');

  // New Class Form
  const [classForm, setClassForm] = useState({
    name: '',
    level: 'Collège' as EducationLevel,
    capacity: 40,
    roomNumber: 'Salle 05',
    mainTeacherId: ''
  });

  // New Subject Form
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    nameEn: '',
    code: '',
    defaultCoefficient: 3,
    level: 'Collège' as EducationLevel,
    category: 'SCIENCES' as Subject['category']
  });

  if (!currentSchool) return null;

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm.name) return;

    dataService.addClass({
      schoolId,
      name: classForm.name,
      level: classForm.level,
      capacity: Number(classForm.capacity),
      roomNumber: classForm.roomNumber,
      mainTeacherId: classForm.mainTeacherId || undefined,
      academicYearId: 'ay-2526'
    });

    refreshData();
    setIsAddClassModalOpen(false);
    setClassForm({ name: '', level: 'Collège', capacity: 40, roomNumber: '', mainTeacherId: '' });
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectForm.name) return;

    dataService.addSubject({
      schoolId,
      name: subjectForm.name,
      nameEn: subjectForm.nameEn || subjectForm.name,
      code: subjectForm.code || subjectForm.name.substring(0, 4).toUpperCase(),
      defaultCoefficient: Number(subjectForm.defaultCoefficient),
      level: subjectForm.level,
      category: subjectForm.category,
      isActive: true
    });

    refreshData();
    setIsAddSubjectModalOpen(false);
    setSubjectForm({
      name: '',
      nameEn: '',
      code: '',
      defaultCoefficient: 3,
      level: 'Collège',
      category: 'SCIENCES'
    });
  };

  const handleUpdateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;

    dataService.updateSubject(schoolId, editingSubject.id, {
      name: editingSubject.name,
      nameEn: editingSubject.nameEn,
      code: editingSubject.code,
      defaultCoefficient: Number(editingSubject.defaultCoefficient),
      level: editingSubject.level,
      category: editingSubject.category
    });

    refreshData();
    setEditingSubject(null);
  };

  const handleToggleSubjectActive = (subject: Subject) => {
    const updatedStatus = subject.isActive === false ? true : false;
    dataService.toggleSubjectActive(schoolId, subject.id, updatedStatus);
    refreshData();
  };

  const handleImportSelectedMaster = () => {
    if (selectedCatalogCodes.length === 0) return;
    dataService.importMasterSubjects(schoolId, selectedCatalogCodes);
    refreshData();
    setSelectedCatalogCodes([]);
    setIsMasterCatalogOpen(false);
  };

  const toggleSelectCatalogCode = (code: string) => {
    if (selectedCatalogCodes.includes(code)) {
      setSelectedCatalogCodes(selectedCatalogCodes.filter((c) => c !== code));
    } else {
      setSelectedCatalogCodes([...selectedCatalogCodes, code]);
    }
  };

  // Filtered Subjects
  const filteredSubjects = subjects.filter((s) => {
    if (subjectStatusFilter === 'ACTIVE' && s.isActive === false) return false;
    if (subjectStatusFilter === 'INACTIVE' && s.isActive !== false) return false;
    if (subjectCategoryFilter !== 'ALL' && s.category !== subjectCategoryFilter) return false;
    if (subjectSearch) {
      const q = subjectSearch.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchNameEn = s.nameEn ? s.nameEn.toLowerCase().includes(q) : false;
      const matchCode = s.code.toLowerCase().includes(q);
      if (!matchName && !matchNameEn && !matchCode) return false;
    }
    return true;
  });

  // Filtered Master Catalog for import
  const filteredCatalog = MASTER_SUBJECT_CATALOG.filter((cat) => {
    if (catalogCategoryFilter !== 'ALL' && cat.category !== catalogCategoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('class.title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('class.subtitle')}
          </p>
        </div>

        {/* Tab Switcher & Quick Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('classes')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'classes'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Classes ({classes.length})
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'curriculum'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {language === 'en' ? 'Curriculum & Subjects' : 'Curriculum & Matières'} ({subjects.length})
            </button>
          </div>

          {activeTab === 'classes' ? (
            <button
              onClick={() => setIsAddClassModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400 dark:text-white" />
              <span>{t('class.add_class_btn')}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMasterCatalogOpen(true)}
                className="px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
                title="Consulter et importer le catalogue"
              >
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">{t('class.master_catalog_btn')}</span>
                <span className="sm:hidden">Catalogue</span>
              </button>
              <button
                onClick={() => setIsAddSubjectModalOpen(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400 dark:text-white" />
                <span>{t('class.add_subject_btn')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* VIEW 1: CLASSES GRID */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>{classes.length} classes configurées pour l’année {currentSchool.currentAcademicYear}</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">{currentSchool.educationSystem}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => {
              const classStudents = dataService.getStudents(schoolId, { classId: cls.id });
              const mainTeacher = teachers.find((t) => t.id === cls.mainTeacherId);

              return (
                <div
                  key={cls.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {cls.level}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {classStudents.length} / {cls.capacity} {language === 'en' ? 'students' : 'élèves'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{cls.name}</h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {cls.roomNumber || (language === 'en' ? 'Room not set' : 'Salle non définie')}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      <div>
                        <strong>{t('class.main_teacher')}</strong>{' '}
                        <span className="text-slate-800 dark:text-slate-200 font-medium">
                          {mainTeacher?.name || (language === 'en' ? 'Unassigned' : 'Non désigné')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => setPrintingClassRoster(cls)}
                      className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{t('class.print_roster')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: CURRICULUM & MASTER SUBJECTS MANAGEMENT */}
      {activeTab === 'curriculum' && (
        <div className="space-y-4">
          {/* Historical Safety Notice */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">
                {language === 'en'
                  ? 'Historical Curriculum Integrity Policy:'
                  : 'Règle de sécurité pédagogique & intégrité historique :'}
              </span>
              <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                {language === 'en'
                  ? 'Modifying subject names or coefficients applies strictly to future exams and terms. Historical grades, averages, and past report cards are fully protected and never altered.'
                  : "Toute modification de coefficient ou de libellé s'applique exclusivement aux devoirs et périodes académiques futurs. Les notes, moyennes et rangs des bulletins antérieurs demeurent protégés et inaltérés."}
              </p>
            </div>
          </div>

          {/* Filters & Search Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={subjectSearch}
                onChange={(e) => setSubjectSearch(e.target.value)}
                placeholder={language === 'en' ? 'Search subject or code...' : 'Rechercher matière ou code...'}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={subjectCategoryFilter}
                onChange={(e) => setSubjectCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="ALL">{language === 'en' ? 'All categories' : 'Toutes les catégories'}</option>
                <option value="SCIENCES">Sciences & Mathématiques</option>
                <option value="LANGUES">Langues & Littératie</option>
                <option value="HUMANITES">Humanités & Citoyenneté</option>
                <option value="TECHNIQUE">Technique & Numérique</option>
                <option value="COMMERCE">Économie & Gestion</option>
                <option value="ARTS_SPORT">Arts & Éducation Physique</option>
              </select>

              <select
                value={subjectStatusFilter}
                onChange={(e) => setSubjectStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="ALL">{language === 'en' ? 'All statuses' : 'Tous les statuts'}</option>
                <option value="ACTIVE">{language === 'en' ? 'Active only' : 'Actives uniquement'}</option>
                <option value="INACTIVE">{language === 'en' ? 'Inactive only' : 'Désactivées uniquement'}</option>
              </select>
            </div>
          </div>

          {/* Subjects Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  {t('class.subjects_table_title')}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {language === 'en'
                    ? 'Bilingual subjects catalog with coefficients and teacher assignments.'
                    : 'Catalogue bilingue des matières avec coefficients et enseignants affectés.'}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                {filteredSubjects.length} / {subjects.length} {language === 'en' ? 'subjects' : 'matières'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4 font-bold">{t('class.code')}</th>
                    <th className="py-2.5 px-4 font-bold">{t('class.subject_name')}</th>
                    <th className="py-2.5 px-4 font-bold">{t('class.subject_name_en')}</th>
                    <th className="py-2.5 px-4 font-bold">{t('class.level')}</th>
                    <th className="py-2.5 px-4 font-bold text-center">{t('class.coefficient')}</th>
                    <th className="py-2.5 px-4 font-bold">{language === 'en' ? 'Teachers' : 'Enseignants'}</th>
                    <th className="py-2.5 px-4 font-bold text-center">{language === 'en' ? 'Status' : 'Statut'}</th>
                    <th className="py-2.5 px-4 font-bold text-right">{language === 'en' ? 'Actions' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredSubjects.map((s) => {
                    const assignedTeachers = teachers.filter((t) => t.assignedSubjectIds?.includes(s.id));
                    const isActive = s.isActive !== false;

                    return (
                      <tr key={s.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/60 ${!isActive ? 'opacity-50 bg-slate-50/50 dark:bg-slate-800/30' : ''}`}>
                        <td className="py-2.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            {s.code}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                          <div>{s.name}</div>
                          {s.category && (
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                              {s.category}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400 italic">
                          {s.nameEn || s.name}
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {s.level}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center font-bold font-mono text-emerald-800 dark:text-emerald-400">
                          {s.defaultCoefficient}
                        </td>
                        <td className="py-2.5 px-4">
                          {assignedTeachers.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {assignedTeachers.map((t) => (
                                <span
                                  key={t.id}
                                  className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                >
                                  {t.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic">
                              {language === 'en' ? 'No teacher assigned' : 'Aucun professeur'}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleSubjectActive(s)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                              isActive
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            {isActive ? (language === 'en' ? 'Active' : 'Active') : (language === 'en' ? 'Inactive' : 'Désactivée')}
                          </button>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setEditingSubject(s)}
                              className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded"
                              title={language === 'en' ? 'Edit / Rename Subject' : 'Modifier / Renommer la matière'}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Master Reference Catalog Importer */}
      {isMasterCatalogOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative my-8 text-xs">
            <button
              onClick={() => setIsMasterCatalogOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'en' ? 'Master National & Regional Subject Catalog' : 'Catalogue Pédagogique de Référence Régional'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {language === 'en'
                ? 'Select subjects from the standard curriculum catalog (30+ subjects) to import into your school workspace.'
                : 'Sélectionnez des matières issues du référentiel commun (30+ matières bilingues) pour les ajouter en un clic à votre établissement.'}
            </p>

            {/* Category Filter inside Master Catalog */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {['ALL', 'SCIENCES', 'LANGUES', 'HUMANITES', 'TECHNIQUE', 'COMMERCE', 'ARTS_SPORT'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCatalogCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                    catalogCategoryFilter === cat
                      ? 'bg-slate-900 dark:bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'ALL' ? 'Toutes' : cat}
                </button>
              ))}
            </div>

            {/* Catalog list */}
            <div className="max-h-96 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCatalog.map((item) => {
                const alreadyImported = subjects.some((s) => s.code === item.code);
                const isSelected = selectedCatalogCodes.includes(item.code);

                return (
                  <div
                    key={item.code}
                    onClick={() => {
                      if (!alreadyImported) toggleSelectCatalogCode(item.code);
                    }}
                    className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                      alreadyImported
                        ? 'bg-slate-50/60 dark:bg-slate-800/40 cursor-default'
                        : isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border ${
                          alreadyImported
                            ? 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-500'
                            : isSelected
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}
                      >
                        {(alreadyImported || isSelected) && <Check className="w-3.5 h-3.5" />}
                      </div>

                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{item.nameFr}</span>
                          <span className="text-slate-400 font-normal italic">/ {item.nameEn}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="font-mono font-bold">{item.code}</span>
                          <span>·</span>
                          <span>Cycle : {item.level}</span>
                          <span>·</span>
                          <span>Coeff standard : {item.defaultCoefficient}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {alreadyImported ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {language === 'en' ? 'Already in school' : 'Déjà configurée'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                          {isSelected ? (language === 'en' ? 'Selected' : 'Sélectionnée') : '+ Sélectionner'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom actions */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 text-xs">
                {selectedCatalogCodes.length} {language === 'en' ? 'subject(s) selected' : 'matière(s) sélectionnée(s)'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMasterCatalogOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  {language === 'en' ? 'Cancel' : 'Annuler'}
                </button>
                <button
                  type="button"
                  disabled={selectedCatalogCodes.length === 0}
                  onClick={handleImportSelectedMaster}
                  className="px-4 py-2 font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                >
                  {language === 'en' ? 'Import Selected Subjects' : 'Importer les Matières'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit / Rename Subject */}
      {editingSubject && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative text-xs">
            <button
              onClick={() => setEditingSubject(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {language === 'en' ? 'Edit / Rename Subject' : 'Modifier & Renommer la Matière'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {language === 'en'
                ? 'Update coefficients and titles for upcoming academic terms.'
                : 'Personnalisez le libellé et le coefficient pour les devoirs à venir.'}
            </p>

            <form onSubmit={handleUpdateSubject} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Intitulé Français <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingSubject.name}
                  onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  English Title (Nom Anglais)
                </label>
                <input
                  type="text"
                  value={editingSubject.nameEn || ''}
                  onChange={(e) => setEditingSubject({ ...editingSubject, nameEn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Code</label>
                  <input
                    type="text"
                    required
                    value={editingSubject.code}
                    onChange={(e) => setEditingSubject({ ...editingSubject, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono uppercase bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Coefficient Standard</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={editingSubject.defaultCoefficient}
                    onChange={(e) =>
                      setEditingSubject({ ...editingSubject, defaultCoefficient: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 rounded-lg shadow-xs"
                >
                  Enregistrer les Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Custom Subject */}
      {isAddSubjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative text-xs">
            <button
              onClick={() => setIsAddSubjectModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {language === 'en' ? 'Add Custom School Subject' : 'Ajouter une Matière Personnalisée'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {language === 'en'
                ? 'Create a custom subject tailored to your school program.'
                : 'Créez une matière spécifique avec son coefficient et sa catégorie.'}
            </p>

            <form onSubmit={handleCreateSubject} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Intitulé Français <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Éducation aux Valeurs, Robotique..."
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  English Title (Nom Anglais)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Values Education, Robotics..."
                  value={subjectForm.nameEn}
                  onChange={(e) => setSubjectForm({ ...subjectForm, nameEn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Code abrégé</label>
                  <input
                    type="text"
                    placeholder="Ex: ROBO"
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono uppercase bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Coefficient</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={subjectForm.defaultCoefficient}
                    onChange={(e) =>
                      setSubjectForm({ ...subjectForm, defaultCoefficient: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Niveau</label>
                  <select
                    value={subjectForm.level}
                    onChange={(e) => setSubjectForm({ ...subjectForm, level: e.target.value as EducationLevel })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Primaire">Primaire</option>
                    <option value="Collège">Collège</option>
                    <option value="Lycée">Lycée</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Catégorie</label>
                  <select
                    value={subjectForm.category}
                    onChange={(e) => setSubjectForm({ ...subjectForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="SCIENCES">Sciences & Maths</option>
                    <option value="LANGUES">Langues</option>
                    <option value="HUMANITES">Humanités</option>
                    <option value="TECHNIQUE">Technique & Digital</option>
                    <option value="COMMERCE">Commerce & Gestion</option>
                    <option value="ARTS_SPORT">Arts & Sport</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 rounded-lg shadow-xs"
                >
                  Ajouter la Matière
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Class */}
      {isAddClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative text-xs">
            <button
              onClick={() => setIsAddClassModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {language === 'en' ? 'Create a New Class' : 'Créer une Nouvelle Classe'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{currentSchool.name}</p>

            <form onSubmit={handleCreateClass} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nom de la classe <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 5ème B, Première D ou CM2"
                  value={classForm.name}
                  onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Niveau / Cycle</label>
                  <select
                    value={classForm.level}
                    onChange={(e) => setClassForm({ ...classForm, level: e.target.value as EducationLevel })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Collège">Collège (6ème - 3ème)</option>
                    <option value="Lycée">Lycée (2nde - Tle)</option>
                    <option value="Primaire">Primaire (CI - CM2)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Capacité maximale</label>
                  <input
                    type="number"
                    min="10"
                    max="80"
                    value={classForm.capacity}
                    onChange={(e) => setClassForm({ ...classForm, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Salle / Bâtiment</label>
                <input
                  type="text"
                  placeholder="Ex: Bâtiment A - Salle 03"
                  value={classForm.roomNumber}
                  onChange={(e) => setClassForm({ ...classForm, roomNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Professeur Principal</label>
                <select
                  value={classForm.mainTeacherId}
                  onChange={(e) => setClassForm({ ...classForm, mainTeacherId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">-- {language === 'en' ? 'None for now' : 'Aucun pour le moment'} --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddClassModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 rounded-lg shadow-xs"
                >
                  Créer la Classe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Class Roster Modal */}
      {printingClassRoster && (() => {
        const classStudents = dataService.getStudents(schoolId, { classId: printingClassRoster.id });
        const mainTeacher = teachers.find((t) => t.id === printingClassRoster.mainTeacherId);

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-3xl w-full p-8 border border-slate-300 shadow-2xl relative my-8 text-black">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-200 no-print">
                <span className="text-xs font-bold text-slate-500">
                  {language === 'en' ? 'Official Class Attendance List' : 'Liste Nominative de Classe'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{language === 'en' ? 'Print Roster' : 'Imprimer la Liste'}</span>
                  </button>
                  <button
                    onClick={() => setPrintingClassRoster(null)}
                    className="p-2 text-slate-500 hover:text-slate-800 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Document Roster */}
              <div className="p-6 border-2 border-slate-900 rounded-xl bg-white space-y-4 text-xs">
                <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-500">
                      {currentSchool.country ? `RÉPUBLIQUE - ${currentSchool.country.toUpperCase()}` : 'RÉPUBLIQUE DU BÉNIN'}
                    </div>
                    <div className="text-base font-black uppercase text-slate-950">{currentSchool.name}</div>
                    <div className="text-xs text-slate-600">{currentSchool.city} · {currentSchool.phone}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold uppercase">FICHE D'APPEL / LISTE DE CLASSE</div>
                    <div className="text-base font-black text-emerald-800">{printingClassRoster.name}</div>
                    <div className="text-[10px] text-slate-500">Année {currentSchool.currentAcademicYear}</div>
                  </div>
                </div>

                <div className="flex justify-between text-xs py-1">
                  <div><strong>Professeur Principal :</strong> {mainTeacher?.name || 'Non spécifié'}</div>
                  <div><strong>Effectif total :</strong> {classStudents.length} élèves</div>
                </div>

                <table className="w-full text-left border border-slate-900 text-xs">
                  <thead className="bg-slate-100 uppercase text-[10px] border-b border-slate-900">
                    <tr>
                      <th className="py-2 px-3 border-r border-slate-900 w-10">N°</th>
                      <th className="py-2 px-3 border-r border-slate-900">Matricule</th>
                      <th className="py-2 px-3 border-r border-slate-900">Nom & Prénoms</th>
                      <th className="py-2 px-3 border-r border-slate-900 w-16">Sexe</th>
                      <th className="py-2 px-3">Contact Parent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {classStudents.map((st, idx) => (
                      <tr key={st.id}>
                        <td className="py-2 px-3 border-r border-slate-900 font-mono text-center">{idx + 1}</td>
                        <td className="py-2 px-3 border-r border-slate-900 font-mono font-bold">{st.matricule}</td>
                        <td className="py-2 px-3 border-r border-slate-900 font-semibold">{st.lastName.toUpperCase()} {st.firstName}</td>
                        <td className="py-2 px-3 border-r border-slate-900 text-center">{st.gender}</td>
                        <td className="py-2 px-3 font-mono">{st.parentPhone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
