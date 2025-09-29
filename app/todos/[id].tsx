import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useTodoLogicContext } from "../../context/todoLogicContext";
import { useLocalSearchParams, router } from "expo-router";

import { ToDo } from "@/types/todo";

export default function EditScreen() {
  const id = parseInt(useLocalSearchParams<{ id: string }>().id);

  const todoLogic = useTodoLogicContext();

  const selectedTodo = todoLogic.toDosArray.find((todo) => todo.id === id);
  if (!selectedTodo) {
    return (
      <SafeAreaView>
        <Text>Todo not found</Text>
      </SafeAreaView>
    );
  }

  // initial values of the todo item
  const [input, setInput] = useState(selectedTodo.title);

  function handleSave() {
    const newTodo: ToDo = { ...selectedTodo!, title: input }; // above has undefined check for selectedTodo
    todoLogic.updateToDo(newTodo);
    router.push("/todos");
  }

  function handleCancel() {
    // To Add: test scenario: edit something, cancel, go to that page again
    // TO FIX: when u go back to /todos, going back with stack goes to /todos/[id]
    router.push("/todos");
  }

  function toggleIsImportant() {
    const newTodo: ToDo = {
      ...selectedTodo!,
      isImportant: !selectedTodo!.isImportant,
    }; // above has undefined check for selectedTodo
    todoLogic.updateToDo(newTodo);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text>ID: {selectedTodo.id}</Text>

        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="editing a ToDo.."
        />

        <Text>Is Important: {selectedTodo.isImportant ? "yes" : "no"}</Text>
        <Text>Is Completed: {selectedTodo.isCompleted ? "yes" : "no"}</Text>
      </View>

      <Pressable onPress={handleSave}>
        <Text>Save</Text>
      </Pressable>

      <Pressable onPress={handleCancel}>
        <Text>Cancel</Text>
      </Pressable>

      <Pressable onPress={toggleIsImportant}>
        <Text>Toggle Important</Text>
      </Pressable>
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
  inputContainer: {},
});
