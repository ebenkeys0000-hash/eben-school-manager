import React, { useState } from 'react';
import {
  GraduationCap,
  Building2,
  Calendar,
  LogOut,
  ChevronDown,
  Layers,
  ShieldAlert,
  User,
  ExternalLink,
  RefreshCw,
  Sun,
  Moon,
  Laptop,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { dataService } from '../../services/dataService';
import { getRoleLabel } from '../../utils/formatters';
import { GlobalSearchBar } from './GlobalSearchBar';
import { NavTab } from './AppSidebar';

interface AppNavbarProps {
  onGoToLanding: () => void;
  onOpenRoleSwitcher: () => void;
  onNavigateTab: (tab: NavTab, targetId?: string) => void;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({ onGoToLanding, onOpenRoleSwitcher, onNavigateTab }) => {
  const { currentUser, currentSchool, isSuperAdmin, logout, switchSchoolAsSuperAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, actualTheme, setTheme } = useTheme();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const schools = dataService.getSchools();

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 px-4 sm:px-6 flex items-center justify-between gap-4 no-print transition-colors">
      {/* Left: Brand & Active School Tenant */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={onGoToLanding}
          className="flex items-center gap-2.5 text-slate-900 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors shrink-0"
          title="Retour au site public"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-emerald-600 flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-base tracking-tight hidden sm:inline-block">
            {t('app.name')}
          </span>
        </button>

        <span className="text-slate-300 dark:text-slate-700 hidden lg:inline">|</span>

        {/* Current Active School Badge */}
        {currentSchool ? (
          <div className="flex items-center gap-2 truncate">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 hidden md:block">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentSchool.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5">
                <span>{currentSchool.city}, {currentSchool.country}</span>
                <span>·</span>
                <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">{currentSchool.code}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-800">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Supervision SaaS Globale</span>
          </div>
        )}
      </div>

      {/* Center: Global Application Search Bar */}
      <GlobalSearchBar onNavigate={onNavigateTab} />

      {/* Right Controls: SuperAdmin selector, Language, Theme, Role Switcher, Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Academic Year indicator */}
        {currentSchool && (
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('nav.year')} {currentSchool.currentAcademicYear}</span>
          </div>
        )}

        {/* Super Admin School Switcher */}
        {isSuperAdmin && (
          <div className="hidden lg:flex items-center gap-1 text-xs">
            <label className="text-slate-500 dark:text-slate-400 font-medium">{t('nav.school_view')}</label>
            <select
              value={currentSchool?.id || ''}
              onChange={(e) => switchSchoolAsSuperAdmin(e.target.value)}
              className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2 py-1 font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.city})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLangMenu(!showLangMenu);
              setShowThemeMenu(false);
              setShowProfileMenu(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Changer de langue / Change language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="uppercase">{language}</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in-50">
              <button
                onClick={() => {
                  setLanguage('fr');
                  setShowLangMenu(false);
                }}
                className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between ${
                  language === 'fr'
                    ? 'font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>Français</span>
                <span className="text-[10px] text-slate-400">FR</span>
              </button>
              <button
                onClick={() => {
                  setLanguage('en');
                  setShowLangMenu(false);
                }}
                className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between ${
                  language === 'en'
                    ? 'font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>English</span>
                <span className="text-[10px] text-slate-400">EN</span>
              </button>
            </div>
          )}
        </div>

        {/* Theme Selector Dropdown (Light / Dark / System) */}
        <div className="relative">
          <button
            onClick={() => {
              setShowThemeMenu(!showThemeMenu);
              setShowLangMenu(false);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Apparence / Theme"
          >
            {theme === 'system' ? (
              <Laptop className="w-4 h-4 text-slate-500" />
            ) : actualTheme === 'dark' ? (
              <Moon className="w-4 h-4 text-emerald-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>

          {showThemeMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in-50">
              <button
                onClick={() => {
                  setTheme('light');
                  setShowThemeMenu(false);
                }}
                className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center gap-2 ${
                  theme === 'light'
                    ? 'font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('theme.light')}</span>
              </button>
              <button
                onClick={() => {
                  setTheme('dark');
                  setShowThemeMenu(false);
                }}
                className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center gap-2 ${
                  theme === 'dark'
                    ? 'font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('theme.dark')}</span>
              </button>
              <button
                onClick={() => {
                  setTheme('system');
                  setShowThemeMenu(false);
                }}
                className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center gap-2 ${
                  theme === 'system'
                    ? 'font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Laptop className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('theme.system')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Role & Multi-Tenant Switcher Button */}
        <button
          onClick={onOpenRoleSwitcher}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors shadow-xs"
          title="Permet de tester les rôles et vérifier l'étanchéité entre écoles"
        >
          <Layers className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
          <span className="hidden lg:inline">{t('nav.switch_role')}</span>
          <span className="lg:hidden">Rôles</span>
        </button>

        {/* User Profile Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowThemeMenu(false);
              setShowLangMenu(false);
            }}
            className="flex items-center gap-2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-emerald-700 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
              {currentUser?.name ? currentUser.name.substring(0, 2) : 'AD'}
            </div>
            <div className="hidden sm:block text-left min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                {currentUser?.name || 'Administrateur'}
              </div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold truncate">
                {currentUser ? getRoleLabel(currentUser.role) : 'Invité'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in-50">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser?.name}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser?.email}</div>
                <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/60 rounded px-1.5 py-0.5 mt-1 inline-block">
                  {currentUser ? getRoleLabel(currentUser.role) : ''}
                </div>
              </div>

              <div className="py-1 text-xs">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenRoleSwitcher();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('nav.switch_role')}</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onGoToLanding();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('nav.public_site')}</span>
                </button>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    onGoToLanding();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
