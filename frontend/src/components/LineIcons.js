import React from 'react';

// Művészi, organikus egyvonalas (one-line continuous contour art) SVG ikonok
// A logó kézzel rajzolt, finom vonalvezetéséhez és íveihez igazítva (32x32 viewBox).

const baseProps = {
  fill: 'none',
  viewBox: '0 0 32 32',
  stroke: 'currentColor',
  strokeWidth: '1.7',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  xmlns: 'http://www.w3.org/2000/svg',
};

// 1. Főoldal: Művészi, egyvonalas szentély/otthon finom kéményfüst ívvel és lágy kapuval
export const LineHomeIcon = ({ className = 'w-7 h-7' }) => (
  <svg {...baseProps} className={className} aria-hidden="true">
    <path d="M3.5 25.5C5.5 25.5 6.5 24 6.5 22V14.5C6.5 13.8 7 13 7.8 12.4L15.2 6.2C15.7 5.8 16.3 5.8 16.8 6.2L24.2 12.4C25 13 25.5 13.8 25.5 14.5V22C25.5 24 26.5 25.5 28.5 25.5" />
    <path d="M21.5 10.5V5.5C21.5 4.5 22.5 4 23.5 4.5C24.5 5 24.5 6.5 23 8" />
    <path d="M11.5 25.5V19C11.5 16.2 13.5 14.5 16 14.5C18.5 14.5 20.5 16.2 20.5 19V25.5" />
    <path d="M14.5 19.5C15 18.8 17 18.8 17.5 19.5" />
  </svg>
);

// 2. Kurzusok: Művészi egyvonalas nyitott tananyag/könyv hajló lapokkal és tudás-rüggyel
export const LineCourseIcon = ({ className = 'w-7 h-7' }) => (
  <svg {...baseProps} className={className} aria-hidden="true">
    <path d="M16 9C12.5 6 6 6.5 3.5 8.5V23.5C6 21.5 12.5 21 16 24C19.5 21 26 21.5 28.5 23.5V8.5C26 6.5 19.5 6 16 9Z" />
    <path d="M16 9V24" />
    <path d="M8 12.5C10 12 12.5 12.5 13.5 13" />
    <path d="M8 16.5C10 16 12.5 16.5 13.5 17" />
    <path d="M18.5 13C19.5 12.5 22 12 24 12.5" />
    <path d="M18.5 17C19.5 16.5 22 16 24 16.5" />
    <path d="M16 4.5C15.2 6.2 16 8 16 9" />
  </svg>
);

// 3. Galéria: Művészi egyvonalas festőkeret lágy napfelkeltével és hegyvonulattal
export const LineGalleryIcon = ({ className = 'w-7 h-7' }) => (
  <svg {...baseProps} className={className} aria-hidden="true">
    <path d="M7 5.5C4.5 5.5 3.5 7.5 3.5 10V22C3.5 24.5 4.5 26.5 7 26.5H25C27.5 26.5 28.5 24.5 28.5 22V10C28.5 7.5 27.5 5.5 25 5.5H7Z" />
    <path d="M4 22.5L10.5 15C11.5 14 13 14 14 15L19 20" />
    <path d="M16.5 18L18.5 15.5C19.5 14.5 21 14.5 22 15.5L28 22" />
    <path d="M11.5 10C10.5 10 9.5 11 9.5 12C9.5 13 10.5 14 11.5 14C12.5 14 13.5 13 13.5 12C13.5 11 12.5 10 11.5 10Z" />
  </svg>
);

// 4. Kapcsolat: Művészi egyvonalas levél / üzenet szív-pecsét ívvel
export const LineContactIcon = ({ className = 'w-7 h-7' }) => (
  <svg {...baseProps} className={className} aria-hidden="true">
    <path d="M6 6.5C4 6.5 3.5 8 3.5 10V22C3.5 24 4 25.5 6 25.5H26C28 25.5 28.5 24 28.5 22V10C28.5 8 28 6.5 26 6.5H6Z" />
    <path d="M4 8.5L13.8 16.2C15.1 17.2 16.9 17.2 18.2 16.2L28 8.5" />
    <path d="M4 23.5L11.5 15.5" />
    <path d="M28 23.5L20.5 15.5" />
    <path d="M16 15C15 13.5 16 12 17 12.5C18 13 16 15.5 15 15.5" />
  </svg>
);

// 5. Bejelentkezés: Művészi ívelt portál belépő kulcs-nyíllal
export const LineLoginIcon = ({ className = 'w-7 h-7' }) => (
  <svg {...baseProps} className={className} aria-hidden="true">
    <path d="M16 5H24C26.5 5 27.5 6.5 27.5 9.5V22.5C27.5 25.5 26.5 27 24 27H16" />
    <path d="M4.5 16H19.5" />
    <path d="M14 10.5L19.5 16L14 21.5" />
    <circle cx="7" cy="16" r="1.5" />
  </svg>
);

