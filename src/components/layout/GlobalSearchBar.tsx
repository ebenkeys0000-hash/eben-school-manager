import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  Clock,
  UserCheck,
  FileText,
  X,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { dataService } from '../../services/dataService';
import { NavTab } from './AppSidebar';
import { formatXOF } from '../../utils/formatters';

interface SearchResultItem {
  id: string;
  type: 'student' | 'teacher' | 'class' | 'subject' | 'receipt' | 'timetable';
  title: string;
  subtitle: string;
  badge?: string;
  tab: NavTab;
  dataId?: string;
}

interface GlobalSearchBarProps {
  onNavigate: (tab: NavTab, targetId?: string) => void;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({ onNavigate }) => {
  const { currentSchool, currentUser } = useAuth();
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K or /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Execute tenant-isolated search
  useEffect(() => {
    if (!query.trim() || !currentSchool) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeout = setTimeout(() => {
      const q = query.toLowerCase().trim();
      const schoolId = currentSchool.id;
      const searchResults: SearchResultItem[] = [];

      // 1. Search Students
      const isParent = currentUser?.role === 'PARENT';
      const students = dataService.getStudents(schoolId);
      const authorizedStudents = isParent
        ? students.filter((s) => currentUser.childrenStudentIds?.includes(s.id))
        : students;

      authorizedStudents.forEach((st) => {
        const fullName = `${st.firstName} ${st.lastName}`.toLowerCase();
        if (fullName.includes(q) || st.matricule.toLowerCase().includes(q)) {
          searchResults.push({
            id: `st-${st.id}`,
            type: 'student',
            title: `${st.lastName.toUpperCase()} ${st.firstName}`,
            subtitle: `Matricule : ${st.matricule} · ${st.parentName}`,
            badge: st.status,
            tab: isParent ? 'parent_portal' : 'students',
            dataId: st.id
          });
        }
      });

      // 2. Search Teachers (if authorized)
      if (!isParent) {
        const staff = dataService.getUsers(schoolId);
        staff
          .filter((u) => u.role === 'TEACHER')
          .forEach((tch) => {
            if (tch.name.toLowerCase().includes(q) || tch.email.toLowerCase().includes(q)) {
              searchResults.push({
                id: `tch-${tch.id}`,
                type: 'teacher',
                title: tch.name,
                subtitle: `Professeur · ${tch.email}`,
                badge: 'Enseignant',
                tab: 'staff',
                dataId: tch.id
              });
            }
          });
      }

      // 3. Search Classes
      if (!isParent) {
        const classes = dataService.getClasses(schoolId);
        classes.forEach((cls) => {
          if (cls.name.toLowerCase().includes(q) || cls.level.toLowerCase().includes(q)) {
            searchResults.push({
              id: `cls-${cls.id}`,
              type: 'class',
              title: cls.name,
              subtitle: `Cycle ${cls.level} · Capacité ${cls.capacity} élèves`,
              badge: 'Classe',
              tab: 'classes',
              dataId: cls.id
            });
          }
        });
      }

      // 4. Search Subjects
      if (!isParent) {
        const subjects = dataService.getSubjects(schoolId);
        subjects.forEach((s) => {
          const matchFr = s.name.toLowerCase().includes(q);
          const matchEn = s.nameEn ? s.nameEn.toLowerCase().includes(q) : false;
          const matchCode = s.code.toLowerCase().includes(q);
          if (matchFr || matchEn || matchCode) {
            searchResults.push({
              id: `subj-${s.id}`,
              type: 'subject',
              title: s.name,
              subtitle: `${s.nameEn ? s.nameEn + ' · ' : ''}Coef. ${s.defaultCoefficient}`,
              badge: s.code,
              tab: 'classes',
              dataId: s.id
            });
          }
        });
      }

      // 5. Search Receipts / Payments
      const payments = dataService.getPayments(schoolId);
      const authorizedPayments = isParent
        ? payments.filter((p) => authorizedStudents.some((s) => s.id === p.studentId))
        : payments;

      authorizedPayments.forEach((pay) => {
        if (
          pay.receiptNumber.toLowerCase().includes(q) ||
          pay.reference.toLowerCase().includes(q) ||
          pay.payerName.toLowerCase().includes(q)
        ) {
          searchResults.push({
            id: `pay-${pay.id}`,
            type: 'receipt',
            title: `Reçu ${pay.receiptNumber}`,
            subtitle: `${formatXOF(pay.amount)} · ${pay.payerName} (${pay.method})`,
            badge: pay.status,
            tab: isParent ? 'parent_portal' : 'finance',
            dataId: pay.id
          });
        }
      });

      setResults(searchResults.slice(0, 10)); // max 10
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timeout);
  }, [query, currentSchool, currentUser]);

  const handleSelectResult = (item: SearchResultItem) => {
    onNavigate(item.tab, item.dataId);
    setIsOpen(false);
    setQuery('');
  };

  const getIconForType = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'student':
        return <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'teacher':
        return <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'class':
        return <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'subject':
        return <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'receipt':
        return <CreditCard className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />;
      case 'timetable':
        return <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
    }
  };

  return (
    <div ref={dropdownRef} className="relative flex-1 max-w-md hidden md:block">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder={t('nav.search_placeholder')}
          className="w-full pl-9 pr-12 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-transparent dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
        {query ? (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="absolute right-2.5 top-2 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">
            Ctrl K
          </kbd>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in-50 duration-150">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{t('search.modal_title')} · {currentSchool?.name}</span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
              <span>Tenant Isolé</span>
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Recherche en cours dans la base de données...
              </div>
            ) : results.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                {t('search.no_results', { query })}
              </div>
            ) : (
              results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectResult(item)}
                  className="w-full p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      {getIconForType(item.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {item.badge}
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
