// src/types/gtag.d.ts
interface Window {
    dataLayer: unknown[];
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      params?: {
        page_path?: string;
        page_title?: string;
        page_location?: string;
        [key: string]: unknown;
      }
    ) => void;
  }