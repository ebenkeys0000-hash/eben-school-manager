import React from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  UserCheck,
  CreditCard,
  GraduationCap,
  CalendarCheck,
  Clock,
  HeartHandshake,
  FileSpreadsheet,
  Settings,
  ShieldCheck,
  Bell,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export type NavTab =
  | 'dashboard'
  | 'students'
  | 'classes'
  | 'staff'
  | 'finance'
  | 'grades'
  | 'attendance'
  | 'timetable'
  | 'parent_portal'
  | 'documents'
  | 'announcements'
  | 'settings'
  | 'support'
  | 'super_admin';

interface AppSidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ currentTab, onSelectTab }) => {
  const { currentUser, currentSchool, isSuperAdmin } = useAuth();
  const { t } = useLanguage();
  const role = currentUser?.role;

  // Determine available tabs based on role
  const isDirectorOrAdmin = role === 'DIRECTOR' || role === 'ADMIN';
  const isAccountant = role === 'ACCOUNTANT';
  const isTeacher = role === 'TEACHER';
  const isSupervisor = role === 'SUPERVISOR';
  const isSecretary = role === 'SECRETARY';
  const isParent = role === 'PARENT';

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; show: boolean }[] = [
    {
      id: 'super_admin',
      label: t('menu.super_admin'),
      icon: <ShieldCheck className="w-4 h-4" />,
      show: isSuperAdmin
    },
    {
      id: 'dashboard',
      label: t('menu.dashboard'),
      icon: <LayoutDashboard className="w-4 h-4" />,
      show: isDirectorOrAdmin || isAccountant || isSupervisor || isSecretary || isSuperAdmin
    },
    {
      id: 'parent_portal',
      label: t('menu.parent_portal'),
      icon: <HeartHandshake className="w-4 h-4" />,
      show: isParent || isDirectorOrAdmin || isSuperAdmin
    },
    {
      id: 'students',
      label: t('menu.students'),
      icon: <Users className="w-4 h-4" />,
      show: isDirectorOrAdmin || isSecretary || isAccountant || isSuperAdmin
    },
    {
      id: 'classes',
      label: t('menu.classes'),
      icon: <BookOpen className="w-4 h-4" />,
      show: isDirectorOrAdmin || isTeacher || isSupervisor || isSuperAdmin
    },
    {
      id: 'staff',
      label: t('menu.staff'),
      icon: <UserCheck className="w-4 h-4" />,
      show: isDirectorOrAdmin || isSuperAdmin
    },
    {
      id: 'finance',
      label: t('menu.finance'),
      icon: <CreditCard className="w-4 h-4" />,
      show: isDirectorOrAdmin || isAccountant || isSuperAdmin
    },
    {
      id: 'grades',
      label: t('menu.grades'),
      icon: <GraduationCap className="w-4 h-4" />,
      show: isDirectorOrAdmin || isTeacher || isSupervisor || isSuperAdmin
    },
    {
      id: 'attendance',
      label: t('menu.attendance'),
      icon: <CalendarCheck className="w-4 h-4" />,
      show: isDirectorOrAdmin || isTeacher || isSupervisor || isSuperAdmin
    },
    {
      id: 'timetable',
      label: t('menu.timetable'),
      icon: <Clock className="w-4 h-4" />,
      show: isDirectorOrAdmin || isTeacher || isSupervisor || isSuperAdmin
    },
    {
      id: 'announcements',
      label: t('menu.announcements'),
      icon: <Bell className="w-4 h-4" />,
      show: true
    },
    {
      id: 'documents',
      label: t('menu.documents'),
      icon: <FileSpreadsheet className="w-4 h-4" />,
      show: isDirectorOrAdmin || isAccountant || isSecretary || isSuperAdmin
    },
    {
      id: 'settings',
      label: t('menu.settings'),
      icon: <Settings className="w-4 h-4" />,
      show: isDirectorOrAdmin || isSuperAdmin
    },
    {
      id: 'support',
      label: t('menu.support'),
      icon: <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      show: true
    }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] no-print transition-colors">
      {/* School identity banner */}
      {currentSchool && (
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              {currentSchool.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-bold text-slate-900 dark:text-white truncate" title={currentSchool.name}>
                {currentSchool.name}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {currentSchool.city} · {currentSchool.country}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation menu list */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems
          .filter((item) => item.show)
          .map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className={isActive ? 'text-emerald-400 dark:text-white' : 'text-slate-500 dark:text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
      </nav>

      {/* Tenant Isolation Security Stamp */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20">
        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="truncate">{t('nav.tenant_isolation')}</span>
        </div>
        {currentSchool && (
          <div className="text-[9px] font-mono text-slate-400 dark:text-slate-500 mt-1 truncate">
            Tenant: {currentSchool.code} · {currentSchool.currencySymbol || currentSchool.currency}
          </div>
        )}
      </div>
    </aside>
  );
};
