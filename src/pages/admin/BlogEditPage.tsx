import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import type { BlogCategory } from '../../types/cms';
import { Button } from '../../components/ui/Button';
import { 
  Save, 
  ArrowLeft, 
  Search,
  Loader2, 
  Check, 
  ExternalLink 
} from 'lucide-react';

export const BlogEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'novo';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category_id: '' as string | number,
    author_name: 'Angel Consultancy',
    status: 'draft' as 'draft' | 'published',
    published_at: '',
    featured_image: '',
    image_alt: '',
    meta_title: '',
    meta_description: '',
    focus_keyword: '',
    canonical_url: '',
    og_title: '',
    og_description: '',
    og_image: '',
    twitter_card: 'summary_large_image',
  });

  useEffect(() => {
    blogService.getCategories().then(setCategories).catch(console.error);

    if (!isNew) {
      blogService
        .getPostById(Number(id))
        .then((post) => {
          if (post) {
            setForm({
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt || '',
              content: post.content,
              category_id: post.category_id || '',
              author_name: post.author_name || 'Angel Consultancy',
              status: post.status,
              published_at: post.published_at ? post.published_at.slice(0, 16) : '',
              featured_image: post.featured_image || '',
              image_alt: post.image_alt || '',
              meta_title: post.meta_title || '',
              meta_description: post.meta_description || '',
              focus_keyword: post.focus_keyword || '',
              canonical_url: post.canonical_url || '',
              og_title: post.og_title || '',
              og_description: post.og_description || '',
              og_image: post.og_image || '',
              twitter_card: post.twitter_card || 'summary_large_image',
            });
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const handleTitleChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: isNew
        ? val
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        : prev.slug,
    }));
  };

  const handleSubmit = async (statusOverride?: 'draft' | 'published') => {
    if (!form.title.trim()) {
      alert('Por favor, informe o título do artigo.');
      return;
    }

    setSaving(true);
    setFeedback(null);

    const postStatus = statusOverride || form.status;
    const payload = {
      ...form,
      status: postStatus,
      category_id: form.category_id ? Number(form.category_id) : null,
      published_at: postStatus === 'published' && !form.published_at
        ? new Date().toISOString().slice(0, 19).replace('T', ' ')
        : form.published_at || null,
    };

    try {
      if (isNew) {
        const res = await blogService.createPost(payload);
        setFeedback('Artigo criado com sucesso!');
        setTimeout(() => navigate(`/admin/blog/${res.id}`), 1200);
      } else {
        await blogService.updatePost(Number(id), payload);
        setForm((prev) => ({ ...prev, status: postStatus }));
        setFeedback('Artigo atualizado com sucesso!');
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err: any) {
      alert(err?.message || 'Erro ao salvar artigo');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-navy" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/blog"
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
            title="Voltar para a listagem"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {isNew ? 'Criar Novo Artigo' : 'Editar Artigo'}
            </h1>
            <p className="text-xs text-slate-500">
              {form.slug ? `/blog/${form.slug}` : 'Defina título e conteúdo'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNew && form.status === 'published' && (
            <a
              href={`/blog/${form.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Online</span>
            </a>
          )}
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSubmit('draft')}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
          >
            Salvar Rascunho
          </button>
          <Button
            type="button"
            disabled={saving}
            onClick={() => handleSubmit('published')}
            icon={<Save className="w-4 h-4" />}
          >
            {saving ? 'Publicando...' : 'Publicar Artigo'}
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Grid: Content (8 cols) + Meta Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Title, Content, Excerpt, SEO */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft-sm space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Título do Artigo *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Como organizar seus documentos fiscais na Bélgica"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Slug (URL amigável) *
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Resumo / Subtítulo
              </label>
              <textarea
                rows={2}
                placeholder="Uma síntese atrativa sobre o assunto do artigo..."
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Conteúdo Completo do Artigo *
              </label>
              <p className="text-[11px] text-slate-400 mb-2">
                Suporta quebras de linha normais ou marcação HTML simples.
              </p>
              <textarea
                rows={16}
                required
                placeholder="Escreva o texto completo do seu artigo..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full p-4 rounded-2xl border border-slate-200 text-sm font-sans leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-navy"
              />
            </div>
          </div>

          {/* SEO Individual Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Search className="w-4 h-4 text-brand-navy" />
              <h3 className="text-sm font-bold text-slate-900">SEO do Artigo (Otimização para Busca)</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Meta Title (Título para Google)
                </label>
                <input
                  type="text"
                  placeholder={form.title || 'Título SEO'}
                  value={form.meta_title}
                  onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Meta Description (Descrição no Google)
                </label>
                <textarea
                  rows={2}
                  placeholder={form.excerpt || 'Descrição breve para os resultados de busca...'}
                  value={form.meta_description}
                  onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Palavra-Chave Principal
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: impostos Bélgica"
                    value={form.focus_keyword}
                    onChange={(e) => setForm({ ...form, focus_keyword: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    URL Canônica (Opcional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.angel-consultancy.be/blog/..."
                    value={form.canonical_url}
                    onChange={(e) => setForm({ ...form, canonical_url: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Publishing, Category, Media */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Publishing Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Status da Publicação
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Estado Atual</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                <option value="draft">Rascunho (Privado)</option>
                <option value="published">Publicado (Visível no site)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Autor</label>
              <input
                type="text"
                value={form.author_name}
                onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Data de Publicação</label>
              <input
                type="datetime-local"
                value={form.published_at}
                onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          {/* Category Selector */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Categoria
              </h3>
              <Link to="/admin/blog/categorias" className="text-[11px] text-brand-navy hover:underline font-semibold">
                Gerenciar
              </Link>
            </div>

            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
            >
              <option value="">Sem categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Imagem Destacada
            </h3>

            {form.featured_image && (
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200">
                <img src={form.featured_image} alt="" className="w-full h-full object-cover" />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">URL da Imagem</label>
              <input
                type="text"
                placeholder="https://... ou /uploads/..."
                value={form.featured_image}
                onChange={(e) => setForm({ ...form, featured_image: e.target.value })}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Texto Alternativo (ALT)</label>
              <input
                type="text"
                placeholder="Descrição da imagem para acessibilidade"
                value={form.image_alt}
                onChange={(e) => setForm({ ...form, image_alt: e.target.value })}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <p className="text-[11px] text-slate-400">
              Você pode enviar novas imagens na <Link to="/admin/media" className="text-brand-navy font-semibold underline">Biblioteca de Mídia</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
