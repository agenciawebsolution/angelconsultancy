import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Páginas Públicas
import { HomePage } from './pages/HomePage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { CustomPage } from './pages/CustomPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Páginas Administrativas
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ContactsPage } from './pages/admin/ContactsPage';
import { HomeContentPage } from './pages/admin/HomeContentPage';
import { PagesAdminPage } from './pages/admin/PagesAdminPage';
import { BlogAdminPage } from './pages/admin/BlogAdminPage';
import { BlogEditPage } from './pages/admin/BlogEditPage';
import { BlogCategoriesPage } from './pages/admin/BlogCategoriesPage';
import { MediaLibraryPage } from './pages/admin/MediaLibraryPage';
import { SeoSettingsPage } from './pages/admin/SeoSettingsPage';
import { CompanySettingsPage } from './pages/admin/CompanySettingsPage';
import { UsersPage } from './pages/admin/UsersPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <SettingsProvider>
            <Routes>
              {/* Rotas Públicas */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/pagina/:slug" element={<CustomPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Login Administrativo */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Painel Administrativo Protegido */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="contatos" element={<ContactsPage />} />
                <Route path="conteudo" element={<HomeContentPage />} />
                <Route path="conteudo/home" element={<HomeContentPage />} />
                <Route path="paginas" element={<PagesAdminPage />} />
                <Route path="blog" element={<BlogAdminPage />} />
                <Route path="blog/novo" element={<BlogEditPage />} />
                <Route path="blog/:id" element={<BlogEditPage />} />
                <Route path="categorias" element={<BlogCategoriesPage />} />
                <Route path="blog/categorias" element={<BlogCategoriesPage />} />
                <Route path="media" element={<MediaLibraryPage />} />
                <Route path="seo" element={<SeoSettingsPage />} />
                <Route path="configuracoes" element={<CompanySettingsPage />} />
                <Route path="usuarios" element={<UsersPage />} />
              </Route>
            </Routes>
          </SettingsProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
