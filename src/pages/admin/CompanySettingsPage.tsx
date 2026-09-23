import React, { useEffect, useState } from 'react';
import { settingsService } from '../../services/settingsService';
import type { SiteSettings } from '../../types/cms';
import { Button } from '../../components/ui/Button';
import { Building2, Save, Check, Share2, Loader2 } from 'lucide-react';

export const CompanySettingsPage: React.FC = () => {
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
      setFeedback('Dados da empresa e redes sociais atualizados com sucesso!');
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

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Configurações da Empresa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Informações institucionais, canais de contato e links de redes sociais.
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

      {/* Basic Company Info */}
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

      {/* Social Media Links */}
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
