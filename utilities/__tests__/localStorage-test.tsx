jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocalStorage, LOCAL_STORAGE_KEY } from "../localStorage";
import { exampleToDos } from "@/data/todos";
import type { ToDo } from "@/types/todo";

describe("LocalStorage", () => {
  const storage = LocalStorage();

  // Check if placement is ok
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchData", () => {
    test("returns stored todos if present", async () => {
      const mockTodos: ToDo[] = [
        {
          id: 1,
          title: "mock todo",
          isImportant: true,
          isCompleted: false,
          timeOfEntry: "2025-09-20",
          timeOfCompletion: null,
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockTodos)
      );

      const result = await storage.fetchData();
      expect(result).toEqual(mockTodos);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(LOCAL_STORAGE_KEY);
    });

    test("returns exampleToDos if storage is empty", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await storage.fetchData();
      expect(result).toEqual(exampleToDos);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(LOCAL_STORAGE_KEY);
    });
    test("throws error when AsyncStorage.getItem fails", async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error());

      await expect(storage.fetchData()).rejects.toThrow();
    });
  });

  describe("storeData", () => {
    test("stores todos correctly", async () => {
      const dataToSave: ToDo[] = [
        {
          id: 1,
          title: "mock todo",
          isImportant: true,
          isCompleted: false,
          timeOfEntry: "2025-09-20",
          timeOfCompletion: null,
        },
      ];
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await storage.storeData(dataToSave);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEY,
        JSON.stringify(dataToSave)
      );
    });
    test("throws error when AsyncStorage.setItem fails", async () => {
      const failingData: ToDo[] = [
        {
          id: 3,
          title: "Broken Save",
          isImportant: false,
          isCompleted: false,
          timeOfEntry: "2025-09-22",
          timeOfCompletion: null,
        },
      ];

      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error("setItem error")
      );

      await expect(storage.storeData(failingData)).rejects.toThrow(Error);
    });
  });
});
