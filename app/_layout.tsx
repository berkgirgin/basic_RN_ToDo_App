import { Stack, useRouter } from "expo-router";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ToDoLogicProvider } from "../context/todoLogicContext";
import { ThemeProvider, useThemeContext } from "@/context/themeContext";
import { StatusBar } from "expo-status-bar";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { Text, Pressable } from "react-native";

// Top-level hook is fine here because this component is rendered inside ThemeProvider
function ThemedStatusBar() {
  const { colorScheme } = useThemeContext();

  return (
    <StatusBar
      style={colorScheme === "dark" ? "light" : "dark"} // text/icons color
      backgroundColor="transparent" // background for Android
      translucent
    />
  );
}

// This component wraps Stack and reads theme context safely
function ThemedStack() {
  const router = useRouter();
  const { theme, colorScheme, myFontFamily } = useThemeContext();

  return (
    <Stack
      screenOptions={{
        headerRight: () => <ThemeToggleButton />,
        headerStyle: {
          backgroundColor: colorScheme === "light" ? "white" : "black",
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: "bold",
          fontFamily: myFontFamily,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Overview" }} />
      <Stack.Screen name="todos/index" options={{ title: "All Your Wishes" }} />
      <Stack.Screen
        name="todos/[id]"
        options={{
          title: "Editing a Wish",
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const insets = useSafeAreaInsets(); // safe area top for notch/status bar
  const HEADER_HEIGHT = 56; // default stack header height

  return (
    <ToDoLogicProvider>
      <ThemeProvider>
        <SafeAreaProvider>
          <ThemedStatusBar />
          <ThemedStack />
        </SafeAreaProvider>
      </ThemeProvider>
    </ToDoLogicProvider>
  );
}
