import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ToDoLogicProvider } from "../context/todoLogicContext";

export default function RootLayout() {
  return (
    <ToDoLogicProvider>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="index" />
          <Stack.Screen name="todos/[id]" />
        </Stack>
      </SafeAreaProvider>
    </ToDoLogicProvider>
  );
}
