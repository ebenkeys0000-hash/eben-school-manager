import React, { useState } from 'react';
import {
  UserCheck,
  PlusCircle,
  Mail,
  Phone,
  BookOpen,
  Shield,
  Edit2,
  CheckCircle,
  X,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { User, UserRole } from '../../types';
import { getRoleLabel } from '../../utils/formatters';

export const StaffManagement: React.FC = () => {
  const { currentSchool, refreshData } = useAuth();
  const schoolId = currentSchool?.id || '';

  const users = dataService.getUsers(schoolId);
  const classes = dataService.getClasses(schoolId);
  const subjects = dataService.getSubjects(schoolId);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'TEACHER' as UserRole,
    phone: '+229 ',
    assignedClassIds: [] as string[],
    assignedSubjectIds: [] as string[]
  });

  if (!currentSchool) return null;

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'TEACHER',
      phone: '+229 ',
      assignedClassIds: [],
      assignedSubjectIds: []
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      assignedClassIds: user.assignedClassIds || [],
      assignedSubjectIds: user.assignedSubjectIds || []
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingUser) {
      dataService.updateUser(editingUser.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        assignedClassIds: formData.assignedClassIds,
        assignedSubjectIds: formData.assignedSubjectIds
      });
    } else {
      dataService.addUser({
        schoolId,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        assignedClassIds: formData.assignedClassIds,
        assignedSubjectIds: formData.assignedSubjectIds
      });
    }

    refreshData();
    setIsAddModalOpen(false);
  };

  const toggleClassAssignment = (classId: string) => {
    setFormData((prev) => {
      const exists = prev.assignedClassIds.includes(classId);
      return {
        ...prev,
        assignedClassIds: exists
          ? prev.assignedClassIds.filter((id) => id !== classId)
          : [...prev.assignedClassIds, classId]
      };
    });
  };

  const toggleSubjectAssignment = (subjId: string) => {
    setFormData((prev) => {
      const exists = prev.assignedSubjectIds.includes(subjId);
      return {
        ...prev,
        assignedSubjectIds: exists
          ? prev.assignedSubjectIds.filter((id) => id !== subjId)
          : [...prev.assignedSubjectIds, subjId]
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Personnel Administratif & Corps Professoral
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestion des comptes, affectation des classes et habilitations de sécurité.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>Ajouter un Collaborateur</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => {
          const userClasses = classes.filter((c) => u.assignedClassIds?.includes(c.id));
          const userSubjects = subjects.filter((s) => u.assignedSubjectIds?.includes(s.id));

          return (
            <div
              key={u.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                    {getRoleLabel(u.role)}
                  </span>
                  <button
                    onClick={() => handleOpenEdit(u)}
                    className="p-1 text-slate-400 hover:text-slate-800 rounded"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900">{u.name}</h3>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{u.email}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono-numbers">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{u.phone}</span>
                  </div>
                </div>

                {u.role === 'TEACHER' && (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Matières enseignées :
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {userSubjects.length > 0 ? (
                          userSubjects.map((s) => (
                            <span key={s.id} className="text-[11px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                              {s.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Toutes matières</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Classes assignées :
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {userClasses.length > 0 ? (
                          userClasses.map((c) => (
                            <span key={c.id} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                              {c.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Toutes classes</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative text-xs my-8">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {editingUser ? 'Modifier le Collaborateur' : 'Ajouter un Collaborateur'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">Établissement : {currentSchool.name}</p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nom complet & Titre <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Prof. Édouard Kpodékon"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rôle / Habilitation</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="TEACHER">Enseignant / Professeur</option>
                    <option value="ACCOUNTANT">Comptable / Caisse</option>
                    <option value="ADMIN">Administrateur Scolaire</option>
                    <option value="SUPERVISOR">Surveillant Général / Censeur</option>
                    <option value="SECRETARY">Secrétaire Administratif</option>
                    <option value="DIRECTOR">Directeur</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+229 97 XX XX XX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email professionnel / Identifiant <span className="text-rose-500">*</span></label>
                <input
                  type="email"
                  required
                  placeholder="nom@ecole.bj"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              {formData.role === 'TEACHER' && (
                <div className="pt-2 border-t border-slate-200 space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Classes assignées :</label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-lg">
                      {classes.map((cls) => {
                        const checked = formData.assignedClassIds.includes(cls.id);
                        return (
                          <label key={cls.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleClassAssignment(cls.id)}
                              className="rounded text-emerald-600"
                            />
                            <span>{cls.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Matières enseignées :</label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-lg">
                      {subjects.map((s) => {
                        const checked = formData.assignedSubjectIds.includes(s.id);
                        return (
                          <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleSubjectAssignment(s.id)}
                              className="rounded text-emerald-600"
                            />
                            <span>{s.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                >
                  {editingUser ? 'Enregistrer' : 'Ajouter le Collaborateur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
