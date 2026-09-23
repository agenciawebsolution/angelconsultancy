import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import type { BlogCategory } from '../../types/cms';
import { Button } from '../../components/ui/Button';
import { Plus, Trash2, ArrowLeft, Loader2, Check } from 'lucide-react';

export const BlogCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await blogService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      await blogService.createCategory(name.trim(), slug.trim() || undefined, description.trim() || undefined);
      setName('');
      setSlug('');
      setDescription('');
      setFeedback('Categoria criada com sucesso!');
      await loadCategories();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err?.message || 'Erro ao criar categoria');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza de que deseja excluir esta categoria? Os artigos associados permanecerão no banco.')) return;
    try {
      await blogService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setFeedback('Categoria excluída.');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err?.message || 'Erro ao excluir categoria');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/blog"
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
          title="Voltar para os artigos"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Categorias do Blog
          </h1>
          <p className="text-xs text-slate-500">Organize os artigos do seu blog por assuntos e temáticas.</p>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Add category form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-soft-sm space-y-4 h-fit">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Plus className="w-4 h-4 text-brand-navy" />
            <h3 className="text-sm font-bold text-slate-900">Nova Categoria</h3>
          </div>

          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Nome da Categoria *</label>
              <input
                type="text"
                required
                placeholder="Ex: Gestão Financeira"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Slug (URL amigável)</label>
              <input
                type="text"
                placeholder="gestao-financeira"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Descrição (Opcional)</label>
              <textarea
                rows={3}
                placeholder="Breve resumo dos tópicos abordados nesta categoria..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <Button type="submit" disabled={saving} className="w-full justify-center">
              {saving ? 'Adicionando...' : 'Adicionar Categoria'}
            </Button>
          </form>
        </div>

        {/* Right: Existing categories list */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-soft-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Categorias Cadastradas</h3>
          </div>

          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-brand-navy" />
            </div>
          ) : categories.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              Nenhuma categoria cadastrada.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {categories.map((c) => (
                <div key={c.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900">{c.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">slug: {c.slug}</p>
                    {c.description && <p className="text-xs text-slate-500 mt-1">{c.description}</p>}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold">
                      {c.posts_count ?? 0} {c.posts_count === 1 ? 'artigo' : 'artigos'}
                    </span>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Excluir categoria"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
