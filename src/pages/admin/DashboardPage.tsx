import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  MailWarning, 
  Calendar, 
  BookOpen, 
  FileEdit, 
  Layers, 
  ArrowRight, 
  Loader2, 
  ExternalLink,
  Plus,
  PlusCircle,
  Search,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { dashboardService, type DashboardDataResponse } from '../../services/dashboardService';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardDataResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getDashboardData()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-navy" />
      </div>
    );
  }

  const stats = data?.stats;

  const statCards = [
    {
      title: 'Total de Mensagens',
      value: stats?.total_messages ?? 0,
      icon: <Mail className="w-5 h-5 text-brand-navy" />,
      bgIcon: 'bg-brand-navy-50',
      link: '/admin/contatos',
      desc: 'Histórico completo',
    },
    {
      title: 'Mensagens Não Lidas',
      value: stats?.unread_messages ?? 0,
      icon: <MailWarning className="w-5 h-5 text-amber-600" />,
      bgIcon: 'bg-amber-50',
      link: '/admin/contatos?status=unread',
      desc: 'Aguardando atendimento',
      highlight: (stats?.unread_messages ?? 0) > 0,
    },
    {
      title: 'Mensagens Deste Mês',
      value: stats?.this_month_messages ?? 0,
      icon: <Calendar className="w-5 h-5 text-blue-600" />,
      bgIcon: 'bg-blue-50',
      link: '/admin/contatos',
      desc: 'Recebidas recentemente',
    },
    {
      title: 'Artigos Publicados',
      value: stats?.published_posts ?? 0,
      icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
      bgIcon: 'bg-emerald-50',
      link: '/admin/blog',
      desc: 'Visíveis no blog',
    },
    {
      title: 'Artigos em Rascunho',
      value: stats?.draft_posts ?? 0,
      icon: <FileEdit className="w-5 h-5 text-slate-600" />,
      bgIcon: 'bg-slate-100',
      link: '/admin/blog',
      desc: 'Em edição',
    },
    {
      title: 'Páginas Ativas',
      value: stats?.total_pages ?? 0,
      icon: <Layers className="w-5 h-5 text-indigo-600" />,
      bgIcon: 'bg-indigo-50',
      link: '/admin/paginas',
      desc: 'Páginas dinâmicas',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Visão Geral
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Acompanhe em tempo real as métricas do site, contatos recebidos e publicações do blog.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/blog/novo"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-navy hover:bg-brand-navy-700 text-white text-xs font-semibold shadow-soft-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Artigo</span>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-semibold shadow-soft-xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ver Site</span>
          </a>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-amber" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Ações Rápidas</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Link
            to="/admin/blog/novo"
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-brand-navy-50/50 hover:bg-brand-navy hover:text-white text-brand-navy border border-brand-navy-100/60 transition-all duration-150 group"
          >
            <div className="w-8 h-8 rounded-xl bg-white group-hover:bg-white/20 flex items-center justify-center flex-shrink-0 shadow-soft-xs">
              <PlusCircle className="w-4 h-4 group-hover:text-white text-brand-navy" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold leading-tight truncate">Nova Publicação</p>
              <p className="text-[10px] text-slate-400 group-hover:text-slate-200 leading-tight">Novo artigo</p>
            </div>
          </Link>

          <Link
            to="/admin/contatos"
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 hover:bg-brand-navy hover:text-white text-slate-700 border border-slate-200/60 transition-all duration-150 group"
          >
            <div className="w-8 h-8 rounded-xl bg-white group-hover:bg-white/20 flex items-center justify-center flex-shrink-0 shadow-soft-xs">
              <Mail className="w-4 h-4 group-hover:text-white text-brand-navy" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold leading-tight truncate">Ver Mensagens</p>
              <p className="text-[10px] text-slate-400 group-hover:text-slate-200 leading-tight">Leads & contatos</p>
            </div>
          </Link>

          <Link
            to="/admin/conteudo"
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 hover:bg-brand-navy hover:text-white text-slate-700 border border-slate-200/60 transition-all duration-150 group"
          >
            <div className="w-8 h-8 rounded-xl bg-white group-hover:bg-white/20 flex items-center justify-center flex-shrink-0 shadow-soft-xs">
              <FileEdit className="w-4 h-4 group-hover:text-white text-brand-navy" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold leading-tight truncate">Editar Conteúdo</p>
              <p className="text-[10px] text-slate-400 group-hover:text-slate-200 leading-tight">Home & seções</p>
            </div>
          </Link>

          <Link
            to="/admin/seo"
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 hover:bg-brand-navy hover:text-white text-slate-700 border border-slate-200/60 transition-all duration-150 group"
          >
            <div className="w-8 h-8 rounded-xl bg-white group-hover:bg-white/20 flex items-center justify-center flex-shrink-0 shadow-soft-xs">
              <Search className="w-4 h-4 group-hover:text-white text-brand-navy" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold leading-tight truncate">SEO & Metatags</p>
              <p className="text-[10px] text-slate-400 group-hover:text-slate-200 leading-tight">Google & Analytics</p>
            </div>
          </Link>

          <Link
            to="/admin/media"
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 hover:bg-brand-navy hover:text-white text-slate-700 border border-slate-200/60 transition-all duration-150 group col-span-2 sm:col-span-1"
          >
            <div className="w-8 h-8 rounded-xl bg-white group-hover:bg-white/20 flex items-center justify-center flex-shrink-0 shadow-soft-xs">
              <ImageIcon className="w-4 h-4 group-hover:text-white text-brand-navy" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold leading-tight truncate">Biblioteca de Mídia</p>
              <p className="text-[10px] text-slate-400 group-hover:text-slate-200 leading-tight">Imagens & uploads</p>
            </div>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((card, idx) => (
          <Link
            key={idx}
            to={card.link}
            className={`p-5 sm:p-6 rounded-3xl bg-white border transition-all duration-200 hover:shadow-soft-md group ${
              card.highlight
                ? 'border-amber-200 bg-amber-50/20'
                : 'border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-11 h-11 rounded-2xl ${card.bgIcon} flex items-center justify-center`}>
                {card.icon}
              </div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-brand-navy transition-colors">
                {card.value}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">{card.title}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* 2-Column Section: Recent Contacts & Recent Blog Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Messages */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Mensagens Recentes</h3>
              <p className="text-xs text-slate-500">Últimas solicitações enviadas pelo formulário</p>
            </div>
            <Link
              to="/admin/contatos"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-navy hover:underline"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {!data?.recent_messages || data.recent_messages.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Nenhuma mensagem registrada até o momento.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {data.recent_messages.map((msg) => (
                <Link
                  key={msg.id}
                  to={`/admin/contatos?id=${msg.id}`}
                  className="py-3.5 flex items-start justify-between gap-3 hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate group-hover:text-brand-navy">
                        {msg.full_name}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          msg.status === 'unread'
                            ? 'bg-amber-100 text-amber-800'
                            : msg.status === 'in_review'
                            ? 'bg-blue-100 text-blue-800'
                            : msg.status === 'replied'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {msg.status === 'unread'
                          ? 'Não lida'
                          : msg.status === 'in_review'
                          ? 'Em análise'
                          : msg.status === 'replied'
                          ? 'Respondida'
                          : 'Arquivada'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{msg.email} • {msg.phone}</p>
                    <p className="text-xs text-slate-600 line-clamp-1 italic">"{msg.message}"</p>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap pt-1">
                    {new Date(msg.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent Articles */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Artigos Recentes</h3>
              <p className="text-xs text-slate-500">Últimos artigos cadastrados</p>
            </div>
            <Link
              to="/admin/blog"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-navy hover:underline"
            >
              <span>Gerenciar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {!data?.recent_posts || data.recent_posts.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Nenhum artigo cadastrado ainda.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {data.recent_posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/admin/blog/${post.id}`}
                  className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate group-hover:text-brand-navy">
                      {post.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      post.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
