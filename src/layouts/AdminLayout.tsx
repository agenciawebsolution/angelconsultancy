import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileEdit, 
  FileText, 
  BookOpen, 
  PlusCircle, 
  FolderTree, 
  Image as ImageIcon, 
  Mail, 
  Search, 
  Settings, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavSection {
  title: string;
  items: {
    label: string;
    path: string;
    icon: React.ReactNode;
    badge?: string;
  }[];
}

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navSections: NavSection[] = [
    {
      title: 'Visão Geral',
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
      ],
    },
    {
      title: 'Conteúdo & CMS',
      items: [
        { label: 'Página Inicial (Home)', path: '/admin/conteudo/home', icon: <FileEdit className="w-5 h-5" /> },
        { label: 'Páginas Institucionais', path: '/admin/paginas', icon: <FileText className="w-5 h-5" /> },
      ],
    },
    {
      title: 'Blog',
      items: [
        { label: 'Todos os Artigos', path: '/admin/blog', icon: <BookOpen className="w-5 h-5" /> },
        { label: 'Novo Artigo', path: '/admin/blog/novo', icon: <PlusCircle className="w-5 h-5" /> },
        { label: 'Categorias', path: '/admin/blog/categorias', icon: <FolderTree className="w-5 h-5" /> },
      ],
    },
    {
      title: 'Arquivos & Atendimento',
      items: [
        { label: 'Biblioteca de Mídia', path: '/admin/media', icon: <ImageIcon className="w-5 h-5" /> },
        { label: 'Mensagens / Contatos', path: '/admin/contatos', icon: <Mail className="w-5 h-5" /> },
      ],
    },
    {
      title: 'Configurações',
      items: [
        { label: 'SEO & Integrações', path: '/admin/seo', icon: <Search className="w-5 h-5" /> },
        { label: 'Dados da Empresa', path: '/admin/configuracoes', icon: <Settings className="w-5 h-5" /> },
        { label: 'Usuários Admin', path: '/admin/usuarios', icon: <Users className="w-5 h-5" /> },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col antialiased">
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 bg-[#0F2144] text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-300 ease-in-out lg:static ${
            isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
          } ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
        >
          {/* Logo & Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-brand-navy-700/80 border border-brand-navy-500/30 flex items-center justify-center flex-shrink-0 text-white font-black text-lg">
                A
              </div>
              {!isSidebarCollapsed && (
                <div className="truncate">
                  <span className="font-bold text-white text-sm tracking-tight block truncate">Angel Consultancy</span>
                  <span className="text-[10px] text-brand-amber font-semibold uppercase tracking-wider block">Painel Administrativo</span>
                </div>
              )}
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
            {navSections.map((section, idx) => (
              <div key={idx} className="space-y-1">
                {!isSidebarCollapsed ? (
                  <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {section.title}
                  </p>
                ) : (
                  <div className="h-2" />
                )}

                {section.items.map((item) => {
                  const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      title={isSidebarCollapsed ? item.label : undefined}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? 'bg-brand-navy-600 text-white shadow-soft-sm font-bold'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                      } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
                    >
                      <span className={`flex-shrink-0 ${isActive ? 'text-brand-amber' : ''}`}>{item.icon}</span>
                      {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sidebar Footer with Collapse Button */}
          <div className="p-3 border-t border-slate-800/80 space-y-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              title="Visualizar site público"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors ${
                isSidebarCollapsed ? 'justify-center px-2' : ''
              }`}
            >
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
              {!isSidebarCollapsed && <span>Ver Site Público</span>}
            </a>

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex w-full items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              title={isSidebarCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Topbar */}
          <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between z-10 shadow-soft-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
                aria-label="Abrir menu lateral"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Shield className="w-4 h-4 text-brand-navy" />
                <span className="hidden sm:inline">Ambiente Administrativo Seguro</span>
              </div>
            </div>

            {/* Right: User Profile & Actions */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name || 'Administrador'}</p>
                <p className="text-[11px] text-slate-400 leading-tight">{user?.email}</p>
              </div>

              <div className="w-9 h-9 rounded-xl bg-brand-navy-50 text-brand-navy font-bold text-xs flex items-center justify-center border border-brand-navy-100">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-rose-200 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold transition-colors"
                title="Sair da conta"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </header>

          {/* Page Body */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
