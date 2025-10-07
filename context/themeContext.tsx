import { useState, createContext, useContext, type ReactNode } from "react";
import { Appearance } from "react-native";
import { Colors } from "@/constants/themeColors";

import { Poppins_500Medium, useFonts } from "@expo-google-fonts/poppins/";

export type Theme = {
  text: string;
  background: string;
  zebraStripeBackground: {
    firstColor: string;
    secondColor: string;
  };
  gold: string;
  icon: string;
  button: string;
};
export type ColorScheme = "light" | "dark";

type ThemeProps = {
  colorScheme: ColorScheme;
  theme: Theme;
  toggleTheme: () => void;
  myFontFamily: string;
};

const themeContext = createContext<ThemeProps | null>(null);

function useThemeContext() {
  const context = useContext(themeContext);
  if (!context) {
    throw new Error("todoLogicContext must be used within a ToDoLogicProvider");
  }
  return context;
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorScheme, setColorScheme] = useState(
    Appearance.getColorScheme() || "dark"
  );

  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  const [loaded, error] = useFonts({
    Poppins_500Medium,
  });

  const myFontFamily = "Poppins_500Medium";

  if (!loaded && !error) {
    return null;
  }

  function toggleTheme() {
    if (colorScheme === "dark") {
      setColorScheme("light");
    } else {
      setColorScheme("dark");
    }
  }

  return (
    <themeContext.Provider
      value={{ colorScheme, theme, toggleTheme, myFontFamily }}
    >
      {children}
    </themeContext.Provider>
  );
}

export { useThemeContext, ThemeProvider };
