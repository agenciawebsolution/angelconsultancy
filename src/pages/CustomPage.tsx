import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pagesService } from '../services/pagesService';
import type { CmsPage } from '../types/cms';
import { DynamicHead } from '../components/common/DynamicHead';
import { Loader2, FileText, ArrowLeft } from 'lucide-react';

export const CustomPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<CmsPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let ignore = false;
    pagesService
      .getPageBySlug(slug)
      .then((res) => {
        if (!ignore) setPage(res);
      })
      .catch(console.error)
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-36 pb-32 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-navy" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="pt-36 pb-32 max-w-xl mx-auto px-4 text-center space-y-4">
        <FileText className="w-12 h-12 text-slate-300 mx-auto" />
        <h1 className="text-2xl font-bold text-slate-900">Página não encontrada</h1>
        <p className="text-sm text-slate-500">
          A página que você está procurando não existe ou foi despublicada.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-navy text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o Início</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-32 pb-20 lg:pb-28 bg-[#FAFBFD] min-h-screen">
      <DynamicHead
        title={page.meta_title || page.title}
        description={page.meta_description || undefined}
        canonicalUrl={page.canonical_url || undefined}
        robots={page.robots || undefined}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-navy"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Início</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {page.title}
          </h1>
        </div>

        {page.featured_image && (
          <div className="rounded-3xl overflow-hidden aspect-video bg-slate-100 border border-slate-100 shadow-soft-sm">
            <img src={page.featured_image} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-soft-sm">
          <div className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans space-y-4">
            {page.content}
          </div>
        </div>
      </div>
    </div>
  );
};