// 6. Regisztráció: Művészi egyvonalas alak virágzó csillag/levél motívummal
export const LineRegisterIcon = ({ className = 'w-7 h-7' }) => (
  <svg {...baseProps} className={className} aria-hidden="true">
    <path d="M17.5 26C17.5 22 14 19 9.5 19C5 19 2.5 22 2.5 26" />
    <path d="M9.5 15C12.3 15 14.5 12.8 14.5 10C14.5 7.2 12.3 5 9.5 5C6.7 5 4.5 7.2 4.5 10C4.5 12.8 6.7 15 9.5 15Z" />
    <path d="M24 10V18" />
    <path d="M20 14H28" />
    <path d="M21.5 11.5L26.5 16.5" />
    <path d="M26.5 11.5L21.5 16.5" />
  </svg>
);

// 7. Admin: Művészi egyvonalas őrző pajzs / címer belső fénnyel
export const LineAdminIcon = ({ className = 'w-7 h-7' }) => (
  <svg {...baseProps} className={className} aria-hidden="true">
    <path d="M16 3.5L26 8V15.5C26 21.5 21.5 26.5 16 28.5C10.5 26.5 6 21.5 6 15.5V8L16 3.5Z" />
    <path d="M16 9V22" />
    <path d="M11 15H21" />
    <path d="M12.5 11.5L19.5 18.5" />
    <path d="M19.5 11.5L12.5 18.5" />
  </svg>
);

// 8. Profil: Művészi egyvonalas portré sziluett (Matisse / Picasso egyvonalas stílus)
export const LineProfileIcon = ({ className = 'w-7 h-7' }) => (
  <svg {...baseProps} className={className} aria-hidden="true">
    <path d="M4 27C4 22 8 18.5 16 18.5C24 18.5 28 22 28 27" />
    <path d="M16 15C19.3 15 22 12.3 22 9C22 5.7 19.3 3 16 3C12.7 3 10 5.7 10 9C10 12.3 12.7 15 16 15Z" />
    <path d="M13 9C13 11 14.5 12.5 16 12.5C17.5 12.5 18.5 11.5 18.5 9.5C18.5 7 16 6 15 6.5" />
  </svg>
);

// 9. Kijelentkezés: Művészi ívelt kijárati ív lágyan szálló suhanással
export const LineLogoutIcon = ({ className = 'w-7 h-7' }) => (
  <svg {...baseProps} className={className} aria-hidden="true">
    <path d="M16 5H8C5.5 5 4.5 6.5 4.5 9.5V22.5C4.5 25.5 5.5 27 8 27H16" />
    <path d="M12.5 16H27.5" />
    <path d="M22 10.5L27.5 16L22 21.5" />
    <circle cx="25" cy="16" r="1.5" />
  </svg>
);

// 10. Logó/Brand: A névjegykártya és a logó oltalmazó kéz + virág motívumát idéző egyvonalas ikon
export const LineSpaIcon = ({ className = 'w-7 h-7' }) => (
  <svg {...baseProps} className={className} aria-hidden="true">
    <path d="M4.5 17C6 14 7.5 12 9 12C10.5 12 11 14 11.5 17C12 20 13.5 23 16 25C18.5 23 20 20 20.5 17C21 14 21.5 12 23 12C24.5 12 26 14 27.5 17" />
    <path d="M16 6C16 10 13 13 13 17C13 19 14.3 20.5 16 20.5C17.7 20.5 19 19 19 17C19 13 16 10 16 6Z" />
    <path d="M13 17C10.5 15.8 8.5 17.5 8.5 19.5C9.8 21 12 20.5 13.5 19" />
    <path d="M19 17C21.5 15.8 23.5 17.5 23.5 19.5C22.2 21 20 20.5 18.5 19" />
  </svg>
);

// 11. Menü kapcsoló (hamburger) & Bezáró X - organikus, kézzel húzott vonalak
export const LineMenuIcon = ({ className = 'w-7 h-7' }) => (
  <svg {...baseProps} className={className} aria-hidden="true">
    <path d="M4.5 9C10 8.5 22 8.5 27.5 9" />
    <path d="M4.5 16C12 15.5 20 15.5 27.5 16" />
    <path d="M4.5 23C10 23.5 22 23.5 27.5 23" />
  </svg>
);

export const LineCloseIcon = ({ className = 'w-7 h-7' }) => (
  <svg {...baseProps} className={className} aria-hidden="true">
    <path d="M7.5 7.5C13 13 19 19 24.5 24.5" />
    <path d="M24.5 7.5C19 13 13 19 7.5 24.5" />
  </svg>
);

// 12. YouTube / Videó: Művészi, egyvonalas képernyő lágy lejátszás háromszöggel
export const LineYouTubeIcon = ({ className = 'w-7 h-7' }) => (
  <svg {...baseProps} className={className} aria-hidden="true">
    <path d="M5.5 8.5C4 8.5 3 9.8 3 11.5V20.5C3 22.2 4 23.5 5.5 23.5H26.5C28 23.5 29 22.2 29 20.5V11.5C29 9.8 28 8.5 26.5 8.5H5.5Z" />
    <path d="M13.5 12.5L20 16L13.5 19.5V12.5Z" />
  </svg>
);

