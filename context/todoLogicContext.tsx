import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { useState, createContext, useContext, type ReactNode } from "react";

import { DateHelper } from "../utilities/dateHelper";
import {
  getAddedMessage,
  getCompletedMessage,
} from "@/utilities/statusMessagesHelper";
import { exampleToDos } from "@/data/todos";
import { ToDo } from "@/types/todo";

type ToDoLogicProps = {
  addToDo: (input: string) => void;
  deleteToDo: (id: number) => void;
  updateToDo: (updatedTodo: ToDo) => void;
  handleTodoShortPress: (id: number) => void;
  handleTodoLongPress: (id: number) => void;
  toDosArray: ToDo[];
  getOverviewData: () => {
    countRecentlyAdded: number;
    statusMessageRecentlyAdded: string;
    countRecentlyCompleted: number;
    statusMessageRecentlyCompleted: string;
  };
};

const dateHelper = DateHelper();

const todoLogicContext = createContext<ToDoLogicProps | null>(null);
function useTodoLogicContext() {
  const context = useContext(todoLogicContext);
  if (!context) {
    throw new Error("todoLogicContext must be used within a ToDoLogicProvider");
  }
  return context;
}

function ToDoLogicProvider({ children }: { children: ReactNode }) {
  const router = useRouter(); // TO FIX: is it the correct way?
  const MAX_IMPORTANT_TODO_LIMIT = 5;

  // latest toDo with biggest ID should be first, not last
  const [toDosArray, setToDosArray] = useState<ToDo[]>(
    exampleToDos.sort((a, b) => b.id - a.id)
  );

  function addToDo(input: string): void {
    // when input is empty, nothing should happen. Check logic again
    if (input == "" || undefined) {
      return;
    }

    // TO ADD: trim the input before adding

    // logic to entry time etc..
    const newId = toDosArray.length === 0 ? 1 : toDosArray[0].id + 1;
    if (newId > 1000000) {
      throw new Error("You have reached 1.000.000 count. Contact Berk");
    }

    const newToDo: ToDo = {
      id: newId,
      title: input,
      isImportant: false,
      isCompleted: false,
      timeOfEntry: dateHelper.getCurrentDate(),
      timeOfCompletion: null,
    };

    setToDosArray((prev) => [newToDo, ...prev]);
  }

  function deleteToDo(id: number) {
    setToDosArray((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }

  function updateToDo(updatedTodo: ToDo) {
    // checking for max important todo limit
    if (updatedTodo.isCompleted) {
      let countImportantTodos = 0;

      for (let i = 0; i < toDosArray.length; i++) {
        const todo = toDosArray[i];

        if (todo.isImportant) countImportantTodos++;
      }

      if (countImportantTodos >= MAX_IMPORTANT_TODO_LIMIT) {
        // TO DO: add an alert here
        return;
      }
    }
    //*********************** */

    const newTodos = toDosArray.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    );

    setToDosArray(newTodos);
  }

  // completing the task
  function handleTodoShortPress(id: number) {
    const findTodo = toDosArray.find((todo) => todo.id === id);
    if (!findTodo) {
      throw new Error("a todo with the id could not be found");
    }

    let updatedTodo;

    if (findTodo.isCompleted) {
      updatedTodo = {
        ...findTodo,
        isCompleted: !findTodo.isCompleted,
        timeOfCompletion: null,
      };
    } else {
      updatedTodo = {
        ...findTodo,
        isCompleted: !findTodo.isCompleted,
        timeOfCompletion: dateHelper.getCurrentDate(),
      };
    }

    updateToDo(updatedTodo);
  }

  // going to the edit page
  function handleTodoLongPress(id: number) {
    router.push(`./todos/${id}`);
  }

  function getOverviewData() {
    const numberOfDays = 30;
    const today = dateHelper.getCurrentDate();

    let countRecentlyAdded = 0;
    let countRecentlyCompleted = 0;
    let statusMessageRecentlyAdded = "";
    let statusMessageRecentlyCompleted = "";

    for (let i = 0; i < toDosArray.length; i++) {
      const currentTodo = toDosArray[i];
      const isRecentlyAdded =
        dateHelper.daysBetween(currentTodo.timeOfEntry, today) < numberOfDays;
      const isRecentlyCompleted =
        currentTodo.isCompleted &&
        currentTodo.timeOfCompletion !== null &&
        dateHelper.daysBetween(currentTodo.timeOfCompletion, today) <
          numberOfDays;

      if (isRecentlyAdded) countRecentlyAdded++;
      if (isRecentlyCompleted) countRecentlyCompleted++;
    }

    statusMessageRecentlyAdded = getAddedMessage(countRecentlyAdded);
    statusMessageRecentlyCompleted = getCompletedMessage(
      countRecentlyCompleted
    );

    return {
      countRecentlyAdded,
      statusMessageRecentlyAdded,
      countRecentlyCompleted,
      statusMessageRecentlyCompleted,
    };
  }

  return (
    <todoLogicContext.Provider
      value={{
        addToDo,
        deleteToDo,
        updateToDo,
        handleTodoShortPress,
        handleTodoLongPress,
        toDosArray,
        getOverviewData,
      }}
    >
      {children}
    </todoLogicContext.Provider>
  );
}

export { ToDoLogicProvider, useTodoLogicContext };
