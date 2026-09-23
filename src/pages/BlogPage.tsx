import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../services/blogService';
import type { BlogPost, BlogCategory } from '../types/cms';
import { DynamicHead } from '../components/common/DynamicHead';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Calendar, User, ArrowRight, Search, BookOpen, Loader2 } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      blogService.getPublishedPosts({
        page,
        limit: 9,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: search.trim() || undefined,
      }),
      blogService.getCategories(),
    ])
      .then(([resPosts, resCats]) => {
        setPosts(resPosts.posts || []);
        setTotalPages(resPosts.totalPages || 1);
        setCategories(resCats);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, selectedCategory, search]);

  return (
    <div className="pt-28 sm:pt-32 pb-20 lg:pb-28 bg-[#FAFBFD] min-h-screen">
      <DynamicHead
        title="Blog & Orientações"
        description="Artigos, dicas práticas e orientações sobre organização administrativa, fiscal e contábil na Bélgica."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionTitle
          tag="Nosso Blog"
          tagVariant="blue"
          title="Conhecimento claro para descomplicar sua rotina"
          subtitle="Acompanhe nossas publicações com explicações simples, artigos práticos e novidades relevantes."
        />

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-soft-sm">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setPage(1);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-brand-navy text-white shadow-soft-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Todos os Assuntos
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-brand-navy text-white shadow-soft-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar no blog..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy bg-slate-50/50"
            />
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-navy" />
          </div>
        ) : posts.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-slate-100 p-8">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <p className="text-base font-bold text-slate-800">Nenhum artigo publicado no momento</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Em breve publicaremos novidades e orientações detalhadas aqui.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-soft-sm hover:shadow-soft-xl hover:border-brand-navy-200 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Featured Image */}
                  <Link to={`/blog/${post.slug}`} className="block relative aspect-video bg-slate-100 overflow-hidden">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.image_alt || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-brand-navy-50 to-brand-amber-50">
                        <BookOpen className="w-10 h-10 text-brand-navy/30" />
                      </div>
                    )}
                    {post.category_name && (
                      <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-bold text-brand-navy shadow-soft-xs">
                        {post.category_name}
                      </span>
                    )}
                  </Link>

                  {/* Body */}
                  <div className="p-6 sm:p-7 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.published_at ? new Date(post.published_at).toLocaleDateString('pt-BR') : ''}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 truncate">
                        <User className="w-3.5 h-3.5" />
                        {post.author_name}
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-brand-navy transition-colors leading-snug">
                      <Link to={`/blog/${post.slug}`} className="line-clamp-2">
                        {post.title}
                      </Link>
                    </h2>

                    {post.excerpt && (
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer Link */}
                <div className="px-6 sm:px-7 pb-6 pt-2 border-t border-slate-100/60 mt-auto">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy group-hover:text-brand-navy-700 group-hover:translate-x-1 transition-all"
                  >
                    <span>Ler artigo completo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-6">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors shadow-soft-xs"
            >
              Anterior
            </button>
            <span className="text-xs text-slate-500 font-medium">
              Página {page} de {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors shadow-soft-xs"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
