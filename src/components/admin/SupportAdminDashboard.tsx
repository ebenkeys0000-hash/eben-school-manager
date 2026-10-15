import React, { useState } from 'react';
import {
  LifeBuoy,
  MessageCircle,
  Mail,
  Phone,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Shield,
  ShieldAlert,
  FileText,
  User,
  Building2,
  ArrowRight,
  PlusCircle,
  ExternalLink,
  MessageSquare,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { dataService } from '../../services/dataService';
import { SupportTicket, SupportStatus, SupportCategory } from '../../types';
import { getSupportCategoryLabel, getSupportStatusLabel, formatDateFR } from '../../utils/formatters';

export const SupportAdminDashboard: React.FC = () => {
  const { isSuperAdmin, currentUser, refreshData } = useAuth();
  const { language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Selected ticket for internal notes modal
  const [activeNotesTicket, setActiveNotesTicket] = useState<SupportTicket | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');

  // Access Control: Strict restriction to platform administrators
  if (!isSuperAdmin) {
    return (
      <div className="p-8 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-center max-w-lg mx-auto">
        <ShieldAlert className="w-12 h-12 text-rose-600 dark:text-rose-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-rose-900 dark:text-rose-200 mb-1">
          Accès Réservé à l'Administration de la Plateforme
        </h2>
        <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
          Seul le propriétaire de la plateforme (Eben Keys) et les administrateurs SaaS autorisés peuvent accéder au registre global des tickets de support et aux notes internes.
        </p>
      </div>
    );
  }

  const allTickets = dataService.getSupportTickets({
    isSuperAdmin: true,
    category: selectedCategory,
    status: selectedStatus,
    search: searchQuery
  });

  const totalTicketsCount = dataService.getSupportTickets({ isSuperAdmin: true }).length;
  const newCount = dataService.getSupportTickets({ isSuperAdmin: true, status: 'NOUVEAU' }).length;
  const inProgressCount = dataService.getSupportTickets({ isSuperAdmin: true, status: 'EN_COURS' }).length;
  const resolvedCount = dataService.getSupportTickets({ isSuperAdmin: true, status: 'RESOLU' }).length;

  const handleStatusChange = (ticketId: string, newStatus: SupportStatus) => {
    dataService.updateSupportTicketStatus(ticketId, newStatus, {
      id: currentUser?.id || 'eben-keys-admin',
      name: currentUser?.name || 'Eben Keys'
    });
    refreshData();
    if (activeNotesTicket && activeNotesTicket.id === ticketId) {
      const updated = dataService.getSupportTicketById(ticketId);
      if (updated) setActiveNotesTicket(updated);
    }
  };

  const handleAddInternalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeNotesTicket || !newNoteContent.trim()) return;

    dataService.addSupportTicketInternalNote(
      activeNotesTicket.id,
      newNoteContent.trim(),
      currentUser?.name || 'Eben Keys (Support)'
    );

    refreshData();
    const updated = dataService.getSupportTicketById(activeNotesTicket.id);
    if (updated) setActiveNotesTicket(updated);
    setNewNoteContent('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Gestion Privée du Support SaaS</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Registre Central des Demandes d'Assistance
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Supervisé par <strong>Eben Keys</strong> · Contact WhatsApp officiel : <strong>+229 95 44 16 02</strong> · Comé, Bénin.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/22995441602"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Ouvrir WhatsApp (+229 95 44 16 02)</span>
          </a>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Demandes
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {totalTicketsCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Toutes écoles et visiteurs</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Nouvelles Requêtes
          </div>
          <div className="text-2xl font-black text-blue-700 dark:text-blue-400 font-mono mt-1">
            {newCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">En attente de prise en charge</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            En Cours de Traitement
          </div>
          <div className="text-2xl font-black text-amber-700 dark:text-amber-400 font-mono mt-1">
            {inProgressCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Intervention active</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Tickets Résolus
          </div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-1">
            {resolvedCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Problème clôturé avec succès</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par ticket, nom, école, email..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="ALL">Toutes les catégories</option>
            <option value="CONNEXION_COMPTE">Connexion et compte</option>
            <option value="INSCRIPTION_ECOLE">Inscription de mon école</option>
            <option value="GESTION_ELEVES">Gestion des élèves</option>
            <option value="SCOLARITE_PAIEMENTS">Scolarité et paiements</option>
            <option value="NOTES_BULLETINS">Notes et bulletins</option>
            <option value="ABONNEMENT">Abonnement</option>
            <option value="PROBLEME_TECHNIQUE">Problème technique</option>
            <option value="AUTRE">Autre demande</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="NOUVEAU">Nouveau uniquement</option>
            <option value="EN_COURS">En cours uniquement</option>
            <option value="RESOLU">Résolu uniquement</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {allTickets.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
            Aucun ticket ne correspond aux critères de recherche.
          </div>
        ) : (
          allTickets.map((ticket) => {
            const statusMeta = getSupportStatusLabel(ticket.status, language as any);
            const notesCount = ticket.internalNotes?.length || 0;
            const cleanPhone = ticket.whatsappNumber ? ticket.whatsappNumber.replace(/[^0-9]/g, '') : null;

            return (
              <div
                key={ticket.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all text-xs space-y-3"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-black text-sm text-slate-950 dark:text-white">
                      {ticket.ticketNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {getSupportCategoryLabel(ticket.category, language as any)}
                    </span>
                    {ticket.schoolName && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{ticket.schoolName}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status Changer Select */}
                    <select
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value as SupportStatus)}
                      className={`text-xs font-bold px-3 py-1 rounded-full border focus:outline-none transition-colors ${statusMeta.color}`}
                    >
                      <option value="NOUVEAU">Nouveau</option>
                      <option value="EN_COURS">En cours</option>
                      <option value="RESOLU">Résolu</option>
                    </select>

                    <span className="text-[11px] text-slate-400 font-mono">
                      {formatDateFR(ticket.createdAt, true)}
                    </span>
                  </div>
                </div>

                {/* Submitter Info Strip */}
                <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-300 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ticket.fullName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`mailto:${ticket.email}?subject=Support Eben School Manager [${ticket.ticketNumber}]`} className="hover:underline text-emerald-700 dark:text-emerald-400 font-mono">
                      {ticket.email}
                    </a>
                  </div>
                  {ticket.whatsappNumber && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{ticket.whatsappNumber}</span>
                    </div>
                  )}
                </div>

                {/* Problem Description */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed text-xs">
                  {ticket.description}
                </div>

                {/* Bottom Controls: Direct Contact & Internal Notes */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    {/* Direct WhatsApp Response Button */}
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Bonjour ${ticket.fullName}, ici Eben Keys du support technique Eben School Manager. Je prends en charge votre demande ${ticket.ticketNumber} relative à "${getSupportCategoryLabel(ticket.category)}".`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>Répondre sur WhatsApp ({ticket.whatsappNumber})</span>
                      </a>
                    )}

                    <a
                      href={`mailto:${ticket.email}?subject=Support Eben School Manager [${ticket.ticketNumber}]&body=Bonjour ${encodeURIComponent(ticket.fullName)},%0D%0A%0D%0AIci Eben Keys du support technique Eben School Manager à Comé, Bénin.`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>Répondre par E-mail</span>
                    </a>
                  </div>

                  {/* Private Internal Notes Trigger */}
                  <button
                    onClick={() => setActiveNotesTicket(ticket)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-bold text-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Notes Internes Privées</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-mono">
                      {notesCount}
                    </span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* INTERNAL NOTES MODAL (Strictly hidden from customers) */}
      {activeNotesTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative my-8 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Notes Internes · {activeNotesTicket.ticketNumber}
                </h3>
              </div>
              <button
                onClick={() => setActiveNotesTicket(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl text-[11px] text-purple-900 dark:text-purple-200 mb-4">
              <strong>Confidentiel :</strong> Ces notes sont strictement privées et invisibles pour le client ou l'école. Elles permettent à Eben Keys et à l'équipe support de tracer les interventions techniques.
            </div>

            {/* List of existing internal notes */}
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {(!activeNotesTicket.internalNotes || activeNotesTicket.internalNotes.length === 0) ? (
                <div className="py-6 text-center text-slate-400 italic">
                  Aucune note interne enregistrée pour ce ticket.
                </div>
              ) : (
                activeNotesTicket.internalNotes.map((note) => (
                  <div key={note.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{note.authorName}</span>
                      <span className="font-mono">{formatDateFR(note.createdAt, true)}</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Add new note form */}
            <form onSubmit={handleAddInternalNote} className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                Ajouter une note de suivi interne :
              </label>
              <textarea
                rows={3}
                required
                placeholder="Ex: Client contacté par téléphone à 14h30. Problème de mot de passe résolu, formation planifiée."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveNotesTicket(null)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold shadow-xs"
                >
                  Enregistrer la Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
