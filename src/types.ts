export interface Project {
  id: string;
  title: string;
  client: string;
  category: 'Packaging' | 'Print & Advertising' | 'Branding & Logo' | 'Social Media';
  description: string;
  tools: string[];
  mockTheme: {
    bg: string;
    fg: string;
    accent: string;
  };
  mockContent: {
    title: string;
    tagline: string;
    badgeCount?: string;
    pattern?: 'checkered' | 'stripes' | 'circles' | 'minimal';
  };
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  type: 'current' | 'previous';
  responsibilities: string[];
  toolsUsed: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  percentage?: string;
  details: string;
}
