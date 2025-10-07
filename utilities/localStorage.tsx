import AsyncStorage from "@react-native-async-storage/async-storage";
import { exampleToDos } from "@/data/todos";

import { ToDo } from "@/types/todo";
import { Try } from "expo-router/build/views/Try";

type LocalStorage = {
  fetchData: () => Promise<ToDo[]>;
  storeData: (dataToSave: ToDo[]) => Promise<void>;
};

function LocalStorage(): LocalStorage {
  const LOCAL_STORAGE_KEY = "TodoApp";

  async function fetchData() {
    // return exampleToDos;

    try {
      const jsonValue = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
      const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;

      if (storageTodos && storageTodos.length) {
        return storageTodos;
      } else {
        return exampleToDos;
      }
    } catch (error) {
      throw new Error(`Failed to fetch todos from storage: ${error}`);
    }
  }

  async function storeData(dataToSave: ToDo[]) {
    try {
      const jsonValue = JSON.stringify(dataToSave);
      await AsyncStorage.setItem(LOCAL_STORAGE_KEY, jsonValue);
    } catch (error) {
      throw new Error(`Failed to store todos: ${error}`);
    }
  }

  return { fetchData, storeData };
}

export { LocalStorage };
