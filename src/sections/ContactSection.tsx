import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  CheckCircle2, 
  Send, 
  MapPin, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { submitContact } from '../services/contactService';
import { useLanguage } from '../i18n/LanguageContext';
import type { 
  ContactFormData, 
  ProfileType, 
  ServiceInterest, 
  MeetingPreference 
} from '../types';

const profileOptions: ProfileType[] = [
  'Pessoa física',
  'Profissional liberal / autônomo',
  'Associação / ONG',
  'Outro',
];

const serviceOptions: ServiceInterest[] = [
  'Consultoria administrativa',
  'Organização de documentos',
  'Apoio contábil e tributário',
  'Associação / ONG',
  'Atividade profissional / autônomo',
  'Declaração de imposto',
  'Outro',
];

const preferenceOptions: MeetingPreference[] = [
  'Presencial',
  'Online',
  'Não tenho preferência',
];

export const ContactSection: React.FC = () => {
  const { translations } = useLanguage();
  const ct = translations.contact;

  const formCardRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    profileType: '',
    services: [],
    message: '',
    meetingPreference: '',
    consentAccepted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const getProfileLabel = (opt: ProfileType): string => {
    switch (opt) {
      case 'Pessoa física':
        return ct.profiles.individual;
      case 'Profissional liberal / autônomo':
        return ct.profiles.freelancer;
      case 'Associação / ONG':
        return ct.profiles.association;
      case 'Outro':
        return ct.profiles.other;
      default:
        return opt;
    }
  };

  const getServiceLabel = (srv: ServiceInterest): string => {
    switch (srv) {
      case 'Consultoria administrativa':
        return ct.servicesList.adminConsulting;
      case 'Organização de documentos':
        return ct.servicesList.docOrganization;
      case 'Apoio contábil e tributário':
        return ct.servicesList.taxSupport;
      case 'Associação / ONG':
        return ct.servicesList.associationOng;
      case 'Atividade profissional / autônomo':
        return ct.servicesList.freelanceActivity;
      case 'Declaração de imposto':
        return ct.servicesList.taxReturn;
      case 'Outro':
        return ct.servicesList.other;
      default:
        return srv;
    }
  };

  const getPreferenceLabel = (pref: MeetingPreference): string => {
    switch (pref) {
      case 'Presencial':
        return ct.preferences.inPerson;
      case 'Online':
        return ct.preferences.online;
      case 'Não tenho preferência':
        return ct.preferences.noPreference;
      default:
        return pref;
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Por favor, informe seu nome completo.';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'O nome deve ter no mínimo 3 caracteres.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Por favor, informe seu e-mail.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Por favor, informe um endereço de e-mail válido.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Por favor, informe seu telefone ou WhatsApp.';
    } else if (formData.phone.replace(/\D/g, '').length < 7) {
      newErrors.phone = 'Por favor, informe um número de telefone válido com DDD/código.';
    }

    if (!formData.profileType) {
      newErrors.profileType = 'Selecione qual perfil melhor descreve você.';
    }

    if (formData.services.length === 0) {
      newErrors.services = 'Selecione pelo menos um assunto de interesse.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Por favor, escreva uma breve mensagem sobre o que você precisa.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Por favor, detalhe um pouco mais sua necessidade (mínimo 10 caracteres).';
    }

    if (!formData.meetingPreference) {
      newErrors.meetingPreference = 'Selecione sua preferência de atendimento.';
    }

    if (!formData.consentAccepted) {
      newErrors.consentAccepted = 'É necessário autorizar o uso dos dados para entrarmos em contato.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitContact(formData);

      if (response.success) {
        setIsSubmitted(true);
        requestAnimationFrame(() => {
          formCardRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        });
      } else {
        if (response.errors) {
          setErrors(response.errors);
        }
        if (response.message) {
          setServerError(response.message);
        }
      }
    } catch {
      setServerError(
        'Não foi possível registrar seu contato no momento. Por favor, tente novamente mais tarde ou fale conosco pelo WhatsApp ou e-mail.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckboxChange = (service: ServiceInterest) => {
    setFormData((prev) => {
      const exists = prev.services.includes(service);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s !== service)
          : [...prev.services, service],
      };
    });
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      profileType: '',
      services: [],
      message: '',
      meetingPreference: '',
      consentAccepted: false,
    });
    setErrors({});
    setServerError(null);
    setIsSubmitted(false);
    requestAnimationFrame(() => {
      formCardRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    });
  };

  return (
    <section id="contato" className="py-20 lg:py-28 bg-white relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          tag={ct.tag}
          tagVariant="amber"
          title={ct.title}
          subtitle={ct.subtitle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Contact & Client Letter */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-7 sm:p-8 rounded-3xl bg-slate-50 border border-slate-100 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-navy-50 text-brand-navy text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
                <span>{ct.directContactTitle}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {ct.tag}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {ct.directContactSubtitle}
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4">
              {/* Phone / WhatsApp */}
              <a
                href="https://wa.me/32492319741"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-soft-sm hover:border-brand-navy-200 hover:shadow-soft-md transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-navy-50 text-brand-navy group-hover:bg-brand-navy group-hover:text-white flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{ct.whatsappButton}</p>
                  <p className="text-base font-bold text-slate-900 group-hover:text-brand-navy transition-colors">
                    +32 492 319 741
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:info@angel-consultancy.be"
                className="group flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-soft-sm hover:border-brand-navy-200 hover:shadow-soft-md transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-navy-50 text-brand-navy group-hover:bg-brand-navy group-hover:text-white flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">E-mail</p>
                  <p className="text-base font-bold text-slate-900 group-hover:text-brand-navy transition-colors truncate">
                    info@angel-consultancy.be
                  </p>
                </div>
              </a>

              {/* Location & Modality */}
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-soft-sm">
                <div className="w-12 h-12 rounded-xl bg-brand-amber-50 text-brand-amber-700 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-brand-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{ct.fieldPreference}</p>
                  <p className="text-sm font-semibold text-slate-800">
                    Bélgica — {ct.preferences.inPerson} / {ct.preferences.online}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div 
              ref={formCardRef}
              className={`bg-[#FAFBFD] p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-soft-md relative transition-all duration-300 ${
                isSubmitted ? 'min-h-[520px] sm:min-h-[600px] flex flex-col justify-center' : ''
              }`}
            >
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="text-center py-8 sm:py-12 px-4 space-y-6 my-auto"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-soft-sm">
                      <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        {ct.successTitle}
                      </h4>
                      <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                        {ct.successMessage}
                      </p>
                      <p className="text-slate-400 text-xs mt-2">
                        {ct.successNote}
                      </p>
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" onClick={resetForm} className="min-w-[200px]">
                        {ct.sendAnother}
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    noValidate
                  >
                    <div className="border-b border-slate-200/80 pb-4 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">
                        {ct.formTitle}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        {ct.formSubtitle}
                      </p>
                    </div>

                    {/* Basic info row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <Input
                          label={ct.fieldName}
                          required
                          placeholder={ct.placeholderName}
                          value={formData.fullName}
                          error={errors.fullName}
                          onChange={(e) => {
                            setFormData({ ...formData, fullName: e.target.value });
                            if (errors.fullName) setErrors({ ...errors, fullName: '' });
                          }}
                        />
                      </div>

                      <div>
                        <Input
                          label={ct.fieldEmail}
                          type="email"
                          required
                          placeholder={ct.placeholderEmail}
                          value={formData.email}
                          error={errors.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) setErrors({ ...errors, email: '' });
                          }}
                        />
                      </div>

                      <div>
                        <Input
                          label={ct.fieldPhone}
                          type="tel"
                          required
                          placeholder={ct.placeholderPhone}
                          value={formData.phone}
                          error={errors.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            if (errors.phone) setErrors({ ...errors, phone: '' });
                          }}
                        />
                      </div>
                    </div>

                    {/* Profile Type: Radio group */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        {ct.fieldProfile}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {profileOptions.map((option) => (
                          <label
                            key={option}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-sm cursor-pointer transition-all duration-150 ${
                              formData.profileType === option
                                ? 'bg-brand-navy-50 border-brand-navy text-brand-navy font-semibold'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="profileType"
                              value={option}
                              checked={formData.profileType === option}
                              onChange={() => {
                                setFormData({ ...formData, profileType: option });
                                if (errors.profileType) setErrors({ ...errors, profileType: '' });
                              }}
                              className="accent-brand-navy w-4 h-4"
                            />
                            <span>{getProfileLabel(option)}</span>
                          </label>
                        ))}
                      </div>
                      {errors.profileType && (
                        <p className="text-xs text-rose-600 font-medium">{errors.profileType}</p>
                      )}
                    </div>

                    {/* Services checkboxes */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        {ct.fieldServices}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                        {serviceOptions.map((option) => {
                          const isChecked = formData.services.includes(option);
                          return (
                            <label
                              key={option}
                              className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all duration-150 ${
                                isChecked
                                  ? 'bg-brand-navy-50 border-brand-navy text-brand-navy font-semibold'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                value={option}
                                checked={isChecked}
                                onChange={() => handleCheckboxChange(option)}
                                className="accent-brand-navy w-4 h-4 rounded flex-shrink-0 mt-0.5"
                              />
                              <span className="leading-snug text-slate-800">{getServiceLabel(option)}</span>
                            </label>
                          );
                        })}
                      </div>
                      {errors.services && (
                        <p className="text-xs text-rose-600 font-medium">{errors.services}</p>
                      )}
                    </div>

                    {/* Message textarea */}
                    <Textarea
                      label={ct.fieldMessage}
                      required
                      placeholder={ct.placeholderMessage}
                      rows={4}
                      value={formData.message}
                      error={errors.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: '' });
                      }}
                    />

                    {/* Meeting preference */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        {ct.fieldPreference}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {preferenceOptions.map((option) => (
                          <label
                            key={option}
                            className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all duration-150 ${
                              formData.meetingPreference === option
                                ? 'bg-brand-navy-50 border-brand-navy text-brand-navy font-semibold'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="meetingPreference"
                              value={option}
                              checked={formData.meetingPreference === option}
                              onChange={() => {
                                setFormData({ ...formData, meetingPreference: option });
                                if (errors.meetingPreference) setErrors({ ...errors, meetingPreference: '' });
                              }}
                              className="accent-brand-navy w-4 h-4 flex-shrink-0"
                            />
                            <span>{getPreferenceLabel(option)}</span>
                          </label>
                        ))}
                      </div>
                      {errors.meetingPreference && (
                        <p className="text-xs text-rose-600 font-medium">{errors.meetingPreference}</p>
                      )}
                    </div>

                    {/* Consent checkbox */}
                    <div className="pt-2">
                      <label className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.consentAccepted}
                          onChange={(e) => {
                            setFormData({ ...formData, consentAccepted: e.target.checked });
                            if (errors.consentAccepted) setErrors({ ...errors, consentAccepted: '' });
                          }}
                          className="accent-brand-navy w-4 h-4 rounded mt-0.5 flex-shrink-0"
                        />
                        <span className="leading-normal">
                          {ct.consentText}{' '}
                          <span className="text-brand-amber-700 font-bold">*</span>
                        </span>
                      </label>
                      {errors.consentAccepted && (
                        <p className="text-xs text-rose-600 font-medium mt-1.5">{errors.consentAccepted}</p>
                      )}
                    </div>

                    {/* Server Error Alert Banner */}
                    {serverError && (
                      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-rose-900">Aviso</p>
                          <p className="mt-0.5 text-rose-700 leading-relaxed">{serverError}</p>
                        </div>
                      </div>
                    )}

                    {/* Submit Button with mobile safety margin */}
                    <div className="pt-3 pb-8 sm:pb-0">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full sm:w-auto min-w-[220px]"
                        disabled={isSubmitting}
                        icon={<Send className="w-4 h-4" />}
                      >
                        {isSubmitting ? ct.submittingButton : ct.submitButton}
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
