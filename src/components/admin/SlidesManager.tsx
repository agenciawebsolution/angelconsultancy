import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  X, 
  UploadCloud, 
  ImageIcon, 
  Eye, 
  EyeOff, 
  Sparkles,
  Monitor,
  Smartphone,
  RotateCcw,
  FolderOpen
} from 'lucide-react';
import { slidesService } from '../../services/slidesService';
import { mediaService } from '../../services/mediaService';
import { Button } from '../ui/Button';
import type { HomeSlide, HomeSlideInput, SlideStat } from '../../types/slide';
import type { MediaItem } from '../../types/cms';

export const SlidesManager: React.FC = () => {
  const [slides, setSlides] = useState<HomeSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<number | null>(null);

  // Framing Preview State (Desktop vs Mobile)
  const [framingPreviewMode, setFramingPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Media Library Modal
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  // Official Presets
  const officialPresets = [
    {
      title: 'Slide 1 — Executivo Internacional & Totem Angel',
      path: '/images/hero-slide-01.png',
      alt: 'Composição corporativa Angel Consultancy & Network com executivo internacional',
    },
    {
      title: 'Slide 2 — Consultora Executiva em Bruxelas',
      path: '/images/hero-slide-02.png',
      alt: 'Consultora executiva em terraço corporativo de Bruxelas',
    },
    {
      title: 'Slide 3 — Diretoria e Reunião Corporativa Europeia',
      path: '/images/hero-slide-03.png',
      alt: 'Diretoria executiva em reunião corporativa com vista panorâmica europeia',
    },
  ];

  // Form State
  const initialFormState: HomeSlideInput = {
    badge: 'ANGEL CONSULTANCY AND NETWORK',
    title: 'Assistência humana,',
    highlightText: 'simples e confiável',
    subtitle: 'Apoio humano, simples e confiável para você, sua organização financeira e administrativa. Orientação clara, acessível e verdadeira para tornar o seu mundo administrativo muito mais leve.',
    ctaPrimaryText: 'Fale conosco',
    ctaPrimaryLink: '#contato',
    ctaSecondaryText: 'Conheça nossos serviços',
    ctaSecondaryLink: '#servicos',
    imageUrl: '/images/hero-slide-01.png',
    imageAlt: 'Composição executiva corporativa Angel Consultancy & Network com executivo internacional',
    stats: [
      { label: 'Clientes atendidos na Europa', value: '+500' },
      { label: 'Satisfação dos clientes', value: '99%' },
      { label: 'De experiência no mercado europeu', value: '+10 anos' },
    ],
    sortOrder: 1,
    isActive: true,
    desktopPositionX: 75,
    desktopPositionY: 50,
    desktopZoom: 100,
    mobilePositionX: 65,
    mobilePositionY: 50,
    mobileZoom: 110,
  };

  const [formData, setFormData] = useState<HomeSlideInput>(initialFormState);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const loadSlides = async (showSpinner = true) => {
    if (showSpinner) {
      setLoading(true);
    }
    try {
      const data = await slidesService.getAllSlides();
      setSlides(data);
    } catch (err: any) {
      showNotification(err?.message || 'Erro ao carregar slides', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    slidesService
      .getAllSlides()
      .then((data) => setSlides(data))
      .catch((err) => showNotification(err?.message || 'Erro ao carregar slides', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const openLibraryModal = async () => {
    setIsLibraryModalOpen(true);
    setLoadingMedia(true);
    try {
      const items = await mediaService.getMedia();
      setMediaList(items);
    } catch {
      setMediaList([]);
    } finally {
      setLoadingMedia(false);
    }
  };

  const selectMediaItem = (path: string, altText?: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: path,
      imageAlt: altText || prev.imageAlt,
    }));
    setIsLibraryModalOpen(false);
    showNotification('Imagem selecionada da biblioteca!');
  };

  const handleOpenCreateModal = () => {
    setEditingSlideId(null);
    const nextOrder = slides.length > 0 ? Math.max(...slides.map((s) => s.sortOrder)) + 1 : 1;
    setFormData({
      ...initialFormState,
      sortOrder: nextOrder,
    });
    setFramingPreviewMode('desktop');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (slide: HomeSlide) => {
    setEditingSlideId(slide.id);
    setFormData({
      badge: slide.badge || '',
      title: slide.title,
      highlightText: slide.highlightText || '',
      subtitle: slide.subtitle || '',
      ctaPrimaryText: slide.ctaPrimaryText || '',
      ctaPrimaryLink: slide.ctaPrimaryLink || '',
      ctaSecondaryText: slide.ctaSecondaryText || '',
      ctaSecondaryLink: slide.ctaSecondaryLink || '',
      imageUrl: slide.imageUrl,
      imageAlt: slide.imageAlt || '',
      stats: slide.stats && slide.stats.length > 0 ? slide.stats : [
        { label: 'Clientes atendidos na Europa', value: '+500' },
        { label: 'Satisfação dos clientes', value: '99%' },
        { label: 'De experiência no mercado europeu', value: '+10 anos' },
      ],
      sortOrder: slide.sortOrder,
      isActive: slide.isActive,
      desktopPositionX: slide.desktopPositionX ?? 75,
      desktopPositionY: slide.desktopPositionY ?? 50,
      desktopZoom: slide.desktopZoom ?? 100,
      mobilePositionX: slide.mobilePositionX ?? 65,
      mobilePositionY: slide.mobilePositionY ?? 50,
      mobileZoom: slide.mobileZoom ?? 110,
    });
    setFramingPreviewMode('desktop');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSlideId(null);
  };

  const handleResetFraming = () => {
    setFormData((prev) => ({
      ...prev,
      desktopPositionX: 75,
      desktopPositionY: 50,
      desktopZoom: 100,
      mobilePositionX: 65,
      mobilePositionY: 50,
      mobileZoom: 110,
    }));
    showNotification('Enquadramento restaurado para os padrões recomendados.');
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showNotification('O título do slide é obrigatório.', 'error');
      return;
    }
    if (!formData.imageUrl.trim()) {
      showNotification('A URL da imagem é obrigatória.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingSlideId) {
        await slidesService.updateSlide(editingSlideId, formData);
        showNotification('Slide atualizado com sucesso!');
      } else {
        await slidesService.createSlide(formData);
        showNotification('Novo slide cadastrado com sucesso!');
      }
      setIsModalOpen(false);
      loadSlides();
    } catch (err: any) {
      showNotification(err?.message || 'Erro ao salvar o slide.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlide = async (id: number) => {
    if (!window.confirm('Tem certeza de que deseja excluir este slide?')) return;
    try {
      await slidesService.deleteSlide(id);
      showNotification('Slide removido!');
      setSlides((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      showNotification(err?.message || 'Erro ao excluir o slide.', 'error');
    }
  };

  const handleToggleActive = async (slide: HomeSlide) => {
    const newActive = !slide.isActive;
    try {
      await slidesService.toggleActive(slide.id);
      setSlides((prev) =>
        prev.map((s) => (s.id === slide.id ? { ...s, isActive: newActive } : s))
      );
      showNotification(`Slide ${newActive ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (err: any) {
      showNotification(err?.message || 'Erro ao alterar visibilidade.', 'error');
    }
  };

  const handleMoveSlide = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    const orders = newSlides.map((s, idx) => ({ id: s.id, sortOrder: idx + 1 }));
    setSlides(newSlides.map((s, idx) => ({ ...s, sortOrder: idx + 1 })));

    try {
      await slidesService.reorderSlides(orders);
      showNotification('Ordem dos slides atualizada!');
    } catch (err: any) {
      showNotification(err?.message || 'Erro ao salvar ordenação.', 'error');
      loadSlides();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const media = await mediaService.uploadMedia(file, formData.title || 'Slide Hero');
      setFormData((prev) => ({
        ...prev,
        imageUrl: media.path,
        imageAlt: media.alt_text || prev.imageAlt,
      }));
      showNotification('Imagem enviada e aplicada com sucesso!');
    } catch (err: any) {
      showNotification(err?.message || 'Erro ao fazer upload da imagem.', 'error');
    } finally {
      setUploadingImage(false);
      // Reset input value so same file can be re-selected if needed
      e.target.value = '';
    }
  };

  const updateStatItem = (index: number, field: keyof SlideStat, value: string) => {
    const nextStats = [...(formData.stats || [])];
    if (!nextStats[index]) {
      nextStats[index] = { label: '', value: '' };
    }
    nextStats[index] = { ...nextStats[index], [field]: value };
    setFormData({ ...formData, stats: nextStats });
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-3 transition-all ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {message.type === 'success' ? (
            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <X className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span className="font-semibold">{message.text}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-soft-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold tracking-wide uppercase mb-2">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            Carrossel Panorâmico
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0A162B] tracking-tight">
            Slides da Home
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Gerencie as capas cinematográficas da Angel Consultancy, ajustando textos, CTAs, métricas e o enquadramento independente para Desktop e Mobile.
          </p>
        </div>

        <Button
          onClick={handleOpenCreateModal}
          className="bg-[#0A162B] hover:bg-[#123A73] text-white flex items-center gap-2 shadow-soft-sm hover:shadow-soft-md"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Novo Slide</span>
        </Button>
      </div>

      {/* Slides Table/Card List */}
      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
          <div className="w-8 h-8 border-3 border-[#0A162B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Carregando slides...</p>
        </div>
      ) : slides.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Nenhum slide cadastrado</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Crie o primeiro slide para compor a capa panorâmica com os dados oficiais da consultoria.
          </p>
          <Button onClick={handleOpenCreateModal} className="bg-[#0A162B] text-white">
            Criar Primeiro Slide
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="p-5 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:bg-slate-50/60 transition-colors"
              >
                {/* Left: Thumbnail & Core Details */}
                <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
                  {/* Thumbnail */}
                  <div className="relative w-28 sm:w-36 h-20 sm:h-24 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 flex-shrink-0 shadow-soft-xs">
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      style={{
                        objectPosition: `${slide.desktopPositionX ?? 75}% ${slide.desktopPositionY ?? 50}%`,
                        transform: `scale(${(slide.desktopZoom ?? 100) / 100})`,
                      }}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[9px] font-bold text-white uppercase">
                      #{slide.sortOrder}
                    </div>
                  </div>

                  {/* Texts */}
                  <div className="min-w-0 space-y-1">
                    {slide.badge && (
                      <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#D4AF37] bg-slate-900 px-2 py-0.5 rounded-full">
                        {slide.badge}
                      </span>
                    )}
                    <h3 className="text-base sm:text-lg font-bold text-[#0A162B] truncate">
                      {slide.title} {slide.highlightText && <span className="text-[#1D5BD8]">{slide.highlightText}</span>}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400 font-mono">
                      <span>Desktop: {slide.desktopPositionX ?? 75}%/{slide.desktopPositionY ?? 50}%</span>
                      <span>•</span>
                      <span>Mobile: {slide.mobilePositionX ?? 65}%/{slide.mobilePositionY ?? 50}% (Zoom {slide.mobileZoom ?? 110}%)</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end lg:self-center flex-shrink-0">
                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-2">
                    <button
                      onClick={() => handleMoveSlide(index, 'up')}
                      disabled={index === 0}
                      title="Mover para cima"
                      className="p-2 rounded-xl text-slate-500 hover:text-[#0A162B] hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveSlide(index, 'down')}
                      disabled={index === slides.length - 1}
                      title="Mover para baixo"
                      className="p-2 rounded-xl text-slate-500 hover:text-[#0A162B] hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Toggle Active */}
                  <button
                    onClick={() => handleToggleActive(slide)}
                    title={slide.isActive ? 'Desativar slide' : 'Ativar slide'}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                      slide.isActive
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                        : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {slide.isActive ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="hidden sm:inline">Ativo</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                        <span className="hidden sm:inline">Inativo</span>
                      </>
                    )}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleOpenEditModal(slide)}
                    title="Editar slide"
                    className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 transition-colors flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Edit className="w-3.5 h-3.5 text-[#1D5BD8]" />
                    <span className="hidden sm:inline">Editar</span>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteSlide(slide.id)}
                    title="Excluir slide"
                    className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Modal de Criação / Edição de Slide                        */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-soft-2xl border border-slate-200 overflow-hidden my-8">
            
            {/* Modal Header */}
            <div className="p-6 sm:p-7 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0A162B] text-white flex items-center justify-center shadow-soft-xs">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0A162B]">
                    {editingSlideId ? 'Editar Slide do Hero' : 'Criar Novo Slide do Hero'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ajuste os dados editoriais, imagem e enquadramento independente.
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSlide} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* 1. Seleção e Upload da Imagem */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <label className="text-xs font-bold text-[#0A162B] uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                    Imagem Panorâmica de Fundo
                  </label>

                  <div className="flex items-center gap-2">
                    {/* Botão Biblioteca */}
                    <button
                      type="button"
                      onClick={openLibraryModal}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold shadow-soft-xs transition-colors"
                    >
                      <FolderOpen className="w-4 h-4 text-[#D4AF37]" />
                      <span>Biblioteca de Mídia</span>
                    </button>

                    {/* Botão Upload */}
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A162B] hover:bg-[#123A73] text-white text-xs font-semibold cursor-pointer shadow-soft-xs transition-colors">
                      <UploadCloud className="w-4 h-4 text-[#D4AF37]" />
                      <span>{uploadingImage ? 'Enviando...' : 'Fazer Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="/images/hero-slide-01.png ou /uploads/..."
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A162B] font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Caminho da imagem panorâmica. Use os botões acima para upload ou selecionar presets oficiais.
                  </p>
                </div>
              </div>

              {/* 2. Seção de Enquadramento Independente Desktop & Mobile */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0A162B] text-white border border-slate-700 shadow-soft-lg space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-700 pb-3">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Enquadramento da Imagem
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Ajuste a posição focal e o zoom separadamente para Desktop e Celular.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Mode Switcher Tabs */}
                    <div className="inline-flex p-1 rounded-xl bg-slate-800 border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setFramingPreviewMode('desktop')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          framingPreviewMode === 'desktop'
                            ? 'bg-[#1D5BD8] text-white shadow-soft-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span>Desktop</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFramingPreviewMode('mobile')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          framingPreviewMode === 'mobile'
                            ? 'bg-[#1D5BD8] text-white shadow-soft-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Mobile</span>
                      </button>
                    </div>

                    {/* Reset Button */}
                    <button
                      type="button"
                      onClick={handleResetFraming}
                      title="Restaurar padrão"
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 text-[#D4AF37]" />
                    </button>
                  </div>
                </div>

                {/* Live Interactive Preview Box */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>
                      Pré-visualização em tempo real — Modo {framingPreviewMode === 'desktop' ? 'Desktop (Widescreen 16:9)' : 'Mobile (Smartphone)'}
                    </span>
                    <span className="text-[#D4AF37]">
                      {framingPreviewMode === 'desktop'
                        ? `X: ${formData.desktopPositionX ?? 75}% | Y: ${formData.desktopPositionY ?? 50}% | Zoom: ${formData.desktopZoom ?? 100}%`
                        : `X: ${formData.mobilePositionX ?? 65}% | Y: ${formData.mobilePositionY ?? 50}% | Zoom: ${formData.mobileZoom ?? 110}%`}
                    </span>
                  </div>

                  {framingPreviewMode === 'desktop' ? (
                    /* Desktop 16:9 Frame */
                    <div className="w-full h-52 sm:h-64 rounded-xl overflow-hidden relative bg-slate-900 border border-slate-700 shadow-inner flex items-center justify-center">
                      {formData.imageUrl ? (
                        <img
                          src={formData.imageUrl}
                          alt="Preview Desktop"
                          style={{
                            objectPosition: `${formData.desktopPositionX ?? 75}% ${formData.desktopPositionY ?? 50}%`,
                            transform: `scale(${(formData.desktopZoom ?? 100) / 100})`,
                            transformOrigin: `${formData.desktopPositionX ?? 75}% ${formData.desktopPositionY ?? 50}%`,
                          }}
                          className="w-full h-full object-cover transition-all duration-75"
                        />
                      ) : (
                        <span className="text-slate-500 text-xs">Sem imagem selecionada</span>
                      )}
                    </div>
                  ) : (
                    /* Mobile Vertical Smartphone Mockup */
                    <div className="w-44 h-64 sm:w-48 sm:h-72 mx-auto rounded-3xl overflow-hidden relative bg-slate-900 border-4 border-slate-700 shadow-2xl flex items-center justify-center">
                      {formData.imageUrl ? (
                        <img
                          src={formData.imageUrl}
                          alt="Preview Mobile"
                          style={{
                            objectPosition: `${formData.mobilePositionX ?? 65}% ${formData.mobilePositionY ?? 50}%`,
                            transform: `scale(${(formData.mobileZoom ?? 110) / 100})`,
                            transformOrigin: `${formData.mobilePositionX ?? 65}% ${formData.mobilePositionY ?? 50}%`,
                          }}
                          className="w-full h-full object-cover transition-all duration-75"
                        />
                      ) : (
                        <span className="text-slate-500 text-xs">Sem imagem</span>
                      )}
                      <div className="absolute top-1.5 w-12 h-2.5 bg-slate-800 rounded-full" />
                    </div>
                  )}
                </div>

                {/* Sliders for Active Mode */}
                {framingPreviewMode === 'desktop' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                        <span>Posição Horizontal (X)</span>
                        <span className="text-[#D4AF37] font-mono">{formData.desktopPositionX ?? 75}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.desktopPositionX ?? 75}
                        onChange={(e) => setFormData({ ...formData, desktopPositionX: parseInt(e.target.value, 10) })}
                        className="w-full accent-[#D4AF37] cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                        <span>Posição Vertical (Y)</span>
                        <span className="text-[#D4AF37] font-mono">{formData.desktopPositionY ?? 50}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.desktopPositionY ?? 50}
                        onChange={(e) => setFormData({ ...formData, desktopPositionY: parseInt(e.target.value, 10) })}
                        className="w-full accent-[#D4AF37] cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                        <span>Zoom Desktop</span>
                        <span className="text-[#D4AF37] font-mono">{formData.desktopZoom ?? 100}%</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="150"
                        value={formData.desktopZoom ?? 100}
                        onChange={(e) => setFormData({ ...formData, desktopZoom: parseInt(e.target.value, 10) })}
                        className="w-full accent-[#D4AF37] cursor-pointer"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                        <span>Posição Horizontal Mobile (X)</span>
                        <span className="text-[#D4AF37] font-mono">{formData.mobilePositionX ?? 65}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.mobilePositionX ?? 65}
                        onChange={(e) => setFormData({ ...formData, mobilePositionX: parseInt(e.target.value, 10) })}
                        className="w-full accent-[#D4AF37] cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                        <span>Posição Vertical Mobile (Y)</span>
                        <span className="text-[#D4AF37] font-mono">{formData.mobilePositionY ?? 50}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.mobilePositionY ?? 50}
                        onChange={(e) => setFormData({ ...formData, mobilePositionY: parseInt(e.target.value, 10) })}
                        className="w-full accent-[#D4AF37] cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                        <span>Zoom Mobile</span>
                        <span className="text-[#D4AF37] font-mono">{formData.mobileZoom ?? 110}%</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="150"
                        value={formData.mobileZoom ?? 110}
                        onChange={(e) => setFormData({ ...formData, mobileZoom: parseInt(e.target.value, 10) })}
                        className="w-full accent-[#D4AF37] cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Textos do Slide */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tag Superior (Badge)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Ex: ANGEL CONSULTANCY AND NETWORK"
                    className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A162B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Destaque em Azul Royal
                  </label>
                  <input
                    type="text"
                    value={formData.highlightText}
                    onChange={(e) => setFormData({ ...formData, highlightText: e.target.value })}
                    placeholder="Ex: simples e confiável"
                    className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A162B]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Título Principal (Headline) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Assistência humana,"
                    className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A162B]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subtítulo / Descrição
                  </label>
                  <textarea
                    rows={3}
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Ex: Apoio humano, simples e confiável para você..."
                    className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A162B]"
                  />
                </div>
              </div>

              {/* 4. CTAs */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Botões de Ação (CTAs)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Botão Primário (Texto)
                    </label>
                    <input
                      type="text"
                      value={formData.ctaPrimaryText}
                      onChange={(e) => setFormData({ ...formData, ctaPrimaryText: e.target.value })}
                      placeholder="Fale conosco"
                      className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A162B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Botão Primário (Link)
                    </label>
                    <input
                      type="text"
                      value={formData.ctaPrimaryLink}
                      onChange={(e) => setFormData({ ...formData, ctaPrimaryLink: e.target.value })}
                      placeholder="#contato"
                      className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A162B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Botão Secundário (Texto)
                    </label>
                    <input
                      type="text"
                      value={formData.ctaSecondaryText}
                      onChange={(e) => setFormData({ ...formData, ctaSecondaryText: e.target.value })}
                      placeholder="Conheça nossos serviços"
                      className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A162B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Botão Secundário (Link)
                    </label>
                    <input
                      type="text"
                      value={formData.ctaSecondaryLink}
                      onChange={(e) => setFormData({ ...formData, ctaSecondaryLink: e.target.value })}
                      placeholder="#servicos"
                      className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A162B]"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Métricas Institucionais (3 itens) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Métricas Institucionais (3 Indicadores)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                          Valor #{idx + 1}
                        </label>
                        <input
                          type="text"
                          value={formData.stats?.[idx]?.value || ''}
                          onChange={(e) => updateStatItem(idx, 'value', e.target.value)}
                          placeholder="Ex: +500"
                          className="w-full p-1.5 text-xs font-bold rounded-lg border border-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                          Rótulo #{idx + 1}
                        </label>
                        <input
                          type="text"
                          value={formData.stats?.[idx]?.label || ''}
                          onChange={(e) => updateStatItem(idx, 'label', e.target.value)}
                          placeholder="Ex: Clientes atendidos"
                          className="w-full p-1.5 text-xs rounded-lg border border-slate-200"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Status e Ordem */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ordem de Exibição
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 1 })}
                    className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A162B]"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 rounded text-[#0A162B] focus:ring-[#0A162B]"
                    />
                    <span className="text-sm font-semibold text-slate-800">
                      Slide ativo (visível no carrossel da Home)
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button variant="outline" type="button" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-[#0A162B] hover:bg-[#123A73] text-white"
                >
                  {saving ? 'Salvando...' : editingSlideId ? 'Atualizar Slide' : 'Criar Slide'}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Modal da Biblioteca de Mídia (Presets e Uploads)          */}
      {/* ========================================================= */}
      {isLibraryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-soft-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <FolderOpen className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-lg font-bold text-[#0A162B]">Biblioteca de Mídia</h3>
              </div>
              <button
                onClick={() => setIsLibraryModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Presets Oficiais */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">
                  Imagens Panorâmicas Oficiais da Angel Consultancy
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {officialPresets.map((preset, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => selectMediaItem(preset.path, preset.alt)}
                      className="group p-2 rounded-2xl border border-slate-200 hover:border-[#1D5BD8] bg-slate-50 hover:bg-blue-50/40 text-left transition-all"
                    >
                      <div className="w-full h-24 rounded-xl overflow-hidden bg-slate-900 mb-2 border border-slate-200">
                        <img src={preset.path} alt={preset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-[#1D5BD8]">
                        {preset.title}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">{preset.path}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Uploads da Biblioteca */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">
                  Arquivos Enviados para a Biblioteca
                </h4>
                {loadingMedia ? (
                  <p className="text-xs text-slate-400 py-4 text-center">Carregando mídias...</p>
                ) : mediaList.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center bg-slate-50 rounded-2xl">
                    Nenhum upload registrado ainda. Faça upload pelo botão no formulário.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {mediaList.map((m) => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => selectMediaItem(m.path, m.alt_text || undefined)}
                        className="group p-2 rounded-2xl border border-slate-200 hover:border-[#1D5BD8] bg-slate-50 text-left transition-all"
                      >
                        <div className="w-full h-20 rounded-xl overflow-hidden bg-slate-900 mb-1.5 border border-slate-200">
                          <img src={m.path} alt={m.alt_text || m.filename} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-xs font-semibold text-slate-700 truncate">{m.original_name}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
