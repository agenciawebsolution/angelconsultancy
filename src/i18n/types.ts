export type Language = 'pt-BR' | 'en' | 'fr';

export interface NavTranslations {
  home: string;
  about: string;
  services: string;
  audience: string;
  methodology: string;
  contact: string;
  blog: string;
  ctaButton: string;
}

export interface HeroSlideStat {
  label: string;
  value: string;
}

export interface HeroSlideTranslation {
  badge: string;
  title: string;
  highlightText: string;
  subtitle: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  stats: HeroSlideStat[];
}

export interface HeroTranslations {
  badge: string;
  titlePart1: string;
  titleHighlight: string;
  titlePart2: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  trustClear: string;
  trustNoJargon: string;
  trustClose: string;
  imgCaptionTag: string;
  imgCaptionText: string;
  pillWarmTitle: string;
  pillWarmSub: string;
  pillSafeTitle: string;
  pillSafeSub: string;
  // Multi-slide translations & interactive micro-cards
  slides: HeroSlideTranslation[];
  floatingCards: {
    secureServiceTitle: string;
    secureServiceSub: string;
    confidentDecisionsTitle: string;
    confidentDecisionsSub: string;
  };
  scrollIndicator: string;
  aria: {
    sliderRegion: string;
    prevSlide: string;
    nextSlide: string;
    goToSlide: string;
  };
}

export interface DifferentialItemTranslation {
  title: string;
  subtitle: string;
}

export interface DifferentialsTranslations {
  items: DifferentialItemTranslation[];
}

export interface ValueCardTranslation {
  title: string;
  desc: string;
  badge: string;
}

export interface IntroTranslations {
  tag: string;
  quoteTitle: string;
  paragraph1: string;
  paragraph2: string;
  boxTitle: string;
  boxText: string;
  badgeText: string;
  clarityAccent: string;
  locationNote: string;
  commitment: string;
  valueCards: ValueCardTranslation[];
}

export interface ServicesTranslations {
  tag: string;
  title: string;
  subtitle: string;
  locationTag: string;
  items: {
    title: string;
    description: string;
    features: string[];
  }[];
  ctaButton: string;
}

export interface AudienceTranslations {
  tag: string;
  title: string;
  subtitle: string;
  customTag: string;
  talkButton: string;
  items: {
    title: string;
    description: string;
    highlights: string[];
  }[];
}

export interface MethodologyTranslations {
  tag: string;
  title: string;
  subtitle: string;
  stepLabel: string;
  phaseLabel: string;
  ctaBannerButton: string;
  steps: {
    step: string;
    title: string;
    description: string;
  }[];
  closingQuote: string;
  closingAuthor: string;
}

export interface ContactValidationTranslations {
  errNameRequired: string;
  errNameMin: string;
  errEmailRequired: string;
  errEmailInvalid: string;
  errPhoneRequired: string;
  errPhoneInvalid: string;
  errProfileRequired: string;
  errServicesRequired: string;
  errMessageRequired: string;
  errMessageMin: string;
  errPreferenceRequired: string;
  errConsentRequired: string;
  errServerFallback: string;
}

export interface ContactTranslations {
  tag: string;
  title: string;
  subtitle: string;
  formTitle: string;
  formSubtitle: string;
  fieldName: string;
  placeholderName: string;
  fieldEmail: string;
  placeholderEmail: string;
  fieldPhone: string;
  placeholderPhone: string;
  fieldProfile: string;
  selectProfile: string;
  profiles: {
    individual: string;
    freelancer: string;
    association: string;
    other: string;
  };
  fieldServices: string;
  servicesList: {
    adminConsulting: string;
    docOrganization: string;
    taxSupport: string;
    associationOng: string;
    freelanceActivity: string;
    taxReturn: string;
    other: string;
  };
  fieldPreference: string;
  preferences: {
    inPerson: string;
    online: string;
    noPreference: string;
  };
  fieldMessage: string;
  placeholderMessage: string;
  consentText: string;
  submitButton: string;
  submittingButton: string;
  successTitle: string;
  successMessage: string;
  successNote: string;
  sendAnother: string;
  directContactTitle: string;
  directContactSubtitle: string;
  whatsappButton: string;
  alertTitle: string;
  validation: ContactValidationTranslations;
}

export interface FloatingMenuTranslations {
  headerTitle: string;
  headerRegion: string;
  whatsappTitle: string;
  whatsappAria: string;
  emailTitle: string;
  emailSubtitle: string;
  emailAria: string;
  phoneTitle: string;
  phoneAria: string;
  triggerOpen: string;
  triggerClose: string;
  triggerAriaOpen: string;
  triggerAriaClose: string;
  ariaMenu: string;
  ariaRegion: string;
}

export interface FooterTranslations {
  description: string;
  registered: string;
  navTitle: string;
  contactTitle: string;
  attendanceTitle: string;
  attendanceText: string;
  rightsReserved: string;
  privacyPolicy: string;
  termsOfUse: string;
  adminAccess: string;
  developedBy: string;
  backToTop: string;
  backToTopAria: string;
  adminAccessTitle: string;
}

export interface BlogTranslations {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  allCategories: string;
  readMore: string;
  noArticlesFound: string;
  backToBlog: string;
  publishedOn: string;
  byAuthor: string;
  shareArticle: string;
  copiedLink: string;
  relatedArticles: string;
  notFoundTitle: string;
  notFoundSubtitle: string;
}

export interface CommonTranslations {
  loading: string;
  close: string;
  back: string;
  save: string;
  cancel: string;
  confirm: string;
  delete: string;
  edit: string;
  skipToContent: string;
  pageNotFound: string;
  pageNotFoundDesc: string;
  backToHome: string;
  selectLanguage: string;
  selectLanguageAria: string;
  menuOpenAria: string;
  menuCloseAria: string;
  menuNavAria: string;
  logoHomeAria: string;
}

export interface TranslationSchema {
  nav: NavTranslations;
  hero: HeroTranslations;
  differentials: DifferentialsTranslations;
  intro: IntroTranslations;
  services: ServicesTranslations;
  audience: AudienceTranslations;
  methodology: MethodologyTranslations;
  contact: ContactTranslations;
  floatingMenu: FloatingMenuTranslations;
  footer: FooterTranslations;
  blog: BlogTranslations;
  common: CommonTranslations;
}
