import AsyncStorage from "@react-native-async-storage/async-storage";
import { exampleToDos } from "@/data/todos";

import { ToDo } from "@/types/todo";

type LocalStorage = {
  fetchData: () => Promise<ToDo[]>;
  storeData: (dataToSave: ToDo[]) => Promise<void>;
};

const LOCAL_STORAGE_KEY = "TodoApp";

function LocalStorage(): LocalStorage {
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

export { LocalStorage, LOCAL_STORAGE_KEY };
