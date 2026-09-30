import React, { useEffect, useState, useRef } from 'react';
import { settingsService } from '../../services/settingsService';
import { mediaService } from '../../services/mediaService';
import { useSettings } from '../../context/SettingsContext';
import type { SiteSettings } from '../../types/cms';
import { Button } from '../../components/ui/Button';
import { 
  Building2, 
  Save, 
  Check, 
  Share2, 
  Loader2, 
  Image as ImageIcon, 
  Upload, 
  RotateCcw, 
  AlertCircle
} from 'lucide-react';

export const CompanySettingsPage: React.FC = () => {
  const { refreshSettings } = useSettings();
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Estados de upload independentes
  const [uploadingHeader, setUploadingHeader] = useState(false);
  const [uploadingFooter, setUploadingFooter] = useState(false);

  const headerFileInputRef = useRef<HTMLInputElement>(null);
  const footerFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    settingsService
      .getAllSettings()
      .then(setSettings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const validateLogoFile = (file: File): string | null => {
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'webp', 'svg'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !allowedExtensions.includes(ext)) {
      return 'Formato de imagem não suportado. Por favor, envie PNG, SVG, WEBP ou JPG.';
    }
    const maxBytes = 12 * 1024 * 1024; // 12 MB
    if (file.size > maxBytes) {
      return 'O arquivo excede o limite máximo permitido de 12 MB.';
    }
    return null;
  };

  // Upload independente para Logo do Header / Menu
  const handleUploadHeaderLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const validationError = validateLogoFile(file);
    if (validationError) {
      setUploadError(validationError);
      if (headerFileInputRef.current) headerFileInputRef.current.value = '';
      return;
    }

    setUploadingHeader(true);
    try {
      const media = await mediaService.uploadMedia(file, 'Logo Header e Menu Mobile', 'Logo Header Horizontal');
      handleChange('logo_header', media.path);
      setFeedback('Logo do Header enviada com sucesso! Clique em "Salvar Alterações" para aplicar em definitivo.');
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setUploadError(err?.message || 'Erro ao realizar upload da Logo do Header.');
    } finally {
      setUploadingHeader(false);
      if (headerFileInputRef.current) headerFileInputRef.current.value = '';
    }
  };

  // Upload independente para Logo do Footer
  const handleUploadFooterLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const validationError = validateLogoFile(file);
    if (validationError) {
      setUploadError(validationError);
      if (footerFileInputRef.current) footerFileInputRef.current.value = '';
      return;
    }

    setUploadingFooter(true);
    try {
      const media = await mediaService.uploadMedia(file, 'Logo Footer Rodapé', 'Logo Footer Vertical');
      handleChange('logo_footer', media.path);
      setFeedback('Logo do Footer enviada com sucesso! Clique em "Salvar Alterações" para aplicar em definitivo.');
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setUploadError(err?.message || 'Erro ao realizar upload da Logo do Footer.');
    } finally {
      setUploadingFooter(false);
      if (footerFileInputRef.current) footerFileInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    setUploadError(null);
    try {
      await settingsService.updateSettings(settings);
      await refreshSettings();
      setFeedback('Configurações e Identidade Visual salvas com sucesso!');
      setTimeout(() => setFeedback(null), 3500);
    } catch (err: any) {
      alert(err?.message || 'Erro ao salvar informações');
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

  const currentHeaderLogo = settings.logo_header || '/logo.png';
  const currentFooterLogo = settings.logo_footer || '/logo.png';

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Configurações da Empresa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Identidade visual independente, informações institucionais, canais de contato e redes sociais.
          </p>
        </div>

        <Button type="submit" disabled={saving} icon={<Save className="w-4 h-4" />}>
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {uploadError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 1. IDENTIDADE VISUAL: LOGOS INDEPENDENTES                           */}
      {/* ==================================================================== */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ImageIcon className="w-5 h-5 text-brand-navy" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Identidade Visual (Logos do Site)</h3>
            <p className="text-xs text-slate-500">
              Gerencie individualmente as versões das logos para o Header/Menu e Footer, sem que uma substitua a outra.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card: Logo Header / Menu */}
          <div className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-sm font-bold text-slate-900">Logo do Header & Menu Mobile</span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 tracking-wide uppercase">
                  Versão Horizontal
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Usada no Header Desktop e no Menu Gaveta Mobile. Versão com o símbolo/bonequinho ao lado do texto.
              </p>

              {/* Preview Box */}
              <div className="w-full h-32 bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-center relative overflow-hidden shadow-soft-xs">
                {uploadingHeader ? (
                  <div className="flex flex-col items-center gap-2 text-brand-navy">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-xs font-semibold">Enviando imagem...</span>
                  </div>
                ) : (
                  <img
                    src={currentHeaderLogo}
                    alt="Preview Logo Header"
                    className="max-h-20 max-w-full object-contain"
                  />
                )}
              </div>

              {/* Informações da Origem */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-200">
                <span className="truncate max-w-[240px] font-mono text-slate-700">
                  {currentHeaderLogo}
                </span>
                {currentHeaderLogo === '/logo.png' ? (
                  <span className="text-slate-400 font-medium">Padrão original</span>
                ) : (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> Personalizada
                  </span>
                )}
              </div>
            </div>

            {/* Ações Header Logo */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/70">
              <input
                ref={headerFileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleUploadHeaderLogo}
                className="hidden"
                id="header-logo-upload"
              />
              <label
                htmlFor="header-logo-upload"
                className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-soft-xs ${
                  uploadingHeader
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-brand-navy hover:bg-brand-navy-900 text-white active:scale-95'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingHeader ? 'Enviando...' : 'Fazer Upload / Substituir'}</span>
              </label>

              {currentHeaderLogo !== '/logo.png' && (
                <button
                  type="button"
                  onClick={() => handleChange('logo_header', '/logo.png')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                  title="Restaurar logo padrão original do sistema"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Padrão</span>
                </button>
              )}
            </div>
          </div>

          {/* Card: Logo Footer */}
          <div className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-sm font-bold text-slate-900">Logo do Footer / Rodapé</span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 tracking-wide uppercase">
                  Versão Vertical
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Usada exclusivamente no Footer de todas as páginas. Versão com o símbolo/bonequinho acima do texto.
              </p>

              {/* Preview Box - Fundo escuro imitando o rodapé real */}
              <div className="w-full h-32 bg-[#0A162B] rounded-xl border border-slate-700/80 p-4 flex items-center justify-center relative overflow-hidden shadow-inner">
                {uploadingFooter ? (
                  <div className="flex flex-col items-center gap-2 text-white">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-xs font-semibold">Enviando imagem...</span>
                  </div>
                ) : (
                  <div className="p-1.5 bg-white/95 rounded-xl shadow-soft-sm flex items-center justify-center">
                    <img
                      src={currentFooterLogo}
                      alt="Preview Logo Footer"
                      className="max-h-16 max-w-full object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Informações da Origem */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-200">
                <span className="truncate max-w-[240px] font-mono text-slate-700">
                  {currentFooterLogo}
                </span>
                {currentFooterLogo === '/logo.png' ? (
                  <span className="text-slate-400 font-medium">Padrão original</span>
                ) : (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> Personalizada
                  </span>
                )}
              </div>
            </div>

            {/* Ações Footer Logo */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/70">
              <input
                ref={footerFileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleUploadFooterLogo}
                className="hidden"
                id="footer-logo-upload"
              />
              <label
                htmlFor="footer-logo-upload"
                className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-soft-xs ${
                  uploadingFooter
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-brand-navy hover:bg-brand-navy-900 text-white active:scale-95'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingFooter ? 'Enviando...' : 'Fazer Upload / Substituir'}</span>
              </label>

              {currentFooterLogo !== '/logo.png' && (
                <button
                  type="button"
                  onClick={() => handleChange('logo_footer', '/logo.png')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                  title="Restaurar logo padrão original do sistema"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Padrão</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. IDENTIFICAÇÃO & CONTATOS OFICIAIS                                */}
      {/* ==================================================================== */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Building2 className="w-5 h-5 text-brand-navy" />
          <h3 className="text-base font-bold text-slate-900">Identificação & Contatos Oficiais</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">Nome da Empresa</label>
            <input
              type="text"
              value={settings.company_name || ''}
              onChange={(e) => handleChange('company_name', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-bold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">Descrição Breve / Slogan</label>
            <textarea
              rows={2}
              value={settings.company_description || ''}
              onChange={(e) => handleChange('company_description', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Telefone Principal</label>
            <input
              type="text"
              value={settings.company_phone || ''}
              onChange={(e) => handleChange('company_phone', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">E-mail de Contato</label>
            <input
              type="email"
              value={settings.company_email || ''}
              onChange={(e) => handleChange('company_email', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">Link Direto do WhatsApp (com mensagem personalizada)</label>
            <input
              type="url"
              value={settings.company_whatsapp_url || ''}
              onChange={(e) => handleChange('company_whatsapp_url', e.target.value)}
              placeholder="https://wa.me/32492319741?text=..."
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">Localização & Formato de Atendimento</label>
            <input
              type="text"
              value={settings.company_location || ''}
              onChange={(e) => handleChange('company_location', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. REDES SOCIAIS                                                    */}
      {/* ==================================================================== */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Share2 className="w-5 h-5 text-brand-navy" />
          <h3 className="text-base font-bold text-slate-900">Redes Sociais</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">LinkedIn (URL)</label>
            <input
              type="url"
              placeholder="https://linkedin.com/company/..."
              value={settings.company_social_linkedin || ''}
              onChange={(e) => handleChange('company_social_linkedin', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Instagram (URL)</label>
            <input
              type="url"
              placeholder="https://instagram.com/..."
              value={settings.company_social_instagram || ''}
              onChange={(e) => handleChange('company_social_instagram', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Facebook (URL)</label>
            <input
              type="url"
              placeholder="https://facebook.com/..."
              value={settings.company_social_facebook || ''}
              onChange={(e) => handleChange('company_social_facebook', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
