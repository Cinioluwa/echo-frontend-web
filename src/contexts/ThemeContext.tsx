import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemePreference = "system" | "light" | "dark";
type ActiveTheme = "light" | "dark";

interface ThemeContextValue {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

const STORAGE_KEY = "echo-theme";
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const readPreference = (): ThemePreference => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch (error) {
    console.warn("[Theme] Could not read the saved theme preference:", error);
  }
  return "system";
};

const applyTheme = (preference: ThemePreference, activeTheme: ActiveTheme) => {
  const root = document.documentElement;
  root.dataset.theme = activeTheme;
  root.dataset.themePreference = preference;
  root.style.colorScheme = activeTheme;

  const themeColor = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );
  if (themeColor) {
    themeColor.content =
      getComputedStyle(root).getPropertyValue("--theme-color").trim();
  }

  const manifest = document.querySelector<HTMLLinkElement>(
    'link[rel="manifest"]',
  );
  if (manifest) {
    manifest.href =
      activeTheme === "dark" ? "/manifest-dark.json" : "/manifest.json";
  }
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreferenceState] = useState<ThemePreference>(readPreference);
  const [systemTheme, setSystemTheme] = useState<ActiveTheme>(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  );
  const activeTheme: ActiveTheme =
    preference === "system" ? systemTheme : preference;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", updateSystemTheme);
    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }, []);

  useEffect(() => {
    applyTheme(preference, activeTheme);
  }, [preference, activeTheme]);

  const setPreference = useCallback((nextPreference: ThemePreference) => {
    setPreferenceState(nextPreference);
    try {
      localStorage.setItem(STORAGE_KEY, nextPreference);
    } catch (error) {
      console.warn("[Theme] Could not save the theme preference:", error);
    }
  }, []);

  const value = useMemo(
    () => ({ preference, setPreference }),
    [preference, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Context files intentionally co-locate the provider and its consumer hook.
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
