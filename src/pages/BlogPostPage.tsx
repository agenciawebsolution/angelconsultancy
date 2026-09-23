import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogService } from '../services/blogService';
import type { BlogPost } from '../types/cms';
import { DynamicHead } from '../components/common/DynamicHead';
import { 
  Calendar, 
  User, 
  ArrowLeft, 
  Share2, 
  Check, 
  ArrowRight, 
  BookOpen, 
  Loader2, 
  MessageCircle
} from 'lucide-react';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    blogService
      .getPostBySlug(slug)
      .then((res) => {
        if (res && res.post) {
          setPost(res.post);
          setRelated(res.related || []);
        } else {
          setPost(null);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="pt-36 pb-32 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-navy" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-36 pb-32 max-w-xl mx-auto px-4 text-center space-y-4">
        <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
        <h1 className="text-2xl font-bold text-slate-900">Artigo não encontrado</h1>
        <p className="text-sm text-slate-500">
          O conteúdo que você procura pode ter sido removido ou está temporariamente indisponível.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-navy text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o Blog</span>
        </Link>
      </div>
    );
  }

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(post.title);

  return (
    <article className="pt-28 sm:pt-32 pb-20 lg:pb-28 bg-[#FAFBFD] min-h-screen">
      {/* Dynamic SEO */}
      <DynamicHead
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || undefined}
        ogTitle={post.og_title || post.title}
        ogDescription={post.og_description || post.excerpt || undefined}
        ogImage={post.og_image || post.featured_image || undefined}
        canonicalUrl={post.canonical_url || undefined}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-brand-navy transition-colors">Início</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-brand-navy transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-slate-900 truncate max-w-xs">{post.title}</span>
        </div>

        {/* Header Content */}
        <div className="space-y-4">
          {post.category_name && (
            <span className="inline-block px-3.5 py-1 rounded-full bg-brand-navy-50 text-brand-navy text-xs font-bold border border-brand-navy-100">
              {post.category_name}
            </span>
          )}

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight sm:leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200/70 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-brand-navy" />
                <strong className="text-slate-800">{post.author_name}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                {post.published_at ? new Date(post.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}
              </span>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5" /> Compartilhar:
              </span>
              <a
                href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 transition-colors"
                title="Compartilhar no WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 transition-colors"
                title="Compartilhar no LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.78v8.37H6.46v-8.37M7.85 6.46a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24" />
                </svg>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                title="Compartilhar no Twitter/X"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                title="Copiar link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="rounded-3xl overflow-hidden aspect-video bg-slate-100 shadow-soft-md border border-slate-100">
            <img
              src={post.featured_image}
              alt={post.image_alt || post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-soft-sm prose prose-slate max-w-none">
          <div className="text-slate-800 text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-sans space-y-4">
            {post.content}
          </div>
        </div>

        {/* Bottom CTA to Contact */}
        <div className="p-8 rounded-3xl bg-brand-navy text-white text-center space-y-4 shadow-soft-lg">
          <h3 className="text-xl sm:text-2xl font-bold">Precisa de orientação personalizada?</h3>
          <p className="text-slate-300 text-sm max-w-md mx-auto">
            Estamos prontos para acolher suas dúvidas e oferecer assistência clara e sem complicações.
          </p>
          <div className="pt-2">
            <a
              href="/#contato"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-amber hover:bg-brand-amber-600 text-slate-900 font-bold text-sm transition-colors shadow-soft-sm"
            >
              <span>Conversar com nossa equipe</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="pt-8 space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Artigos Relacionados</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/blog/${rel.slug}`}
                  className="group bg-white rounded-2xl p-4 border border-slate-100 shadow-soft-xs hover:shadow-soft-md transition-all space-y-2 block"
                >
                  {rel.featured_image && (
                    <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 mb-3">
                      <img src={rel.featured_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  )}
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-brand-navy line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{rel.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
