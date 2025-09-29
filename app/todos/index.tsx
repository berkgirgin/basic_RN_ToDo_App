import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useTodoLogicContext } from "@/context/todoLogicContext";

import { ToDo } from "@/types/todo";

export default function MainPage() {
  const todoLogic = useTodoLogicContext();

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

  importantTodos.sort((a, b) => b.id - a.id);
  nonImportantTodos.sort((a, b) => b.id - a.id);
  //********************** */

  const [input, setInput] = useState("");

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
          <Text>ID: {item.id}</Text>
          <Text>Title: {item.title}</Text>
          <Text>Is Important: {item.isImportant ? "yes" : "no"}</Text>
          <Text>Is Completed: {item.isCompleted ? "yes" : "no"}</Text>
          <Text>Time of Completion: {item.timeOfCompletion}</Text>
        </Pressable>
        <Pressable onPress={() => todoLogic.deleteToDo(id)}>
          <Text>Delete</Text>
        </Pressable>
      </View>
    );
  }
  //********************** */

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="enter a To Do.."
        />
        <Pressable
          onPress={() => {
            todoLogic.addToDo(input);
            setInput("");
          }}
        >
          <Text>Add</Text>
        </Pressable>
      </View>

      <FlatList
        style={styles.flatlist}
        data={todoLogic.toDosArray}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  inputContainer: { gap: 10 },
  flatlist: {
    borderWidth: 2,
    borderColor: "black",
  },
  flatlistItem: {},
});
