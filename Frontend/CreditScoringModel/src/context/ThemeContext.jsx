import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const themes = {
  light: {
    bg:      "#F7F8FC",
    surface: "#FFFFFF",
    border:  "#E2E6F0",
    text:    "#0F1724",
    muted:   "#6B7A99",
    accent:  "#1B4FD8",
    accentBg:"#EEF2FF",
    shadow:  "rgba(15,23,36,0.07)",
  },
  dark: {
    bg:      "#0D1117",
    surface: "#161B27",
    border:  "#252D3D",
    text:    "#E8EDF5",
    muted:   "#7A87A3",
    accent:  "#3B82F6",
    accentBg:"#1E2D4A",
    shadow:  "rgba(0,0,0,0.3)",
  },
};

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);
  const t = dark ? themes.dark : themes.light;
  return (
    <ThemeContext.Provider value={{ t, dark, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
