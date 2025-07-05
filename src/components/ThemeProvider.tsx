/* eslint-disable react-refresh/only-export-components */

import * as React from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => null,
});

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
  } else {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }
}

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }: React.PropsWithChildren) => {
  const [theme, setThemeState] = React.useState<Theme>("system");

  // Load saved preference on mount
  React.useEffect(() => {
    const stored = (localStorage.getItem("theme") as Theme | null) ?? "system";
    setThemeState(stored);
    applyTheme(stored);
  }, []);

  // Respond to system changes in system mode
  React.useEffect(() => {
    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => applyTheme("system");
    if (mql.addEventListener) {
      mql.addEventListener("change", listener);
    } else {
      // Safari and older browsers (deprecated API)
      (mql as unknown as { addListener: (cb: () => void) => void }).addListener(listener);
    }
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", listener);
      } else {
        // Deprecated API
        (mql as unknown as { removeListener: (cb: () => void) => void }).removeListener(listener);
      }
    };
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => React.useContext(ThemeContext);