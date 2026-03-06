import type { RegisteredNote } from '@/notes/registry';

export type Locale = 'en' | 'zh-CN';

export const DEFAULT_LOCALE: Locale = 'en';
export const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'zh-CN'];

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && SUPPORTED_LOCALES.includes(value as Locale);
}

export function normalizeLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

type UiTranslationKey =
  | 'appName'
  | 'openNotesNavigation'
  | 'searchNotes'
  | 'search'
  | 'toggleSidebar'
  | 'toggleSidebarShortcut'
  | 'notesNavigation'
  | 'browseSubjectsDescription'
  | 'onThisPage'
  | 'tableOfContents'
  | 'noHeadingsYet'
  | 'skipToContent'
  | 'updated'
  | 'theme'
  | 'toggleTheme'
  | 'searchDialogDescription'
  | 'searchPlaceholder'
  | 'noMatchingNotes'
  | 'notFoundTitle'
  | 'notFoundDescription'
  | 'backToNotes'
  | 'language'
  | 'toggleLanguage'
  | 'languageEnglish'
  | 'languageChinese'
  | 'themeLight'
  | 'themeDark'
  | 'themeSystem';

const uiTranslations: Record<Locale, Record<UiTranslationKey, string>> = {
  en: {
    appName: 'StudyNotes',
    openNotesNavigation: 'Open notes navigation',
    searchNotes: 'Search notes',
    search: 'Search',
    toggleSidebar: 'Toggle sidebar',
    toggleSidebarShortcut: 'Toggle sidebar (Ctrl+B)',
    notesNavigation: 'Notes navigation',
    browseSubjectsDescription: 'Browse subjects and topics, then choose a note to open.',
    onThisPage: 'On this page',
    tableOfContents: 'Table of contents',
    noHeadingsYet: 'No headings yet.',
    skipToContent: 'Skip to content',
    updated: 'Updated',
    theme: 'Theme',
    toggleTheme: 'Toggle theme',
    searchDialogDescription: 'Type a note name, subject, or description and press Enter to navigate.',
    searchPlaceholder: 'Search by title, subject, or description...',
    noMatchingNotes: 'No matching notes.',
    notFoundTitle: 'Note not found',
    notFoundDescription:
      'The page you requested does not exist, or the note has been moved to a different section.',
    backToNotes: 'Back to notes',
    language: 'Language',
    toggleLanguage: 'Switch language',
    languageEnglish: 'English',
    languageChinese: '简体中文',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System'
  },
  'zh-CN': {
    appName: '学习笔记',
    openNotesNavigation: '打开笔记导航',
    searchNotes: '搜索笔记',
    search: '搜索',
    toggleSidebar: '切换侧边栏',
    toggleSidebarShortcut: '切换侧边栏（Ctrl+B）',
    notesNavigation: '笔记导航',
    browseSubjectsDescription: '浏览学科和主题，然后选择要打开的笔记。',
    onThisPage: '本页目录',
    tableOfContents: '目录',
    noHeadingsYet: '暂无标题。',
    skipToContent: '跳转到正文',
    updated: '更新于',
    theme: '主题',
    toggleTheme: '切换主题',
    searchDialogDescription: '输入笔记标题、学科或简介，然后按 Enter 跳转。',
    searchPlaceholder: '按标题、学科或简介搜索…',
    noMatchingNotes: '没有匹配的笔记。',
    notFoundTitle: '未找到该笔记',
    notFoundDescription: '你访问的页面不存在，或该笔记已移动到其他分类。',
    backToNotes: '返回笔记',
    language: '语言',
    toggleLanguage: '切换语言',
    languageEnglish: 'English',
    languageChinese: '简体中文',
    themeLight: '浅色',
    themeDark: '深色',
    themeSystem: '跟随系统'
  }
};

interface NoteTranslation {
  subject: string;
  title: string;
  description?: string;
}

const noteTranslations: Record<string, NoteTranslation> = {
  'calculus/limits-and-continuity': {
    subject: '微积分',
    title: '极限与连续性',
    description: '用直观与严谨方法理解极限、ε-δ 推理与连续性。'
  },
  'calculus/derivatives': {
    subject: '微积分',
    title: '导数',
    description: '导数定义、核心求导法则与切线可视化探索。'
  },
  'linear-algebra/vectors-and-spaces': {
    subject: '线性代数',
    title: '向量与向量空间',
    description: '结合交互式可视化掌握向量、张成与基的核心概念。'
  },
  'linear-algebra/matrix-transformations': {
    subject: '线性代数',
    title: '矩阵变换',
    description: '理解 2×2 矩阵如何实现缩放、错切、旋转与几何变形。'
  },
  'physics/current-of-electricity': {
    subject: '物理',
    title: '第14章 电流',
    description: '梳理电流、电路约定、电动势、电势差与测量实验要点。'
  }
};

export function translateUi(locale: Locale, key: UiTranslationKey): string {
  return uiTranslations[locale][key];
}

export function translateNote(note: RegisteredNote, locale: Locale): NoteTranslation {
  if (locale === 'en') {
    return {
      subject: note.subject,
      title: note.title,
      description: note.description
    };
  }

  const key = `${note.subjectSlug}/${note.topicSlug}`;
  const translated = noteTranslations[key];

  if (!translated) {
    return {
      subject: note.subject,
      title: note.title,
      description: note.description
    };
  }

  return translated;
}
