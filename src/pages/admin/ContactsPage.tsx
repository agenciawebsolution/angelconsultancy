import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Trash2, 
  Eye, 
  Mail, 
  Loader2, 
  X 
} from 'lucide-react';
import { contactsAdminService } from '../../services/contactsAdminService';
import type { ContactMessage } from '../../types/cms';

export const ContactsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await contactsAdminService.getContacts({
        page,
        limit: 15,
        search: search.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setMessages(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);

      // Se houver um id na query string, abre o modal
      const directId = searchParams.get('id');
      if (directId) {
        const found = res.data?.find((m) => m.id === Number(directId));
        if (found) setSelectedMessage(found);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, searchParams]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      await fetchContacts();
      if (ignore) return;
    })();
    return () => {
      ignore = true;
    };
  }, [fetchContacts]);

  const handleStatusChange = async (id: number, newStatus: ContactMessage['status']) => {
    setActionLoading(true);
    try {
      await contactsAdminService.updateStatus(id, newStatus);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status: newStatus } : msg))
      );
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage((prev) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err: any) {
      alert(err?.message || 'Erro ao atualizar status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza de que deseja excluir permanentemente esta mensagem?')) {
      return;
    }
    setActionLoading(true);
    try {
      await contactsAdminService.deleteContact(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      setTotal((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      alert(err?.message || 'Erro ao excluir mensagem');
    } finally {
      setActionLoading(false);
    }
  };

  const renderServices = (rawServices: any) => {
    if (Array.isArray(rawServices)) return rawServices;
    if (typeof rawServices === 'string') {
      try {
        const parsed = JSON.parse(rawServices);
        return Array.isArray(parsed) ? parsed : [rawServices];
      } catch {
        return [rawServices];
      }
    }
    return [];
  };

  const statusBadges: Record<ContactMessage['status'], { label: string; bg: string }> = {
    unread: { label: 'Não lida', bg: 'bg-amber-50 text-amber-800 border-amber-200' },
    in_review: { label: 'Em análise', bg: 'bg-blue-50 text-blue-800 border-blue-200' },
    replied: { label: 'Respondida', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    archived: { label: 'Arquivada', bg: 'bg-slate-50 text-slate-700 border-slate-200' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Mensagens de Contato
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gerenciamento das mensagens enviadas pelo formulário do site ({total} no total).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-soft-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'unread', label: 'Não lidas' },
              { id: 'in_review', label: 'Em análise' },
              { id: 'replied', label: 'Respondidas' },
              { id: 'archived', label: 'Arquivadas' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  statusFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-soft-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail ou texto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-navy" />
          </div>
        ) : messages.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Mail className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">Nenhuma mensagem encontrada</p>
            <p className="text-xs text-slate-400">Tente alterar os filtros ou o termo de busca.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Remetente</th>
                  <th className="py-3.5 px-4">Tipo & Serviços</th>
                  <th className="py-3.5 px-4">Mensagem</th>
                  <th className="py-3.5 px-4">Data</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {messages.map((msg) => {
                  const servicesList = renderServices(msg.services);
                  const badge = statusBadges[msg.status] || statusBadges.unread;
                  return (
                    <tr
                      key={msg.id}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        msg.status === 'unread' ? 'bg-amber-50/15 font-medium' : ''
                      }`}
                      onClick={() => setSelectedMessage(msg)}
                    >
                      <td className="py-3.5 px-4 sm:px-6">
                        <p className="font-bold text-slate-900 text-xs sm:text-sm">{msg.full_name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{msg.email}</p>
                        <p className="text-[11px] text-slate-500">{msg.phone}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-700 block">{msg.client_type}</span>
                        <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">
                          {servicesList.join(', ') || 'Nenhum'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-slate-600 line-clamp-2 leading-relaxed">
                          {msg.message}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(msg.created_at).toLocaleDateString('pt-BR')}
                        <span className="block text-[10px] text-slate-400">
                          {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedMessage(msg)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-brand-navy hover:bg-slate-100"
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(msg.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Excluir mensagem"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Página {page} de {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                Anterior
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Drawer / Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-xl h-full sm:h-auto sm:max-h-[90vh] bg-white rounded-none sm:rounded-3xl shadow-soft-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Detalhes da Mensagem</h3>
                <p className="text-xs text-slate-500">ID #{selectedMessage.id} • Recebido em {new Date(selectedMessage.created_at).toLocaleString('pt-BR')}</p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              {/* Contact Info Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Nome Completo</span>
                  <p className="text-base font-bold text-slate-900">{selectedMessage.full_name}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">E-mail</span>
                    <a href={`mailto:${selectedMessage.email}`} className="block text-brand-navy font-semibold hover:underline">
                      {selectedMessage.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Telefone / WhatsApp</span>
                    <a href={`tel:${selectedMessage.phone}`} className="block text-brand-navy font-semibold hover:underline">
                      {selectedMessage.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Preferences & Profile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Perfil Selecionado</span>
                  <p className="text-sm font-bold text-slate-800 mt-1">{selectedMessage.client_type}</p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Preferência de Atendimento</span>
                  <p className="text-sm font-bold text-slate-800 mt-1">{selectedMessage.attendance_preference}</p>
                </div>
              </div>

              {/* Services Requested */}
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-2">Serviços de Interesse</span>
                <div className="flex flex-wrap gap-2">
                  {renderServices(selectedMessage.services).map((srv: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-brand-navy-50 text-brand-navy text-xs font-semibold border border-brand-navy-100">
                      {srv}
                    </span>
                  ))}
                </div>
              </div>

              {/* Full Message */}
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-2">Mensagem do Solicitante</span>
                <div className="p-4 rounded-2xl bg-[#FAFBFD] border border-slate-200 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Status Action Selector */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Alterar Status da Solicitação</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'unread', label: 'Não lida' },
                    { id: 'in_review', label: 'Em análise' },
                    { id: 'replied', label: 'Respondida' },
                    { id: 'archived', label: 'Arquivada' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      disabled={actionLoading}
                      onClick={() => handleStatusChange(selectedMessage.id, st.id as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        selectedMessage.status === st.id
                          ? 'bg-brand-navy text-white border-brand-navy font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <button
                disabled={actionLoading}
                onClick={() => handleDelete(selectedMessage.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Excluir</span>
              </button>

              <button
                onClick={() => setSelectedMessage(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
