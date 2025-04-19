// elements which are focusable - used for circular accessibility
export const FOCUSABLE_ELEMENTS = [
    'a[href]:not([tabindex^="-"])',
    'area[href]:not([tabindex^="-"])',
    'input:not([type="hidden"]):not([type="radio"]):not([disabled]):not([tabindex^="-"])',
    'input[type="radio"]:not([disabled]):not([tabindex^="-"]):checked',
    'select:not([disabled]):not([tabindex^="-"])',
    'textarea:not([disabled]):not([tabindex^="-"])',
    'button:not([disabled]):not([tabindex^="-"])',
    'iframe:not([tabindex^="-"])',
    'audio[controls]:not([tabindex^="-"])',
    'video[controls]:not([tabindex^="-"])',
    '[contenteditable]:not([tabindex^="-"])',
    '[tabindex]:not([tabindex^="-"])',
  ];
  
  // keys
  export const SHIFT_KEY = 'Shift';
  export const TAB_KEY = 'Tab';
  export const ESCAPE_KEY = 'Escape';
  export const SPACE_KEY = ' ';
  export const ENTER_KEY = 'Enter';
  export const ARROW_DOWN = 'ArrowDown';
  export const ARROW_UP = 'ArrowUp';
  export const HOME_KEY = 'Home';
  export const END_KEY = 'End';
  
  // events
  export const KEY_DOWN = 'keydown';
  export const COOKIE_EVENT = 'cookiesSelected';
  export const FOCUS_IN = 'focusin';
  export const REVEAL_PROMO = 'revealPromo';
  export const CONTAINER_LOADED = 'containerLoaded';
  
  // General
  export const CONTENT_TYPE = 'application/json';
  
  // Media Queries
  window.isMobile = window.matchMedia('(max-width: 767px)').matches;
  window.isTablet = window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches;
  window.isDesktop = window.matchMedia('(min-width: 1024px)').matches;