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
}

export interface IntroTranslations {
  tag: string;
  quoteTitle: string;
  paragraph1: string;
  paragraph2: string;
  boxTitle: string;
  boxText: string;
  badgeText: string;
}

export interface ServicesTranslations {
  tag: string;
  title: string;
  subtitle: string;
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
  steps: {
    step: string;
    title: string;
    description: string;
  }[];
  closingQuote: string;
  closingAuthor: string;
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

export interface TranslationSchema {
  nav: NavTranslations;
  hero: HeroTranslations;
  intro: IntroTranslations;
  services: ServicesTranslations;
  audience: AudienceTranslations;
  methodology: MethodologyTranslations;
  contact: ContactTranslations;
  footer: FooterTranslations;
  blog: BlogTranslations;
  common: {
    loading: string;
    close: string;
    back: string;
    save: string;
    cancel: string;
    confirm: string;
    delete: string;
    edit: string;
  };
}
