import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Loader2, 
  Image as ImageIcon, 
  Check, 
  X,
  UploadCloud,
  Sparkles
} from 'lucide-react';
import { slidesService } from '../../services/slidesService';
import { mediaService } from '../../services/mediaService';
import type { HomeSlide, HomeSlideInput, SlideStat } from '../../types/slide';
import { Button } from '../ui/Button';

export const SlidesManager: React.FC = () => {
  const [slides, setSlides] = useState<HomeSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<number | null>(null);

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
    imageUrl: '/images/hero-executive-1.jpg',
    imageAlt: 'Executivo corporativo internacional em terno azul marinho',
    stats: [
      { label: 'Clientes atendidos na Europa', value: '+500' },
      { label: 'Satisfação dos clientes', value: '99%' },
      { label: 'De experiência no mercado europeu', value: '+10 anos' },
    ],
    sortOrder: 1,
    isActive: true,
  };

  const [formData, setFormData] = useState<HomeSlideInput>(initialFormState);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
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

  const handleOpenCreateModal = () => {
    setEditingSlideId(null);
    const nextOrder = slides.length > 0 ? Math.max(...slides.map((s) => s.sortOrder)) + 1 : 1;
    setFormData({
      ...initialFormState,
      sortOrder: nextOrder,
    });
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
        { label: 'Anos de Atuação', value: '+10' },
        { label: 'Atendimento', value: 'Multilíngue' },
        { label: 'Clientes Satisfeitos', value: '100%' },
      ],
      sortOrder: slide.sortOrder,
      isActive: slide.isActive,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSlideId(null);
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('O título do slide é obrigatório.');
      return;
    }
    if (!formData.imageUrl.trim()) {
      alert('A URL da imagem é obrigatória.');
      return;
    }

    setSaving(true);
    try {
      if (editingSlideId) {
        await slidesService.updateSlide(editingSlideId, formData);
        showNotification('Slide atualizado com sucesso!');
      } else {
        await slidesService.createSlide(formData);
        showNotification('Novo slide criado com sucesso!');
      }
      handleCloseModal();
      await loadSlides();
    } catch (err: any) {
      showNotification(err?.message || 'Erro ao salvar slide.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (slide: HomeSlide) => {
    try {
      const newStatus = await slidesService.toggleActive(slide.id);
      setSlides((prev) =>
        prev.map((s) => (s.id === slide.id ? { ...s, isActive: newStatus } : s))
      );
      showNotification(`Slide ${newStatus ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (err: any) {
      showNotification(err?.message || 'Erro ao alterar status.', 'error');
    }
  };

  const handleDelete = async (slide: HomeSlide) => {
    if (!window.confirm(`Tem certeza que deseja excluir o slide "${slide.title}"?`)) {
      return;
    }
    try {
      await slidesService.deleteSlide(slide.id);
      showNotification('Slide excluído com sucesso!');
      setSlides((prev) => prev.filter((s) => s.id !== slide.id));
    } catch (err: any) {
      showNotification(err?.message || 'Erro ao excluir slide.', 'error');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    // Atualiza ordenação visual imediata
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
      showNotification('Imagem enviada com sucesso para a biblioteca!');
    } catch (err: any) {
      alert(err?.message || 'Erro ao fazer upload da imagem.');
    } finally {
      setUploadingImage(false);
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
          className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-3 ${
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

      {/* Header bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1528]/5 text-[#0B1528] text-xs font-bold border border-[#D4AF37]/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Hero Slider Premium</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Gerenciador de Slides da Home
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cadastre, ordene e configure múltiplos slides para o carrossel principal da página inicial.
          </p>
        </div>

        <Button
          onClick={handleOpenCreateModal}
          icon={<Plus className="w-4 h-4 text-[#D4AF37]" />}
          className="bg-[#0B1528] hover:bg-[#132342] text-white self-start sm:self-auto"
        >
          Novo Slide
        </Button>
      </div>

      {/* Slides list */}
      {loading ? (
        <div className="py-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-navy" />
        </div>
      ) : slides.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-slate-900">Nenhum slide cadastrado ainda</h4>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            O site atualmente está exibindo os 3 slides padrão de alta definição. Clique abaixo para cadastrar seu primeiro slide personalizado.
          </p>
          <Button onClick={handleOpenCreateModal} icon={<Plus className="w-4 h-4" />}>
            Cadastrar Primeiro Slide
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`p-5 sm:p-6 rounded-3xl border transition-all duration-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 ${
                slide.isActive
                  ? 'bg-white border-slate-200 shadow-soft-sm hover:shadow-soft-md'
                  : 'bg-slate-50/80 border-slate-200/60 opacity-75'
              }`}
            >
              {/* Left info & Image */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 flex-1 min-w-0">
                {/* Thumbnail */}
                <div className="relative w-full sm:w-36 h-28 rounded-2xl overflow-hidden bg-slate-900 flex-shrink-0 shadow-soft-xs border border-slate-100">
                  <img
                    src={slide.imageUrl}
                    alt={slide.imageAlt || slide.title}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#0B1528]/90 text-white font-extrabold text-[10px] tracking-wide border border-white/10">
                    #{index + 1}
                  </div>
                </div>

                {/* Content Details */}
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {slide.badge && (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                        {slide.badge}
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        slide.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${slide.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {slide.isActive ? 'Ativo na Home' : 'Inativo (Oculto)'}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug truncate">
                    {slide.title}{' '}
                    {slide.highlightText && (
                      <span className="text-[#0B1528] underline decoration-[#D4AF37]">
                        {slide.highlightText}
                      </span>
                    )}
                  </h4>

                  {slide.subtitle && (
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {slide.subtitle}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-400">
                    {slide.ctaPrimaryText && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600">
                        CTA 1: {slide.ctaPrimaryText}
                      </span>
                    )}
                    {slide.ctaSecondaryText && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600">
                        CTA 2: {slide.ctaSecondaryText}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-stretch lg:self-auto justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                {/* Reordering buttons */}
                <div className="flex items-center bg-slate-100 rounded-xl p-0.5 mr-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveOrder(index, 'up')}
                    title="Subir ordem"
                    aria-label="Subir ordem"
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === slides.length - 1}
                    onClick={() => handleMoveOrder(index, 'down')}
                    title="Descer ordem"
                    aria-label="Descer ordem"
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Toggle Active */}
                <button
                  type="button"
                  onClick={() => handleToggleActive(slide)}
                  title={slide.isActive ? 'Ocultar slide' : 'Ativar slide'}
                  aria-label={slide.isActive ? 'Ocultar slide' : 'Ativar slide'}
                  className={`p-2 rounded-xl border transition-colors ${
                    slide.isActive
                      ? 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  {slide.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(slide)}
                  title="Editar slide"
                  aria-label="Editar slide"
                  className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:text-[#0B1528] hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDelete(slide)}
                  title="Excluir slide"
                  aria-label="Excluir slide"
                  className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* Slide Edit / Create Modal                                 */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-soft-2xl border border-slate-100 overflow-hidden my-8">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B1528] text-white flex items-center justify-center shadow-soft-xs">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingSlideId ? 'Editar Slide da Home' : 'Criar Novo Slide'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure os textos, botões e fotografia deste slide.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                aria-label="Fechar"
                className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveSlide} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Image Preview & URL */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#0B1528]" />
                    Fotografia Editorial do Slide
                  </label>

                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer shadow-soft-xs transition-colors">
                    <UploadCloud className="w-4 h-4 text-brand-navy" />
                    <span>{uploadingImage ? 'Enviando...' : 'Fazer Upload de Imagem'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-8">
                    <input
                      type="text"
                      required
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://... ou /uploads/..."
                      className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy font-mono"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Cole a URL da imagem corporativa ou use o botão de upload acima.
                    </p>
                  </div>

                  <div className="sm:col-span-4 flex justify-center">
                    <div className="w-full h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-soft-xs">
                      {formData.imageUrl ? (
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                          Sem imagem
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges & Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tag Superior (Badge)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Ex: CONSULTORIA ESTRATÉGICA EUROPEIA"
                    className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Palavra/Frase de Destaque (Dourado/Gradiente)
                  </label>
                  <input
                    type="text"
                    value={formData.highlightText}
                    onChange={(e) => setFormData({ ...formData, highlightText: e.target.value })}
                    placeholder="Ex: Alto Desempenho"
                    className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Título Principal (Headline) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Soluções Corporativas com Clareza, Segurança e"
                    className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subtítulo / Descrição
                  </label>
                  <textarea
                    rows={3}
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Ex: Apoio administrativo, financeiro e consultoria estratégica internacional..."
                    className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy"
                  />
                </div>
              </div>

              {/* CTAs */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
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
                      placeholder="Fale com um Especialista"
                      className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy"
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
                      className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy"
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
                      placeholder="Conheça Nossos Serviços"
                      className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy"
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
                      className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                </div>
              </div>

              {/* Stats / Trust Badges (3 items) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Estatísticas / Selos de Confiança
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
                          placeholder="Ex: +10 Anos"
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
                          placeholder="Ex: na Bélgica"
                          className="w-full p-1.5 text-xs rounded-lg border border-slate-200"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Order */}
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
                    className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 rounded text-brand-navy focus:ring-brand-navy"
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
                  className="bg-[#0B1528] hover:bg-[#132342] text-white"
                >
                  {saving ? 'Salvando...' : editingSlideId ? 'Atualizar Slide' : 'Criar Slide'}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};
