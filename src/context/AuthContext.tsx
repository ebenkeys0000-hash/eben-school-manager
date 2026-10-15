import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, School, UserRole } from '../types';
import { dataService } from '../services/dataService';

interface AuthContextType {
  currentUser: User | null;
  currentSchool: School | null;
  isSuperAdmin: boolean;
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  switchSchoolAsSuperAdmin: (schoolId: string) => void;
  switchDemoRole: (role: UserRole, schoolId?: string, studentId?: string) => void;
  refreshData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default logged-in user: Director of School 1 (Complexe Scolaire La Renaissance)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const users = dataService.getUsers(null);
    return users.find((u) => u.email === 'directrice@larenaissance-cotonou.bj') || users[0] || null;
  });

  const [currentSchool, setCurrentSchool] = useState<School | null>(() => {
    if (currentUser?.schoolId) {
      return dataService.getSchoolById(currentUser.schoolId) || null;
    }
    return dataService.getSchools()[0] || null;
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (currentUser && currentUser.schoolId) {
      const sch = dataService.getSchoolById(currentUser.schoolId);
      setCurrentSchool(sch || null);
    } else if (currentUser?.role === 'SUPER_ADMIN') {
      // Super admin can inspect schools or remain global
      if (!currentSchool) {
        setCurrentSchool(dataService.getSchools()[0] || null);
      }
    } else {
      setCurrentSchool(null);
    }
  }, [currentUser, refreshTrigger]);

  const login = (email: string, role?: UserRole): boolean => {
    const users = dataService.getUsers(null);
    const target = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (target) {
      setCurrentUser(target);
      if (target.schoolId) {
        setCurrentSchool(dataService.getSchoolById(target.schoolId) || null);
      }
      return true;
    }

    // If specific role requested for testing
    if (role) {
      const byRole = users.find((u) => u.role === role);
      if (byRole) {
        setCurrentUser(byRole);
        if (byRole.schoolId) {
          setCurrentSchool(dataService.getSchoolById(byRole.schoolId) || null);
        }
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentSchool(null);
  };

  const switchSchoolAsSuperAdmin = (schoolId: string) => {
    if (currentUser?.role !== 'SUPER_ADMIN') {
      console.error('Action non autorisée: Seul le Super Administrateur peut changer d’école manuellement.');
      return;
    }
    const targetSchool = dataService.getSchoolById(schoolId);
    if (targetSchool) {
      setCurrentSchool(targetSchool);
    }
  };

  const switchDemoRole = (role: UserRole, schoolId?: string, studentId?: string) => {
    const users = dataService.getUsers(null);
    const targetSchoolId = schoolId || currentSchool?.id || 'school-cslr';

    if (role === 'SUPER_ADMIN') {
      const admin = users.find((u) => u.role === 'SUPER_ADMIN');
      if (admin) {
        setCurrentUser(admin);
        setCurrentSchool(dataService.getSchoolById(targetSchoolId) || null);
      }
      return;
    }

    // Look for matching user in that school
    let candidate = users.find((u) => u.schoolId === targetSchoolId && u.role === role);
    if (!candidate) {
      // Create on the fly demo user if none exists
      candidate = dataService.addUser({
        schoolId: targetSchoolId,
        name: `Démo ${role}`,
        email: `${role.toLowerCase()}@demo-${targetSchoolId}.bj`,
        role,
        phone: '+229 97 00 00 00',
        childrenStudentIds: studentId ? [studentId] : undefined
      });
    }

    setCurrentUser(candidate);
    setCurrentSchool(dataService.getSchoolById(targetSchoolId) || null);
  };

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentSchool,
        isSuperAdmin,
        login,
        logout,
        switchSchoolAsSuperAdmin,
        switchDemoRole,
        refreshData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
