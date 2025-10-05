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
  const [newTodo, setNewTodo] = useState<ToDo>({ ...selectedTodo });
  //   let newTodo = { ...selectedTodo, title: input };

  // REMINDER: Edit here if you include new fields
  const isSaveButtonDisabled =
    input === selectedTodo.title &&
    newTodo.isImportant === selectedTodo.isImportant &&
    newTodo.isCompleted === selectedTodo.isCompleted;

  function handleSave() {
    // const newTodo: ToDo = { ...selectedTodo!, title: input };
    // // above has undefined check for selectedTodo
    todoLogic.updateToDo(newTodo);
    router.push("/todos");
  }

  function handleCancel() {
    // To Add: test scenario: edit something, cancel, go to that page again
    // TO FIX: when u go back to /todos, going back with stack goes to /todos/[id]
    router.push("/todos");
  }

  function toggleIsImportant() {
    if (todoLogic.isImportantLimitReached) return;
    //TO DO: make the above better. Add an alert.

    setNewTodo((prev) => {
      return { ...prev, isImportant: !newTodo.isImportant };
    });

    // newTodo = { ...newTodo, isImportant: !newTodo.isImportant };

    // const newTodo: ToDo = {
    //   ...selectedTodo!,
    //   isImportant: !selectedTodo!.isImportant,
    // }; // above has undefined check for selectedTodo
    // todoLogic.updateToDo(newTodo);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text>ID: {selectedTodo.id}</Text>

        <TextInput
          value={input}
          onChangeText={(text) => {
            setInput(text);
            setNewTodo((prev) => {
              return { ...prev, title: text };
            });
          }}
          placeholder="editing a ToDo.."
        />

        <Text>Is Important: {newTodo.isImportant ? "yes" : "no"}</Text>
        <Text>Is Completed: {newTodo.isCompleted ? "yes" : "no"}</Text>
      </View>

      <Pressable onPress={handleSave} disabled={isSaveButtonDisabled}>
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
