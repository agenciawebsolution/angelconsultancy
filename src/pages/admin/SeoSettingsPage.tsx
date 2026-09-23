import React, { useEffect, useState } from 'react';
import { settingsService } from '../../services/settingsService';
import type { SiteSettings } from '../../types/cms';
import { Button } from '../../components/ui/Button';
import { Search, Save, Check, Code, LineChart, Loader2 } from 'lucide-react';

export const SeoSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      await settingsService.updateSettings(settings);
      setFeedback('Configurações de SEO e Scripts salvas com sucesso!');
      setTimeout(() => setFeedback(null), 3500);
    } catch (err: any) {
      alert(err?.message || 'Erro ao salvar configurações');
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
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            SEO & Integrações
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configurações de motores de busca, Google Analytics, Search Console e scripts de rastreamento.
          </p>
        </div>

        <Button type="submit" disabled={saving} icon={<Save className="w-4 h-4" />}>
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 1. SEO Global */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Search className="w-5 h-5 text-brand-navy" />
          <h3 className="text-base font-bold text-slate-900">SEO Geral do Website</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">Título Padrão do Site (Title Tag)</label>
            <input
              type="text"
              value={settings.seo_site_title || ''}
              onChange={(e) => handleChange('seo_site_title', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">Meta Description Padrão</label>
            <textarea
              rows={3}
              value={settings.seo_meta_description || ''}
              onChange={(e) => handleChange('seo_meta_description', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">URL Principal / Canônica Padrão</label>
            <input
              type="text"
              value={settings.seo_canonical_url || ''}
              onChange={(e) => handleChange('seo_canonical_url', e.target.value)}
              placeholder="https://www.angel-consultancy.be"
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Robots (Indexação)</label>
            <input
              type="text"
              value={settings.seo_robots || 'index, follow'}
              onChange={(e) => handleChange('seo_robots', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">Imagem Open Graph Padrão (Compartilhamento em Redes)</label>
            <input
              type="text"
              value={settings.seo_default_og_image || ''}
              onChange={(e) => handleChange('seo_default_og_image', e.target.value)}
              placeholder="/logo.png ou https://..."
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>
        </div>
      </div>

      {/* 2. Google Integrations */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <LineChart className="w-5 h-5 text-brand-navy" />
          <h3 className="text-base font-bold text-slate-900">Google Search Console & Analytics</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Google Analytics (GA4 Measurement ID)
            </label>
            <p className="text-[11px] text-slate-400 mb-1.5">
              Exemplo: <span className="font-mono">G-XXXXXXXXXX</span>. Quando vazio, o script não é carregado.
            </p>
            <input
              type="text"
              placeholder="G-XXXXXXXXXX"
              value={settings.google_analytics_id || ''}
              onChange={(e) => handleChange('google_analytics_id', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Google Search Console (Código de Verificação)
            </label>
            <p className="text-[11px] text-slate-400 mb-1.5">
              Valor do atributo <span className="font-mono">content</span> da meta tag de verificação do Google.
            </p>
            <input
              type="text"
              placeholder="token_de_verificacao_google"
              value={settings.google_search_console_token || ''}
              onChange={(e) => handleChange('google_search_console_token', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
            />
          </div>
        </div>
      </div>

      {/* 3. Custom Scripts (Head / Body / Footer) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Code className="w-5 h-5 text-brand-navy" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Scripts Personalizados (Head / Body / Footer)</h3>
            <p className="text-xs text-slate-500">Insira pixels, tags de conversão ou ferramentas de terceiros.</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Scripts no &lt;head&gt; (Meta Pixel, Google Tag Manager Head, etc.)
            </label>
            <textarea
              rows={4}
              placeholder="<!-- Inserir tags <script> ou <meta> aqui -->"
              value={settings.custom_scripts_head || ''}
              onChange={(e) => handleChange('custom_scripts_head', e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Scripts após abertura do &lt;body&gt; (Google Tag Manager NoScript, etc.)
            </label>
            <textarea
              rows={4}
              placeholder="<!-- Inserir tags <noscript> ou scripts do body aqui -->"
              value={settings.custom_scripts_body || ''}
              onChange={(e) => handleChange('custom_scripts_body', e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Scripts antes do fechamento do &lt;/body&gt; (Footer / Chatbots / Widgets)
            </label>
            <textarea
              rows={4}
              placeholder="<!-- Inserir scripts do rodapé aqui -->"
              value={settings.custom_scripts_footer || ''}
              onChange={(e) => handleChange('custom_scripts_footer', e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 bg-slate-50/50"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
