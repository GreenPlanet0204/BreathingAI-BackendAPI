export enum ContentType {
  VIDEO_MP4 = 'video/mp4',
  AUDIO_MP3 = 'audio/mp3',
}

export enum RecommendationType {
  VIDEO_MP4 = 'video/mp4',
  AUDIO_MP3 = 'audio/mp3',
}

export interface ContentFile {
  url: string;
  size: number;
  contentType: ContentType;
}

// Improvement Categories
export enum ImprovementCategory {
  STRESS = 'stress',
  FOCUS = 'focus',
  ANXIETY = 'anxiety',
  DEPRESSION = 'depression',
  TENSION = 'tension',
  POSTURE = 'posture',
  ENERGY = 'energy',
}

// types of methods
export enum MethodCategory {
  BREATHING = 'breathing',
  MEDITATION = 'meditation',
  EXCERCISE = 'excercise',
  INTERFACE = 'interface',
  NUTRITION = 'nutrition',
}

export type BillingAddress = {
  companyName?: string;
  name: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  state: string;
  country: string;
  phone?: string;
  email?: string;
};
