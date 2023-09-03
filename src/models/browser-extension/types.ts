// Chrome Extension Settings
// App
export enum Themes {
  DARK = 'dark',
  LIGHT = 'light',
}
export type ActiveTime = {
  from: number; //between 0 - 86400 seconds (86400 in a day)
  to: number;
};

export enum AppStorageKeys {
  PAUSED = 'paused',
  LANGUAGE = 'language',
  TIME = 'activeTime',
  THEME = 'theme',
}
export enum AvailableLanguages {
  EN = 'en',
  ES = 'es',
}

export interface AppSettings {
  [AppStorageKeys.PAUSED]: boolean;
  [AppStorageKeys.LANGUAGE]: AvailableLanguages;
  [AppStorageKeys.TIME]: ActiveTime;
  [AppStorageKeys.THEME]?: Themes;
}
export const initialAppSettingsState: AppSettings = {
  [AppStorageKeys.PAUSED]: false,
  [AppStorageKeys.LANGUAGE]: AvailableLanguages.EN,
  [AppStorageKeys.TIME]: {
    from: 3600, // 1 am
    to: 82800, // 11 pm
  },
};
// Beaks
export enum BreaksStorageKeys {
  ENABLED = 'enabled',
  ALERT = 'alert',
  FREQUENCY = 'frequency',
}

export interface BreaksSettings {
  [BreaksStorageKeys.ENABLED]: boolean;
  [BreaksStorageKeys.ALERT]: boolean;
  [BreaksStorageKeys.FREQUENCY]: number;
}

export const initialBreaksSettingsState: BreaksSettings = {
  [BreaksStorageKeys.ENABLED]: false,
  [BreaksStorageKeys.ALERT]: false,
  [BreaksStorageKeys.FREQUENCY]: 3600,
};

// Colors
export const fallBackColorsArray = [
  '#EBCF6B',
  '#B9AD8C',
  '#F1812E',
  '#E7595B',
  '#90CCE5',
  '#F4BDF0',
];

export const COLORS_SETTINGS_STORAGE_KEY = 'colors';

export enum ColorsStorageKeys {
  ENABLED = 'enabled',
  OPACITY = 'opacity',
  SELECTED_COLOR = 'selectedColor',
}

export interface ColorsSettings {
  [ColorsStorageKeys.ENABLED]: boolean;
  [ColorsStorageKeys.OPACITY]: string;
  [ColorsStorageKeys.SELECTED_COLOR]: string;
}

export const initialColorsSettingsState: ColorsSettings = {
  [ColorsStorageKeys.ENABLED]: false,
  [ColorsStorageKeys.OPACITY]: '0.5',
  [ColorsStorageKeys.SELECTED_COLOR]: fallBackColorsArray[0],
};

// Sound
export enum SoundsStorageKeys {
  ENABLED = 'enabled',
}

export interface SoundsSettings {
  [SoundsStorageKeys.ENABLED]: boolean;
}

export const initialSoundSettingsState: SoundsSettings = {
  [SoundsStorageKeys.ENABLED]: false,
};

export type ScreenTime = {
  [key: string]: number;
};
