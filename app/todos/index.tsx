import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
  ScrollView,
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

  // get important todos and rest of them
  //********************** */
  const importantTodos = [];
  const nonImportantTodos = [];

  for (let i = 0; i < todoLogic.toDosArray.length; i++) {
    const todo = todoLogic.toDosArray[i];

    if (todo.isImportant) {
      importantTodos.push(todo);
    } else {
      nonImportantTodos.push(todo);
    }
  }

  sortTodoList(importantTodos);
  sortTodoList(nonImportantTodos);

  //********************** */

  // todo items to be rendered in Flatlists
  //********************** */
  function renderItem({ item }: { item: ToDo }) {
    const { id } = item;
    return (
      <View style={styles.flatlistItem}>
        <Pressable
          onPress={() => todoLogic.handleTodoShortPress(id)}
          onLongPress={() => todoLogic.handleTodoLongPress(id)}
        >
          {/* <Text>ID: {item.id}</Text> */}
          <Text
            style={[styles.todoText, item.isCompleted && styles.completedText]}
          >
            Title: {item.title}
          </Text>
          {/* <Text>Is Important: {item.isImportant ? "yes" : "no"}</Text>
          <Text>Is Completed: {item.isCompleted ? "yes" : "no"}</Text>
          <Text>Time of Completion: {item.timeOfCompletion}</Text> */}
        </Pressable>
        <Pressable onPress={() => todoLogic.deleteToDo(id)}>
          <MaterialCommunityIcons
            name="delete-circle"
            size={36}
            color="red"
            // selectable={undefined} ??
          />
        </Pressable>
      </View>
    );
  }
  //********************** */

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="enter a To Do.."
        />

        <Pressable
          style={[styles.button, styles.addButton]}
          onPress={() => {
            todoLogic.addToDo(input);
            setInput("");
          }}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.themeButton]}
          onPress={() => {
            toggleTheme();
          }}
        >
          <MaterialIcons
            name={colorScheme === "dark" ? "dark-mode" : "light-mode"}
            size={24}
            color={theme.text}
          />
        </Pressable>
      </View>

      <View style={styles.todosMainContainer}>
        <View style={styles.todosContainer}>
          <Text style={styles.todosTitle}>IMPORTANT TODOS</Text>
          <Animated.FlatList
            style={styles.flatlist}
            data={importantTodos}
            renderItem={renderItem}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            itemLayoutAnimation={LinearTransition}
            keyboardDismissMode={"on-drag"}
          />
        </View>

        <View style={styles.todosContainer}>
          <Text style={styles.todosTitle}>REST OF THE TODOS</Text>
          <Animated.FlatList
            style={styles.flatlist}
            data={nonImportantTodos}
            renderItem={renderItem}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            itemLayoutAnimation={LinearTransition}
            keyboardDismissMode={"on-drag"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme: Theme, colorScheme: ColorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      // justifyContent: "center",
      // alignItems: "center",
      // gap: 20,
      backgroundColor: theme.background,

      // backgroundColor: darkColors.black,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      padding: 10,
      width: "100%",

      maxWidth: 1024,
      marginHorizontal: "auto",
      // pointerEvents:"auto" ???

      gap: 10,

      // for testing
      // borderWidth: 2,
      // borderColor: "pink",
    },
    input: {
      flex: 1,
      // borderColor: darkColors.grey,
      // color: darkColors.grey,

      borderColor: "grey",
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      fontSize: 18,
      minWidth: 0,
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
      color: theme.text,
      borderRadius: 5,
      padding: 10,
    },
    todosMainContainer: {
      flexDirection: "column",
      gap: 25,
    },
    todosTitle: {
      // color: darkColors.grey,
      color: theme.text,
      fontSize: 20,
      textAlign: "center",
    },
    todosContainer: {},
    flatlist: {
      // borderWidth: 2,
      // borderColor: "black",
    },
    flatlistItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 4,
      padding: 10,
      borderBottomColor: "grey",
      borderBottomWidth: 1,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
      // pointerEvents:"auto" ???
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
