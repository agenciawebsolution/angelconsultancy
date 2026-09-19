export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  benefits: string[];
  icon: string;
}

export interface TargetAudienceItem {
  id: string;
  title: string;
  tag: string;
  description: string;
  icon: string;
}

export interface MethodologyStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export type ProfileType = 
  | 'Pessoa física'
  | 'Profissional liberal / autônomo'
  | 'Associação / ONG'
  | 'Outro';

export type ServiceInterest = 
  | 'Consultoria administrativa'
  | 'Organização de documentos'
  | 'Apoio contábil e tributário'
  | 'Associação / ONG'
  | 'Atividade profissional / autônomo'
  | 'Declaração de imposto'
  | 'Outro';

export type MeetingPreference = 
  | 'Presencial'
  | 'Online'
  | 'Não tenho preferência';

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  profileType: ProfileType | '';
  services: ServiceInterest[];
  message: string;
  meetingPreference: MeetingPreference | '';
  consentAccepted: boolean;
}
