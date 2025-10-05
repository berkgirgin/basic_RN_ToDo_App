import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  SectionList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useTodoLogicContext } from "@/context/todoLogicContext";
import { useThemeContext } from "@/context/themeContext";
import { Theme, ColorScheme } from "@/context/themeContext";
import { sortTodoList } from "@/utilities/sortTodoList";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import Animated, { LinearTransition } from "react-native-reanimated";

import { ToDo } from "@/types/todo";

export default function MainPage() {
  const todoLogic = useTodoLogicContext();
  const { colorScheme, theme, toggleTheme } = useThemeContext();

  const styles = createStyles(theme, colorScheme);

  const [input, setInput] = useState("");

  // split todos into important and non-important
  const importantTodos = todoLogic.toDosArray.filter((t) => t.isImportant);
  const nonImportantTodos = todoLogic.toDosArray.filter((t) => !t.isImportant);

  sortTodoList(importantTodos);
  sortTodoList(nonImportantTodos);

  const sections = [
    { title: "IMPORTANT TODOS", data: importantTodos },
    { title: "REST OF THE TODOS", data: nonImportantTodos },
  ];

  // render a single todo item
  function renderItem({ item }: { item: ToDo }) {
    return (
      <Animated.View style={styles.flatlistItem} layout={LinearTransition}>
        <Pressable
          onPress={() => todoLogic.handleTodoShortPress(item.id)}
          onLongPress={() => todoLogic.handleTodoLongPress(item.id)}
          style={{ flex: 1 }}
        >
          <Text
            style={[styles.todoText, item.isCompleted && styles.completedText]}
          >
            {item.title}
          </Text>
        </Pressable>
        <Pressable onPress={() => todoLogic.deleteToDo(item.id)}>
          <MaterialCommunityIcons name="delete-circle" size={36} color="red" />
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Input + buttons */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="enter a To Do.."
          placeholderTextColor={"grey"}
        />

        <Pressable
          style={[styles.button, styles.addButton]}
          onPress={() => {
            if (input.trim()) {
              todoLogic.addToDo(input);
              setInput("");
            }
          }}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.themeButton]}
          onPress={toggleTheme}
        >
          <MaterialIcons
            name={colorScheme === "dark" ? "dark-mode" : "light-mode"}
            size={24}
            color={theme.text}
          />
        </Pressable>
      </View>

      <SectionList
        style={{ flex: 1 }}
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Animated.View
            layout={LinearTransition}
            style={{
              backgroundColor: theme.background, // keeps header background consistent
              paddingVertical: 10,
            }}
          >
            <Text style={styles.todosTitle}>{title}</Text>
          </Animated.View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        stickySectionHeadersEnabled={true}
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </SafeAreaView>
  );
}

function createStyles(theme: Theme, colorScheme: ColorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      padding: 10,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
      gap: 10,
    },
    input: {
      flex: 1,
      borderColor: "grey",
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      fontSize: 18,
      color: theme.text,
    },
    button: {},
    addButton: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10,
    },
    addButtonText: {
      fontSize: 18,
      color: colorScheme === "dark" ? "black" : "white",
    },
    themeButton: {
      borderRadius: 5,
      padding: 10,
    },
    todosTitle: {
      color: theme.text,
      fontSize: 20,
      textAlign: "center",
      marginVertical: 10,
    },
    flatlistItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
      borderBottomColor: "grey",
      borderBottomWidth: 1,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
      gap: 4,
    },
    todoText: {
      flex: 1,
      fontSize: 18,
      color: theme.text,
    },
    completedText: {
      textDecorationLine: "line-through",
      color: "grey",
    },
  });
}
