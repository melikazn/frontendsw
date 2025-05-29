export interface Notification {
  id: number;
  title: string;
  message: string;
  created_at: string;
  is_read: number;
  link?: string;
}

export interface TestResult {
  test_id: number;
  test_title: string;
  correct_answers: number;
  total_questions: number;
  required_correct: number;
  passed: boolean;
  created_at: string;
}

export interface User {
  name: string;
  level: string;
  profile_image?: string;
}
export interface VocabularyWord {
  id: number;
  word: string;
  translation: string;
  word_class: string;
  article?: string;
  forms: string[];
  meaning: string;
  synonyms: string[];
  example: string;
  level: string;
  is_favorite: boolean;
}