import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useTodoLogicContext } from "../../context/todoLogicContext";
import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { useThemeContext, Theme, ColorScheme } from "@/context/themeContext";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ToDo } from "@/types/todo";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";

export default function EditScreen() {
  const navigation = useNavigation();

  const id = parseInt(useLocalSearchParams<{ id: string }>().id);

  const todoLogic = useTodoLogicContext();
  const { theme, colorScheme, myFontFamily } = useThemeContext();

  const styles = createStyles(theme, colorScheme);

  const selectedTodo = todoLogic.toDosArray.find((todo) => todo.id === id);
  if (!selectedTodo) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={[styles.errorText, { fontFamily: myFontFamily }]}>
          Todo not found
        </Text>
      </SafeAreaView>
    );
  }

  const [input, setInput] = useState(selectedTodo.title);
  const [newTodo, setNewTodo] = useState<ToDo>({ ...selectedTodo });

  const isSaveButtonDisabled =
    input === selectedTodo.title &&
    newTodo.isImportant === selectedTodo.isImportant &&
    newTodo.isCompleted === selectedTodo.isCompleted;

  function handleSave() {
    todoLogic.updateToDo(newTodo);
    // router.replace("/todos");
    router.back();
  }

  function handleCancel() {
    // router.replace("/todos");
    router.back();
  }

  function toggleIsImportant() {
    if (todoLogic.isImportantLimitReached && !newTodo.isImportant) {
      Alert.alert(
        "EVIL WOMAN!",
        `You can only have ${todoLogic.MAX_IMPORTANT_TODO_LIMIT} important todos at a time. Please unmark one before marking this todo as important.`,
        [{ text: "OK" }]
      );
      return;
    }

    setNewTodo((prev) => {
      return { ...prev, isImportant: !newTodo.isImportant };
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          maxLength={30}
          onChangeText={(text) => {
            setInput(text);
            setNewTodo((prev) => {
              return { ...prev, title: text };
            });
          }}
          placeholder="editing a ToDo.."
          placeholderTextColor="grey"
          style={[styles.input, { fontFamily: myFontFamily }]}
        />

        <Pressable onPress={toggleIsImportant} style={styles.starButton}>
          <FontAwesome
            name={newTodo.isImportant ? "star" : "star-o"}
            size={60}
            color={newTodo.isImportant ? theme.gold : "grey"}
          />
        </Pressable>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[
            styles.button,
            styles.saveButton,
            isSaveButtonDisabled && styles.disabledButton,
          ]}
          onPress={handleSave}
          disabled={isSaveButtonDisabled}
        >
          <Text style={[styles.buttonText, { fontFamily: myFontFamily }]}>
            Save
          </Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}
        >
          <Text style={[styles.buttonText, { fontFamily: myFontFamily }]}>
            Cancel
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme: Theme, colorScheme: ColorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
      gap: 20,
      // marginTop: Platform.OS === "ios" ? -40 : 0,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      maxWidth: 1024,
      alignSelf: "center",
      marginBottom: 10,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.text,
    },
    inputContainer: {
      width: "100%",
      maxWidth: 1024,
      gap: 15,
      alignSelf: "center",
    },
    input: {
      borderColor: theme.button,
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
    },
    errorText: {
      color: "red",
      fontSize: 18,
    },
    actions: {
      flexDirection: "row",
      gap: 15,
      marginTop: 20,
      alignSelf: "center",
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    saveButton: {
      backgroundColor: theme.button,
    },
    cancelButton: {
      backgroundColor: theme.button,
    },
    disabledButton: {
      opacity: 0.5,
    },
    buttonText: {
      fontSize: 18,
      color: colorScheme === "dark" ? "black" : "white",
    },
    starButton: {
      padding: 4,
      borderRadius: 4,
      alignSelf: "flex-start",
      justifyContent: "center",
      alignItems: "center",
    },
  });
}
