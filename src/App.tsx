import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { LandingPage } from './components/public/LandingPage';
import { LoginModal } from './components/public/LoginModal';
import { RegisterSchoolModal } from './components/public/RegisterSchoolModal';
import { AppNavbar } from './components/layout/AppNavbar';
import { AppSidebar, NavTab } from './components/layout/AppSidebar';
import { RoleSwitcherModal } from './components/layout/RoleSwitcherModal';

// Modules
import { SchoolDashboard } from './components/dashboard/SchoolDashboard';
import { StudentManagement } from './components/students/StudentManagement';
import { ClassManagement } from './components/classes/ClassManagement';
import { StaffManagement } from './components/staff/StaffManagement';
import { FinanceManagement } from './components/finance/FinanceManagement';
import { GradeManagement } from './components/grades/GradeManagement';
import { AttendanceManagement } from './components/attendance/AttendanceManagement';
import { TimetableManagement } from './components/timetable/TimetableManagement';
import { ParentPortal } from './components/parent/ParentPortal';
import { AnnouncementsManagement } from './components/announcements/AnnouncementsManagement';
import { DocumentsReports } from './components/documents/DocumentsReports';
import { SchoolSettings } from './components/settings/SchoolSettings';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';

const MainApp: React.FC = () => {
  const { currentUser, currentSchool, switchDemoRole } = useAuth();

  // Navigation state: starts on 'app' with School 1 active, but allows seamless switching to public landing page
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('app');
  const [currentTab, setCurrentTab] = useState<NavTab>(() => {
    if (currentUser?.role === 'PARENT') return 'parent_portal';
    if (currentUser?.role === 'SUPER_ADMIN') return 'super_admin';
    return 'dashboard';
  });

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);

  // If user role changed to parent or super admin, adapt default tab
  React.useEffect(() => {
    if (currentUser?.role === 'PARENT') {
      setCurrentTab('parent_portal');
    } else if (currentUser?.role === 'SUPER_ADMIN') {
      setCurrentTab('super_admin');
    } else if (currentTab === 'super_admin') {
      setCurrentTab('dashboard');
    }
  }, [currentUser]);

  const handleOpenDemo = (role = 'DIRECTOR') => {
    switchDemoRole(role as any);
    setCurrentView('app');
  };

  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onOpenRegister={() => setIsRegisterModalOpen(true)}
          onOpenDemo={handleOpenDemo}
        />

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSuccess={() => setCurrentView('app')}
          onOpenRegister={() => {
            setIsLoginModalOpen(false);
            setIsRegisterModalOpen(true);
          }}
        />

        <RegisterSchoolModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onSuccess={() => setCurrentView('app')}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <AppNavbar
        onGoToLanding={() => setCurrentView('landing')}
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
        onNavigateTab={(tab) => setCurrentTab(tab)}
      />

      {/* Main Workspace with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        <AppSidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'dashboard' && (
              <SchoolDashboard onNavigate={(tab) => setCurrentTab(tab)} />
            )}
            {currentTab === 'students' && <StudentManagement />}
            {currentTab === 'classes' && <ClassManagement />}
            {currentTab === 'staff' && <StaffManagement />}
            {currentTab === 'finance' && <FinanceManagement />}
            {currentTab === 'grades' && <GradeManagement />}
            {currentTab === 'attendance' && <AttendanceManagement />}
            {currentTab === 'timetable' && <TimetableManagement />}
            {currentTab === 'parent_portal' && <ParentPortal />}
            {currentTab === 'announcements' && <AnnouncementsManagement />}
            {currentTab === 'documents' && <DocumentsReports />}
            {currentTab === 'settings' && <SchoolSettings />}
            {currentTab === 'super_admin' && <SuperAdminDashboard />}
          </div>
        </main>
      </div>

      {/* Role & Multi-Tenant Switcher Modal */}
      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
      />

      {/* Login and Register Modals (can be opened from header or switcher) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {}}
        onOpenRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />

      <RegisterSchoolModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
