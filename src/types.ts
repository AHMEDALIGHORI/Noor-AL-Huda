export interface Story {
  id: string;
  prophetName: string;
  content: string;
  moral: string;
  lessons: string[];
  category: string;
  image?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  preferredLanguage: string;
  completedStories: string[];
  createdAt: string;
}

export type Language = 'en' | 'ar' | 'ur' | 'fr' | 'es' | 'de' | 'tr' | 'id' | 'bn';
