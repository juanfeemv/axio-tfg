import { createContext, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';

const MAX_SPOKEN_LENGTH = 140;
const DEFAULT_LANG = 'es-ES';
const STORAGE_ENABLED = 'a11y_tts_enabled';
const STORAGE_VOLUME = 'a11y_tts_volume';

type A11yState = {
  ttsEnabled: boolean;
  setTtsEnabled: (value: boolean) => void;
  ttsVolume: number;
  setTtsVolume: (value: number) => void;
};

const A11yContext = createContext<A11yState | null>(null);

const clampVolume = (value: number) => {
  if (Number.isNaN(value)) return 1;
  return Math.min(1, Math.max(0, value));
};

const getStoredBoolean = (key: string, fallback: boolean) => {
  if (typeof window === 'undefined') return fallback;
  const stored = window.localStorage.getItem(key);
  if (stored === null) return fallback;
  return stored === 'true';
};

const getStoredVolume = (fallback: number) => {
  if (typeof window === 'undefined') return fallback;
  const stored = window.localStorage.getItem(STORAGE_VOLUME);
  if (!stored) return fallback;
  const parsed = Number.parseFloat(stored);
  return clampVolume(parsed);
};

const isDisabled = (element: HTMLElement) => {
  if (element.getAttribute('aria-disabled') === 'true') return true;
  if (element instanceof HTMLButtonElement || element instanceof HTMLInputElement) {
    return element.disabled;
  }
  return false;
};

const getLabelledByText = (element: HTMLElement) => {
  const labelledBy = element.getAttribute('aria-labelledby');
  if (!labelledBy) return '';
  const ids = labelledBy.split(' ').map((value) => value.trim()).filter(Boolean);
  const parts = ids
    .map((id) => document.getElementById(id)?.textContent?.trim() || '')
    .filter(Boolean);
  return parts.join(' ');
};

const getSpeakText = (element: HTMLElement) => {
  if (element.getAttribute('data-speech-off') === 'true') return '';
  if (element.getAttribute('aria-hidden') === 'true') return '';

  const dataSpeech = element.getAttribute('data-speech');
  if (dataSpeech) return dataSpeech.trim();

  const labelledBy = getLabelledByText(element);
  if (labelledBy) return labelledBy;

  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel.trim();

  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    const placeholder = element.placeholder?.trim();
    if (placeholder) return placeholder;
    const value = element.value?.trim();
    if (value) return value;
  }

  if (element instanceof HTMLImageElement) {
    return element.alt?.trim() || '';
  }

  const title = element.getAttribute('title');
  if (title) return title.trim();

  return element.textContent?.trim() || '';
};

const isSpeakable = (element: HTMLElement) => {
  if (element.hasAttribute('data-speech')) return true;
  return element.matches(
    'button, a, input, textarea, select, [role="button"], [role="link"], [role="tab"], [role="menuitem"], [role="option"], [role="switch"]'
  );
};

const findSpeakTarget = (start: HTMLElement | null) => {
  let current = start;
  while (current && current !== document.body) {
    if (isSpeakable(current)) return current;
    current = current.parentElement;
  }
  return null;
};

const speakText = (text: string, volume: number) => {
  if (!text) return;
  if (typeof window === 'undefined') return;
  if (!('speechSynthesis' in window)) return;

  const trimmed = text.length > MAX_SPOKEN_LENGTH ? `${text.slice(0, MAX_SPOKEN_LENGTH)}...` : text;
  const utterance = new SpeechSynthesisUtterance(trimmed);
  utterance.lang = DEFAULT_LANG;
  utterance.volume = clampVolume(volume);

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

export default function A11yProvider({ children }: { children: ReactNode }) {
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(() => getStoredBoolean(STORAGE_ENABLED, false));
  const [ttsVolume, setTtsVolume] = useState<number>(() => getStoredVolume(1));
  const lastTargetRef = useRef<HTMLElement | null>(null);
  const lastTextRef = useRef('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_ENABLED, String(ttsEnabled));
    if (!ttsEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [ttsEnabled]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_VOLUME, String(clampVolume(ttsVolume)));
  }, [ttsVolume]);

  const contextValue = useMemo(() => ({
    ttsEnabled,
    setTtsEnabled,
    ttsVolume,
    setTtsVolume: (value: number) => setTtsVolume(clampVolume(value))
  }), [ttsEnabled, ttsVolume]);

  useEffect(() => {
    const handleSpeak = (event: Event) => {
      const target = findSpeakTarget(event.target as HTMLElement | null);
      if (!ttsEnabled || !target || isDisabled(target)) return;

      const text = getSpeakText(target);
      if (!text) return;

      if (lastTargetRef.current === target && lastTextRef.current === text) return;
      lastTargetRef.current = target;
      lastTextRef.current = text;

      speakText(text, ttsVolume);
    };

    const handleMouseOver = (event: MouseEvent) => handleSpeak(event);
    const handleFocusIn = (event: FocusEvent) => handleSpeak(event);

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, [ttsEnabled, ttsVolume]);

  return <A11yContext.Provider value={contextValue}>{children}</A11yContext.Provider>;
}

export const useA11y = () => {
  const context = useContext(A11yContext);
  if (!context) {
    throw new Error('useA11y must be used within A11yProvider');
  }
  return context;
};
