import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useThemeContext } from "@/context/themeContext";

function ThemeToggleButton() {
  const { colorScheme, theme, toggleTheme } = useThemeContext();

  return (
    <Pressable style={[styles.themeButton]} onPress={toggleTheme}>
      <MaterialIcons
        name={colorScheme === "dark" ? "dark-mode" : "light-mode"}
        size={24}
        color={theme.text}
      />
    </Pressable>
  );
}

export { ThemeToggleButton };

const styles = StyleSheet.create({
  themeButton: {
    borderRadius: 5,
    padding: 10,
  },
});
