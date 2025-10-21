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
import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from "react";

import { DateHelper } from "../utilities/dateHelper";
import { LocalStorage } from "@/utilities/localStorage";
import {
  getAddedMessage,
  getCompletedMessage,
} from "@/utilities/statusMessagesHelper";
import { sortTodoList } from "@/utilities/sortTodoList";
import { exampleToDos } from "@/data/todos";
import { ToDo } from "@/types/todo";

type ToDoLogicProps = {
  isImportantLimitReached: boolean;
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
  MAX_IMPORTANT_TODO_LIMIT: number;
};

const dateHelper = DateHelper();
const localStorage = LocalStorage();

const todoLogicContext = createContext<ToDoLogicProps | null>(null);
function useTodoLogicContext() {
  const context = useContext(todoLogicContext);
  if (!context) {
    throw new Error("todoLogicContext must be used within a ToDoLogicProvider");
  }
  return context;
}

function ToDoLogicProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  // latest toDo with biggest ID should be first, not last
  const [toDosArray, setToDosArray] = useState<ToDo[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const initialData = await localStorage.fetchData();
        setToDosArray(initialData);
      } catch (error) {
        console.error("Failed to load todos:", error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const storeData = async () => {
      try {
        await localStorage.storeData(toDosArray);
      } catch (error) {
        console.error("Failed to store todos:", error);
      }
    };

    storeData();
  }, [toDosArray]);

  // logic for max important todo limit
  const MAX_IMPORTANT_TODO_LIMIT = 4;
  let countImportantTodos = 0;

  for (let i = 0; i < toDosArray.length; i++) {
    const todo = toDosArray[i];
    if (todo.isImportant) countImportantTodos++;
  }

  const isImportantLimitReached =
    countImportantTodos >= MAX_IMPORTANT_TODO_LIMIT;
  // **********************+

  function addToDo(input: string): void {
    // when input is empty, nothing should happen.
    if (input == "" || undefined) {
      return;
    }

    const newId = Date.now();

    const newToDo: ToDo = {
      id: newId,
      title: input,
      isImportant: false, // dont edit this, might break the important limit logic
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
    // if (isImportantLimitReached) return;

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
    router.navigate(`./todos/${id}`); // navigate is to avoid duplicates on stack
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
        isImportantLimitReached,
        addToDo,
        deleteToDo,
        updateToDo,
        handleTodoShortPress,
        handleTodoLongPress,
        toDosArray,
        getOverviewData,
        MAX_IMPORTANT_TODO_LIMIT,
      }}
    >
      {children}
    </todoLogicContext.Provider>
  );
}

export { ToDoLogicProvider, useTodoLogicContext };
