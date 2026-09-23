import React, { useEffect, useState, useCallback } from 'react';
import { pagesService } from '../../services/pagesService';
import type { CmsPage } from '../../types/cms';
import { Button } from '../../components/ui/Button';
import { Plus, Edit2, Trash2, Globe, FileText, Loader2, X, Check } from 'lucide-react';

export const PagesAdminPage: React.FC = () => {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CmsPage | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    featured_image: '',
    status: 'published' as 'published' | 'draft',
    sort_order: 0,
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    robots: 'index, follow',
  });

  const loadPages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await pagesService.getPages();
      setPages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      await loadPages();
      if (ignore) return;
    })();
    return () => {
      ignore = true;
    };
  }, [loadPages]);

  const openCreateModal = () => {
    setEditingPage(null);
    setForm({
      title: '',
      slug: '',
      content: '',
      featured_image: '',
      status: 'published',
      sort_order: 0,
      meta_title: '',
      meta_description: '',
      canonical_url: '',
      robots: 'index, follow',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (page: CmsPage) => {
    setEditingPage(page);
    setForm({
      title: page.title,
      slug: page.slug,
      content: page.content,
      featured_image: page.featured_image || '',
      status: page.status,
      sort_order: page.sort_order,
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      canonical_url: page.canonical_url || '',
      robots: page.robots || 'index, follow',
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (page: CmsPage) => {
    const nextStatus = page.status === 'published' ? 'draft' : 'published';
    try {
      await pagesService.updatePage(page.id, { ...page, status: nextStatus });
      setPages((prev) =>
        prev.map((p) => (p.id === page.id ? { ...p, status: nextStatus } : p))
      );
      setFeedback(`Status da página alterado para ${nextStatus === 'published' ? 'Publicada' : 'Rascunho'}.`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err?.message || 'Erro ao alterar status da página');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingPage) {
        await pagesService.updatePage(editingPage.id, form);
        setFeedback('Página atualizada com sucesso!');
      } else {
        await pagesService.createPage(form);
        setFeedback('Página criada com sucesso!');
      }
      setIsModalOpen(false);
      await loadPages();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err?.message || 'Erro ao salvar página');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza de que deseja excluir esta página?')) return;
    try {
      await pagesService.deletePage(id);
      setPages((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Erro ao excluir');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Páginas Institucionais
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gerencie páginas adicionais do site (ex: Termos de Uso, Privacidade, etc.).
          </p>
        </div>

        <Button onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          Nova Página
        </Button>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Pages List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-navy" />
          </div>
        ) : pages.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">Nenhuma página extra cadastrada</p>
            <p className="text-xs text-slate-400">Clique no botão "Nova Página" para começar.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-6">Título</th>
                <th className="py-3.5 px-4">Rota / URL</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Ordem</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pages.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-slate-900">{p.title}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">/pagina/{p.slug}</td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(p)}
                      title="Clique para alternar status da página"
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-transform hover:scale-105 ${
                        p.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {p.status === 'published' ? '● Publicada' : '○ Rascunho'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{p.sort_order}</td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <a
                      href={`/pagina/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-navy inline-block"
                      title="Visualizar"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-brand-navy"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-soft-2xl border border-slate-100 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingPage ? 'Editar Página' : 'Nova Página'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Título da Página *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => {
                      const t = e.target.value;
                      setForm({
                        ...form,
                        title: t,
                        slug: editingPage ? form.slug : t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                      });
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Slug (URL) *</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Conteúdo da Página (Texto ou HTML)</label>
                <textarea
                  rows={8}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm font-sans"
                  placeholder="Escreva o conteúdo da página..."
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Imagem de Destaque (URL opcional)</label>
                <input
                  type="text"
                  value={form.featured_image}
                  onChange={(e) => setForm({ ...form, featured_image: e.target.value })}
                  placeholder="/uploads/nome-da-imagem.jpg ou https://..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value="published">Publicada</option>
                    <option value="draft">Rascunho</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Ordem de Exibição</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <p className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">SEO da Página</p>
                <div>
                  <label className="block text-slate-600 mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={form.meta_title}
                    onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Meta Description</label>
                  <textarea
                    rows={2}
                    value={form.meta_description}
                    onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">URL Canônica (opcional)</label>
                  <input
                    type="text"
                    value={form.canonical_url}
                    onChange={(e) => setForm({ ...form, canonical_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Robots (Indexação)</label>
                  <select
                    value={form.robots}
                    onChange={(e) => setForm({ ...form, robots: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="index, follow">index, follow (Padrão - Permitir indexação e links)</option>
                    <option value="noindex, follow">noindex, follow (Ocultar dos motores de busca)</option>
                    <option value="noindex, nofollow">noindex, nofollow (Desativar rastreamento completo)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Página'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
