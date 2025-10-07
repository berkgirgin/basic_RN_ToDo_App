import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  SectionList,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import { ThemeToggleButton } from "@/components/ThemeToggleButton";
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
  const { colorScheme, theme } = useThemeContext();

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
  function renderItem({ item, index }: { item: ToDo; index: number }) {
    return (
      <Animated.View
        style={[
          styles.flatlistItem,
          index % 2 === 0
            ? styles.flatlistItem_zebraStripe1
            : styles.flatlistItem_zebraStripe2,
        ]}
        layout={LinearTransition}
      >
        <Pressable
          onPress={() => todoLogic.handleTodoShortPress(item.id)}
          onLongPress={() => todoLogic.handleTodoLongPress(item.id)}
          style={styles.todoTextContainer}
        >
          <Text
            style={[styles.todoText, item.isCompleted && styles.completedText]}
          >
            {item.title}
          </Text>
        </Pressable>
        <Pressable onPress={() => todoLogic.deleteToDo(item.id)}>
          <MaterialCommunityIcons
            name="delete-circle"
            size={36}
            color={theme.icon}
          />
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
          maxLength={30}
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

        {/* <ThemeToggleButton /> */}
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
      marginTop: Platform.OS === "ios" ? -40 : 0,
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
      borderColor: theme.button,
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      fontSize: 18,
      fontWeight: "bold",
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
      borderColor: theme.text,
      borderBottomWidth: 1,
      borderTopWidth: 1,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
    },
    flatlistItem_zebraStripe1: {
      backgroundColor: theme.zebraStripeBackground.firstColor,
    },
    flatlistItem_zebraStripe2: {
      backgroundColor: theme.zebraStripeBackground.secondColor,
    },
    todoTextContainer: {
      flex: 1,
    },
    todoText: {
      fontSize: 18,
      color: theme.text,
      // textAlignVertical: "center",
    },
    completedText: {
      textDecorationLine: "line-through",
      color: "grey",
    },
  });
}
