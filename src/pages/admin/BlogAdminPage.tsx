import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import type { BlogPost, BlogCategory } from '../../types/cms';
import { Plus, Search, Edit, Trash2, Globe, BookOpen, Loader2, Check } from 'lucide-react';

export const BlogAdminPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [, setTotalPages] = useState(1);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const [resPosts, cats] = await Promise.all([
        blogService.getAdminPosts({
          page,
          limit: 15,
          search: search.trim() || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
        }),
        blogService.getCategories(),
      ]);
      setPosts(resPosts.posts || []);
      setTotalPages(resPosts.totalPages || 1);
      setCategories(cats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [page, search, statusFilter, categoryFilter]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza de que deseja excluir este artigo?')) return;
    try {
      await blogService.deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setFeedback('Artigo excluído com sucesso.');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err?.message || 'Erro ao excluir artigo');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Artigos do Blog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gerenciamento completo de publicações, rascunhos e conteúdos editoriais.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/blog/categorias"
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            Categorias
          </Link>
          <Link
            to="/admin/blog/novo"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-navy hover:bg-brand-navy-700 text-white text-xs font-semibold shadow-soft-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Artigo</span>
          </Link>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-soft-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'published', label: 'Publicados' },
              { id: 'draft', label: 'Rascunhos' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  statusFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-soft-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="p-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white"
          >
            <option value="all">Todas as Categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar artigo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy"
          />
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-navy" />
          </div>
        ) : posts.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">Nenhum artigo encontrado</p>
            <p className="text-xs text-slate-400">Clique em "Novo Artigo" para redigir seu primeiro post.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-6">Título do Artigo</th>
                  <th className="py-3.5 px-4">Categoria</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Data</th>
                  <th className="py-3.5 px-4">Visualizações</th>
                  <th className="py-3.5 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 max-w-sm">
                      <div className="flex items-center gap-3">
                        {post.featured_image && (
                          <img
                            src={post.featured_image}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-slate-100 bg-slate-100"
                          />
                        )}
                        <div className="min-w-0">
                          <Link
                            to={`/admin/blog/${post.id}`}
                            className="font-bold text-slate-900 text-sm hover:text-brand-navy line-clamp-1 block"
                          >
                            {post.title}
                          </Link>
                          <span className="text-[11px] text-slate-400 font-mono block truncate">
                            /blog/{post.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-600 font-medium">
                      {post.category_name || 'Sem categoria'}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          post.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                      {post.published_at ? new Date(post.published_at).toLocaleDateString('pt-BR') : '—'}
                    </td>

                    <td className="py-4 px-4 text-slate-600 font-semibold">
                      {post.views_count ?? 0}
                    </td>

                    <td className="py-4 px-6 text-right space-x-1.5">
                      {post.status === 'published' && (
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg text-slate-400 hover:text-brand-navy hover:bg-slate-100 inline-block"
                          title="Ver artigo online"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                      <Link
                        to={`/admin/blog/${post.id}`}
                        className="p-2 rounded-lg text-slate-500 hover:text-brand-navy hover:bg-slate-100 inline-block"
                        title="Editar artigo"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Excluir artigo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
