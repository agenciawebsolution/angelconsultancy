import React, { useEffect, useState } from 'react';
import { sectionsService } from '../../services/sectionsService';
import { SlidesManager } from '../../components/admin/SlidesManager';
import { Button } from '../../components/ui/Button';
import { Save, Check, Loader2 } from 'lucide-react';

export const HomeContentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'slides' | 'hero' | 'intro' | 'services' | 'audience' | 'methodology' | 'contact' | 'footer'>('slides');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estados das seções com valores padrão correspondentes ao código atual do site
  const [hero, setHero] = useState({
    badge: 'Angel Consultancy and Network',
    title: 'Assistência humana, simples e confiável para sua organização financeira e administrativa.',
    subtitle: 'Apoio humano, simples e confiável para você, sua organização financeira e administrativa. Orientação clara, acessível e verdadeira para tornar o seu mundo administrativo muito mais leve.',
    ctaPrimaryText: 'Fale conosco',
    ctaPrimaryLink: '#contato',
    ctaSecondaryText: 'Conheça nossos serviços',
    ctaSecondaryLink: '#servicos',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Consultora prestando orientação atenciosa e próxima',
  });

  const [intro, setIntro] = useState({
    tag: 'Nossa Missão e Propósito',
    quoteTitle: '“Acreditamos que qualquer pessoa merece acesso a orientação clara, acessível e verdadeira.”',
    paragraph1: 'Na Angel Consultancy, acreditamos que qualquer pessoa — seja um indivíduo, um profissional liberal, autônomo, uma associação ou ONGs — merece acesso a orientação clara, acessível e verdadeira.',
    paragraph2: 'Trabalhamos para que você entenda cada passo, se sinta seguro nas suas decisões e tenha um suporte que acolhe suas necessidades reais. Nosso objetivo é tornar o mundo administrativo menos complicado e muito mais leve.',
    boxTitle: 'O que fazemos por você',
    boxText: 'Oferecemos acompanhamento contínuo e personalizado, sempre explicado com calma, sem pressa e sem linguagem técnica desnecessária.',
  });

  const [servicesHeader, setServicesHeader] = useState({
    tag: 'Nossos Serviços',
    title: 'Soluções estruturadas para suas necessidades reais',
    subtitle: 'Acompanhamento contínuo e personalizado, com explicações claras e sem complicações burocráticas.',
  });

  const [audienceHeader, setAudienceHeader] = useState({
    tag: 'Público Atendido',
    title: 'Para quem é o nosso trabalho',
    subtitle: 'Atendimento focado em quem precisa de apoio verdadeiro, descomplicado e seguro no dia a dia.',
  });

  const [methodologyHeader, setMethodologyHeader] = useState({
    tag: 'Nosso Jeito de Trabalhar',
    title: 'Acolhimento, paciência e comunicação transparente',
    subtitle: 'Acreditamos em um processo humano onde você é ouvido com atenção e participa ativamente de cada escolha.',
  });

  const [contactHeader, setContactHeader] = useState({
    tag: 'Fale Conosco',
    title: 'Estamos prontos para ouvir e ajudar você',
    subtitle: 'Preencha o formulário abaixo com suas dúvidas ou necessidades. Responderemos com brevidade, clareza e dedicação.',
    directContactTitle: 'Atendimento Próximo & Personalizado',
    directContactSubtitle: 'Quer falar diretamente conosco antes de enviar os detalhes? Utilize nossos canais de contato direto.',
    supportMessage: 'Atendimento presencial em toda a Bélgica e sessões digitais para sua máxima comodidade.',
  });

  const [footerContent, setFooterContent] = useState({
    description: 'Orientação clara, acessível e verdadeira para indivíduos, autônomos e associações. Cuidamos do seu mundo burocrático e administrativo com acolhimento.',
    registeredText: 'Bélgica / Registrada e em conformidade',
    copyrightText: 'Angel Consultancy and Network. Todos os direitos reservados.',
  });

  useEffect(() => {
    sectionsService
      .getPageSections('home')
      .then((sections) => {
        if (sections.hero) setHero((prev) => ({ ...prev, ...sections.hero }));
        if (sections.intro) setIntro((prev) => ({ ...prev, ...sections.intro }));
        if (sections.services) setServicesHeader((prev) => ({ ...prev, ...sections.services }));
        if (sections.audience) setAudienceHeader((prev) => ({ ...prev, ...sections.audience }));
        if (sections.methodology) setMethodologyHeader((prev) => ({ ...prev, ...sections.methodology }));
        if (sections.contact) setContactHeader((prev) => ({ ...prev, ...sections.contact }));
        if (sections.footer) setFooterContent((prev) => ({ ...prev, ...sections.footer }));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (sectionKey: string, contentData: any) => {
    setSaving(true);
    setSuccessMessage(null);
    try {
      await sectionsService.saveSection('home', sectionKey, contentData);
      setSuccessMessage('Alterações salvas com sucesso no banco de dados!');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      alert(err?.message || 'Erro ao salvar seção');
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Conteúdo da Página Inicial (Home)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Edite os textos, títulos e imagens que aparecem na página principal do site.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-3">
          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-white border border-slate-100 rounded-2xl shadow-soft-xs">
        {[
          { id: 'slides', label: '1. Slides da Home (Carrossel)' },
          { id: 'hero', label: '2. Hero Geral (Fallback)' },
          { id: 'intro', label: '3. Sobre & Missão' },
          { id: 'services', label: '4. Serviços' },
          { id: 'audience', label: '5. Público Atendido' },
          { id: 'methodology', label: '6. Como Trabalhamos' },
          { id: 'contact', label: '7. Contato' },
          { id: 'footer', label: '8. Rodapé' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-brand-navy text-white shadow-soft-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 0: SLIDES DA HOME (CARROSSEL DINÂMICO) */}
      {activeTab === 'slides' && <SlidesManager />}

      {/* Tab 1: HERO FALLBACK */}
      {activeTab === 'hero' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Seção Hero (Cabeçalho Principal)</h3>
            <p className="text-xs text-slate-500">Primeira visualização que os visitantes encontram ao entrar no site.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Superior</label>
              <input
                type="text"
                value={hero.badge}
                onChange={(e) => setHero({ ...hero, badge: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Título Principal (Headline)</label>
              <textarea
                rows={2}
                value={hero.title}
                onChange={(e) => setHero({ ...hero, title: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subtítulo / Descrição</label>
              <textarea
                rows={3}
                value={hero.subtitle}
                onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Texto do Botão Primário</label>
              <input
                type="text"
                value={hero.ctaPrimaryText}
                onChange={(e) => setHero({ ...hero, ctaPrimaryText: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Link do Botão Primário</label>
              <input
                type="text"
                value={hero.ctaPrimaryLink}
                onChange={(e) => setHero({ ...hero, ctaPrimaryLink: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Texto do Botão Secundário</label>
              <input
                type="text"
                value={hero.ctaSecondaryText}
                onChange={(e) => setHero({ ...hero, ctaSecondaryText: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Link do Botão Secundário</label>
              <input
                type="text"
                value={hero.ctaSecondaryLink}
                onChange={(e) => setHero({ ...hero, ctaSecondaryLink: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">URL da Imagem Editorial</label>
              <input
                type="text"
                value={hero.imageUrl}
                onChange={(e) => setHero({ ...hero, imageUrl: e.target.value })}
                placeholder="https://... ou /uploads/..."
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              disabled={saving}
              onClick={() => handleSave('hero', hero)}
              icon={<Save className="w-4 h-4" />}
            >
              {saving ? 'Salvando...' : 'Salvar Hero'}
            </Button>
          </div>
        </div>
      )}

      {/* Tab 2: INTRO / SOBRE */}
      {activeTab === 'intro' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Seção Sobre & Missão</h3>
            <p className="text-xs text-slate-500">Valores, propósito e declaração da Angel Consultancy.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tag Superior</label>
              <input
                type="text"
                value={intro.tag}
                onChange={(e) => setIntro({ ...intro, tag: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Frase de Destaque / Citação</label>
              <textarea
                rows={2}
                value={intro.quoteTitle}
                onChange={(e) => setIntro({ ...intro, quoteTitle: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primeiro Parágrafo</label>
              <textarea
                rows={3}
                value={intro.paragraph1}
                onChange={(e) => setIntro({ ...intro, paragraph1: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Segundo Parágrafo</label>
              <textarea
                rows={3}
                value={intro.paragraph2}
                onChange={(e) => setIntro({ ...intro, paragraph2: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-navy"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Caixa "O Que Fazemos por Você"</p>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Título do Box</label>
                <input
                  type="text"
                  value={intro.boxTitle}
                  onChange={(e) => setIntro({ ...intro, boxTitle: e.target.value })}
                  className="w-full p-2 text-sm rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Texto do Box</label>
                <textarea
                  rows={2}
                  value={intro.boxText}
                  onChange={(e) => setIntro({ ...intro, boxText: e.target.value })}
                  className="w-full p-2 text-sm rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              disabled={saving}
              onClick={() => handleSave('intro', intro)}
              icon={<Save className="w-4 h-4" />}
            >
              {saving ? 'Salvando...' : 'Salvar Sobre'}
            </Button>
          </div>
        </div>
      )}

      {/* Tab 3: SERVIÇOS */}
      {activeTab === 'services' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Cabeçalho da Seção de Serviços</h3>
            <p className="text-xs text-slate-500">Títulos e subtítulos introdutórios dos serviços oferecidos.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tag</label>
              <input
                type="text"
                value={servicesHeader.tag}
                onChange={(e) => setServicesHeader({ ...servicesHeader, tag: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Título Principal</label>
              <input
                type="text"
                value={servicesHeader.title}
                onChange={(e) => setServicesHeader({ ...servicesHeader, title: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subtítulo</label>
              <textarea
                rows={2}
                value={servicesHeader.subtitle}
                onChange={(e) => setServicesHeader({ ...servicesHeader, subtitle: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              disabled={saving}
              onClick={() => handleSave('services', servicesHeader)}
              icon={<Save className="w-4 h-4" />}
            >
              {saving ? 'Salvando...' : 'Salvar Serviços'}
            </Button>
          </div>
        </div>
      )}

      {/* Tab 4: PÚBLICO ATENDIDO */}
      {activeTab === 'audience' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Seção Para Quem É</h3>
            <p className="text-xs text-slate-500">Textos do cabeçalho de públicos atendidos.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tag</label>
              <input
                type="text"
                value={audienceHeader.tag}
                onChange={(e) => setAudienceHeader({ ...audienceHeader, tag: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Título Principal</label>
              <input
                type="text"
                value={audienceHeader.title}
                onChange={(e) => setAudienceHeader({ ...audienceHeader, title: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subtítulo</label>
              <textarea
                rows={2}
                value={audienceHeader.subtitle}
                onChange={(e) => setAudienceHeader({ ...audienceHeader, subtitle: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              disabled={saving}
              onClick={() => handleSave('audience', audienceHeader)}
              icon={<Save className="w-4 h-4" />}
            >
              {saving ? 'Salvando...' : 'Salvar Público'}
            </Button>
          </div>
        </div>
      )}

      {/* Tab 5: METODOLOGIA */}
      {activeTab === 'methodology' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Seção Como Trabalhamos</h3>
            <p className="text-xs text-slate-500">Cabeçalho da metodologia e passos de atendimento.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tag</label>
              <input
                type="text"
                value={methodologyHeader.tag}
                onChange={(e) => setMethodologyHeader({ ...methodologyHeader, tag: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Título Principal</label>
              <input
                type="text"
                value={methodologyHeader.title}
                onChange={(e) => setMethodologyHeader({ ...methodologyHeader, title: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subtítulo</label>
              <textarea
                rows={2}
                value={methodologyHeader.subtitle}
                onChange={(e) => setMethodologyHeader({ ...methodologyHeader, subtitle: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              disabled={saving}
              onClick={() => handleSave('methodology', methodologyHeader)}
              icon={<Save className="w-4 h-4" />}
            >
              {saving ? 'Salvando...' : 'Salvar Metodologia'}
            </Button>
          </div>
        </div>
      )}

      {/* Tab 6: CONTATO */}
      {activeTab === 'contact' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Seção de Contato & Atendimento</h3>
            <p className="text-xs text-slate-500">Textos do cabeçalho da seção de contato e do box lateral explicativo.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tag Superior</label>
              <input
                type="text"
                value={contactHeader.tag}
                onChange={(e) => setContactHeader({ ...contactHeader, tag: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Título Principal</label>
              <input
                type="text"
                value={contactHeader.title}
                onChange={(e) => setContactHeader({ ...contactHeader, title: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subtítulo</label>
              <textarea
                rows={2}
                value={contactHeader.subtitle}
                onChange={(e) => setContactHeader({ ...contactHeader, subtitle: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200"
              />
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Card Lateral de Apoio</p>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Título do Card</label>
                <input
                  type="text"
                  value={contactHeader.directContactTitle}
                  onChange={(e) => setContactHeader({ ...contactHeader, directContactTitle: e.target.value })}
                  className="w-full p-2 text-sm rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Subtítulo / Descrição do Card</label>
                <textarea
                  rows={2}
                  value={contactHeader.directContactSubtitle}
                  onChange={(e) => setContactHeader({ ...contactHeader, directContactSubtitle: e.target.value })}
                  className="w-full p-2 text-sm rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Mensagem de Apoio / Modalidades</label>
                <input
                  type="text"
                  value={contactHeader.supportMessage}
                  onChange={(e) => setContactHeader({ ...contactHeader, supportMessage: e.target.value })}
                  className="w-full p-2 text-sm rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              disabled={saving}
              onClick={() => handleSave('contact', contactHeader)}
              icon={<Save className="w-4 h-4" />}
            >
              {saving ? 'Salvando...' : 'Salvar Contato'}
            </Button>
          </div>
        </div>
      )}

      {/* Tab 7: RODAPÉ */}
      {activeTab === 'footer' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Seção Rodapé (Footer)</h3>
            <p className="text-xs text-slate-500">Textos institucionais exibidos no rodapé do site.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Descrição Curta Institucional</label>
              <textarea
                rows={3}
                value={footerContent.description}
                onChange={(e) => setFooterContent({ ...footerContent, description: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Texto de Registro / Conformidade</label>
              <input
                type="text"
                value={footerContent.registeredText}
                onChange={(e) => setFooterContent({ ...footerContent, registeredText: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Texto de Copyright</label>
              <input
                type="text"
                value={footerContent.copyrightText}
                onChange={(e) => setFooterContent({ ...footerContent, copyrightText: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              disabled={saving}
              onClick={() => handleSave('footer', footerContent)}
              icon={<Save className="w-4 h-4" />}
            >
              {saving ? 'Salvando...' : 'Salvar Rodapé'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
