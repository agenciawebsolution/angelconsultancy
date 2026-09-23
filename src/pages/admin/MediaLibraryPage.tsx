import React, { useEffect, useState } from 'react';
import { mediaService } from '../../services/mediaService';
import type { MediaItem } from '../../types/cms';
import { 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  Loader2, 
  ExternalLink 
} from 'lucide-react';

export const MediaLibraryPage: React.FC = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [altText, setAltText] = useState('');

  const loadMedia = async () => {
    setLoading(true);
    try {
      const items = await mediaService.getMedia();
      setMedia(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const newItem = await mediaService.uploadMedia(file, altText || undefined);
      setMedia((prev) => [newItem, ...prev]);
      setAltText('');
    } catch (err: any) {
      alert(err?.message || 'Erro ao enviar arquivo.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.path);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza de que deseja excluir esta imagem?')) return;
    try {
      await mediaService.deleteMedia(id);
      setMedia((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Erro ao excluir imagem');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Biblioteca de Mídia
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Envie e gerencie imagens para usar em artigos do blog, seções da Home e páginas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy-700 text-white text-xs font-semibold shadow-soft-sm cursor-pointer transition-colors">
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enviando imagem...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Enviar Imagem</span>
              </>
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              disabled={uploading}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Media Grid */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft-sm">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-navy" />
          </div>
        ) : media.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">Nenhum arquivo na biblioteca</p>
            <p className="text-xs text-slate-400">Clique em "Enviar Imagem" para carregar a primeira imagem.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {media.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl border border-slate-100 overflow-hidden bg-slate-50 hover:shadow-soft-md transition-all flex flex-col justify-between"
              >
                <div className="aspect-square w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={item.path}
                    alt={item.alt_text || item.original_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleCopyUrl(item)}
                      className="p-2 rounded-xl bg-white text-slate-700 hover:text-brand-navy shadow-soft-sm"
                      title="Copiar URL"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white text-slate-700 hover:text-brand-navy shadow-soft-sm"
                      title="Abrir em nova aba"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-xl bg-white text-rose-600 hover:bg-rose-50 shadow-soft-sm"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-2.5 bg-white border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate" title={item.original_name}>
                    {item.original_name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {(item.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
