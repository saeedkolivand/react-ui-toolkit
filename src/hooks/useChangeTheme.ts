import { useTheme } from "@/context";

export const useChangeTheme = () => {
  const { theme, toggleTheme } = useTheme();

  const isDarkMode = theme === "dark";
  const isLightMode = theme === "light";

  const setDarkMode = () => {
    if (theme !== "dark") {
      toggleTheme();
    }
  };

  const setLightMode = () => {
    if (theme !== "light") {
      toggleTheme();
    }
  };

  return {
    theme,
    isDarkMode,
    isLightMode,
    toggleTheme,
    setDarkMode,
    setLightMode,
  };
};
