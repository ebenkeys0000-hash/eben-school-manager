import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Edit2,
  Printer,
  Archive,
  CheckCircle,
  AlertCircle,
  Calendar,
  Phone,
  Mail,
  MapPin,
  X,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Student, ClassRoom } from '../../types';
import { formatDateFR } from '../../utils/formatters';

export const StudentManagement: React.FC = () => {
  const { currentSchool, refreshData } = useAuth();
  const schoolId = currentSchool?.id || '';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [printingStudent, setPrintingStudent] = useState<Student | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'M' as 'M' | 'F',
    dateOfBirth: '2013-01-01',
    placeOfBirth: 'Cotonou (Bénin)',
    classId: '',
    academicYearId: 'ay-cslr-2526',
    enrollmentDate: new Date().toISOString().split('T')[0],
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    parentAddress: '',
    status: 'INSCRIT' as Student['status']
  });

  const [formError, setFormError] = useState<string | null>(null);

  if (!currentSchool) return null;

  const classes = dataService.getClasses(schoolId);
  const academicYears = dataService.getAcademicYears(schoolId);
  const currentAy = academicYears.find((ay) => ay.isCurrent) || academicYears[0];

  const students = dataService.getStudents(schoolId, {
    classId: selectedClassId || undefined,
    status: (selectedStatus as Student['status']) || undefined,
    search: searchQuery || undefined
  });

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormError(null);
    setFormData({
      firstName: '',
      lastName: '',
      gender: 'M',
      dateOfBirth: '2013-05-10',
      placeOfBirth: 'Cotonou (Bénin)',
      classId: classes[0]?.id || '',
      academicYearId: currentAy?.id || '',
      enrollmentDate: new Date().toISOString().split('T')[0],
      parentName: '',
      parentPhone: '+229 ',
      parentEmail: '',
      parentAddress: 'Cotonou',
      status: 'INSCRIT'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormError(null);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
      placeOfBirth: student.placeOfBirth,
      classId: student.classId,
      academicYearId: student.academicYearId,
      enrollmentDate: student.enrollmentDate,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      parentEmail: student.parentEmail,
      parentAddress: student.parentAddress || '',
      status: student.status
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.firstName || !formData.lastName || !formData.classId) {
      setFormError('Veuillez remplir le nom, prénom et la classe.');
      return;
    }

    try {
      if (editingStudent) {
        dataService.updateStudent(editingStudent.id, schoolId, {
          ...formData
        });
      } else {
        dataService.addStudent({
          schoolId,
          ...formData
        });
      }
      refreshData();
      setIsAddModalOpen(false);
    } catch (err: any) {
      setFormError(err?.message || "Erreur lors de l'enregistrement de l'élève.");
    }
  };

  const handleArchive = (student: Student) => {
    if (confirm(`Confirmez-vous l'archivage du dossier de ${student.firstName} ${student.lastName} ?`)) {
      dataService.updateStudent(student.id, schoolId, { status: 'ARCHIVE' });
      refreshData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Gestion des Inscriptions & Élèves
            </h1>
            <span className="text-xs font-bold font-mono px-2 py-0.5 bg-slate-100 rounded-md text-slate-700">
              {students.length} élèves
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Matricules officiels, fiches d'inscription, affectation pédagogique et dossiers parents.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4 text-emerald-400" />
          <span>Nouvelle Inscription Élève</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, matricule ou parent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">Toutes les classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.level})
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">Tous les statuts</option>
            <option value="EN_REGLE">En règle (Scolarité soldée)</option>
            <option value="EN_RETARD">En retard de paiement</option>
            <option value="INSCRIT">Inscrit (En attente tranche)</option>
            <option value="ARCHIVE">Archivé</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Matricule</th>
                <th className="py-3 px-4 font-bold">Élève (Nom & Prénoms)</th>
                <th className="py-3 px-4 font-bold">Classe</th>
                <th className="py-3 px-4 font-bold">Date Naissance</th>
                <th className="py-3 px-4 font-bold">Parent / Tuteur</th>
                <th className="py-3 px-4 font-bold">Statut Scolarité</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Aucun élève trouvé correspondant à vos critères de recherche.
                  </td>
                </tr>
              ) : (
                students.map((st) => {
                  const cl = classes.find((c) => c.id === st.classId);
                  return (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {st.matricule}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <div className="font-bold">
                          {st.lastName.toUpperCase()} {st.firstName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {st.gender === 'M' ? 'Garçon' : 'Fille'} · Inscrit le {formatDateFR(st.enrollmentDate)}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-800">{cl?.name || 'N/A'}</span>
                        <div className="text-[10px] text-slate-400">{cl?.level}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                        {formatDateFR(st.dateOfBirth)}
                        <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{st.placeOfBirth}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{st.parentName}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono-numbers">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{st.parentPhone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {st.status === 'EN_REGLE' && (
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            En Règle
                          </span>
                        )}
                        {st.status === 'EN_RETARD' && (
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            En Retard Tranche
                          </span>
                        )}
                        {st.status === 'INSCRIT' && (
                          <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            Inscrit
                          </span>
                        )}
                        {st.status === 'ARCHIVE' && (
                          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            Archivé
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                        <button
                          onClick={() => setPrintingStudent(st)}
                          title="Imprimer la Fiche d'Inscription"
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(st)}
                          title="Modifier le dossier"
                          className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {st.status !== 'ARCHIVE' && (
                          <button
                            onClick={() => handleArchive(st)}
                            title="Archiver"
                            className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {editingStudent ? "Modifier le Dossier de l'Élève" : 'Nouvelle Inscription Scolaire'}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Établissement : <strong>{currentSchool.name}</strong> · Année {currentSchool.currentAcademicYear}
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nom de famille <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: MENSAH"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg uppercase focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prénoms <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Yannick Mahugnon"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sexe</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'M' | 'F' })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="M">Masculin (Garçon)</option>
                    <option value="F">Féminin (Fille)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date de naissance</label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lieu de naissance</label>
                  <input
                    type="text"
                    required
                    placeholder="Cotonou"
                    value={formData.placeOfBirth}
                    onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Classe d'affectation <span className="text-rose-500">*</span></label>
                  <select
                    required
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">Sélectionnez une classe</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.level}) - Capacité : {c.capacity}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Statut Initial Scolarité</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Student['status'] })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="INSCRIT">Inscrit (Frais d'inscription)</option>
                    <option value="EN_REGLE">En Règle</option>
                    <option value="EN_RETARD">En Retard</option>
                  </select>
                </div>
              </div>

              {/* Parents Section */}
              <div className="pt-3 border-t border-slate-200">
                <div className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
                  Informations Parentales / Tuteur Légal
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nom & Prénoms du Parent/Tuteur</label>
                    <input
                      type="text"
                      required
                      placeholder="Mme Clarisse MENSAH"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Numéro Téléphone (WhatsApp)</label>
                    <input
                      type="tel"
                      required
                      placeholder="+229 97 XX XX XX"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email du parent</label>
                    <input
                      type="email"
                      placeholder="parent@gmail.com"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Adresse de domicile / Quartier</label>
                    <input
                      type="text"
                      placeholder="Quartier Haie Vive, Cotonou"
                      value={formData.parentAddress}
                      onChange={(e) => setFormData({ ...formData, parentAddress: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
                >
                  {editingStudent ? 'Enregistrer les Modifications' : 'Valider l’Inscription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Official Registration Form Modal */}
      {printingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 border border-slate-300 shadow-2xl relative my-8 text-black">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-200 no-print">
              <span className="text-xs font-bold text-slate-500">Aperçu avant impression</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer la Fiche</span>
                </button>
                <button
                  onClick={() => setPrintingStudent(null)}
                  className="p-2 text-slate-500 hover:text-slate-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Print Document Content */}
            <div className="space-y-6 text-sm p-4 border border-slate-300 bg-white">
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600">RÉPUBLIQUE DU BÉNIN</div>
                  <div className="text-lg font-black text-slate-950 uppercase">{currentSchool.name}</div>
                  <div className="text-xs text-slate-700">{currentSchool.address} - {currentSchool.city}</div>
                  <div className="text-xs text-slate-600">{currentSchool.phone} · {currentSchool.email}</div>
                  <div className="text-[10px] text-slate-500 italic">{currentSchool.registrationNumber}</div>
                </div>

                <div className="text-right space-y-1">
                  <div className="w-24 h-28 border border-dashed border-slate-400 rounded flex flex-col items-center justify-center text-[10px] text-slate-400 mx-auto">
                    <span>Photo d'Identité</span>
                    <span>4x4</span>
                  </div>
                  <div className="text-xs font-mono font-bold mt-1">
                    Matricule : {printingStudent.matricule}
                  </div>
                </div>
              </div>

              <div className="text-center py-2 bg-slate-100 border border-slate-300 font-bold uppercase text-base">
                Fiche Officielle d'Inscription Scolaire — Année Académique {currentSchool.currentAcademicYear}
              </div>

              {/* Student Details */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                  1. État Civil de l'Apprenant
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div><strong>Nom :</strong> <span className="uppercase">{printingStudent.lastName}</span></div>
                  <div><strong>Prénoms :</strong> {printingStudent.firstName}</div>
                  <div><strong>Sexe :</strong> {printingStudent.gender === 'M' ? 'Masculin' : 'Féminin'}</div>
                  <div><strong>Né(e) le :</strong> {formatDateFR(printingStudent.dateOfBirth, true)}</div>
                  <div><strong>Lieu de naissance :</strong> {printingStudent.placeOfBirth}</div>
                  <div>
                    <strong>Classe attribuée :</strong>{' '}
                    <span className="font-bold underline">
                      {classes.find((c) => c.id === printingStudent.classId)?.name || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Parent Details */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                  2. Coordonnées des Parents / Tuteur Responsable
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div><strong>Nom du Tuteur :</strong> {printingStudent.parentName}</div>
                  <div><strong>Téléphone principal :</strong> {printingStudent.parentPhone}</div>
                  <div><strong>Email :</strong> {printingStudent.parentEmail || 'Non renseigné'}</div>
                  <div><strong>Adresse / Quartier :</strong> {printingStudent.parentAddress || currentSchool.city}</div>
                </div>
              </div>

              {/* Engagement & Signatures */}
              <div className="pt-6 border-t border-slate-300 text-xs space-y-4">
                <p className="italic text-slate-600 text-[11px] leading-relaxed">
                  Je soussigné(e), parent ou tuteur légal, certifie exacts les renseignements mentionnés ci-dessus et m'engage à respecter le règlement intérieur de l'établissement ainsi que l'échéancier des frais de scolarité fixés par la Direction.
                </p>

                <div className="grid grid-cols-2 gap-12 pt-8">
                  <div className="text-center">
                    <div className="font-bold">Signature du Parent / Tuteur :</div>
                    <div className="h-16"></div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">Pour la Direction de l'Établissement :</div>
                    <div className="text-[11px] text-slate-500">{currentSchool.directorName}</div>
                    <div className="h-16 flex items-center justify-center text-[10px] text-slate-300 border border-dashed border-slate-200 mt-2">
                      Cachet & Sceau de l'École
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
