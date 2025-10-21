import React from "react";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
  within,
} from "@testing-library/react-native";
import MainPage from "../app/todos/index";
import EditScreen from "../app/todos/[id]";
import { ToDoLogicProvider } from "../context/todoLogicContext";
import { ThemeProvider } from "../context/themeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock useRouter from expo-router
jest.mock("expo-router", () => {
  const navigateMock = jest.fn();

  const actual = jest.requireActual("expo-router");
  return {
    ...actual,
    useRouter: () => ({
      navigate: navigateMock,
    }),
  };
});

function WrappedMainPage() {
  return (
    <ThemeProvider>
      <ToDoLogicProvider>
        <MainPage />
      </ToDoLogicProvider>
    </ThemeProvider>
  );
}

async function renderMainPage() {
  render(<WrappedMainPage />);
  const textInput = await screen.findByTestId("todo-input");
  const addButton = await screen.findByTestId("add-button");
  return { textInput, addButton };
}

describe("INTEGRATION TESTS", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();

    const { useRouter } = require("expo-router");
    const router = useRouter();
    router.navigate.mockClear();
  });

  describe("MainPage Integration", () => {
    it("renders input and add button", async () => {
      const { textInput, addButton } = await renderMainPage();

      expect(textInput).toBeTruthy();
      expect(addButton).toBeTruthy();
    });

    it("can add a todo", async () => {
      const { textInput, addButton } = await renderMainPage();

      expect(screen.queryByText("New Todo")).toBeNull();

      fireEvent.changeText(textInput, "New Todo");
      fireEvent.press(addButton);

      expect(screen.findByText("New Todo")).toBeTruthy();
    });

    it("can delete a todo", async () => {
      const { textInput, addButton } = await renderMainPage();

      expect(screen.queryByText("Todo to delete")).toBeNull();
      fireEvent.changeText(textInput, "Todo to delete");
      fireEvent.press(addButton);

      const todoItem = await screen.findByText("Todo to delete");
      const selectedID = todoItem.props.testID.replace("todo-text-", "");
      const deleteButton = await screen.findByTestId(
        `delete-button-${selectedID}`
      );

      fireEvent.press(deleteButton);
      await waitFor(() => {
        expect(screen.queryByText("Todo to delete")).toBeNull();
      });
    });

    it("can complete a todo (short press)", async () => {
      render(<WrappedMainPage />);
      const input = await screen.findByTestId("todo-input");
      const addButton = await screen.findByTestId("add-button");

      fireEvent.changeText(input, "Todo to complete");
      fireEvent.press(addButton);

      const todoItem = await screen.findByText("Todo to complete");
      fireEvent.press(todoItem);

      // Ensure the style is always treated as an array,
      // because React Native allows a single style object or an array of styles.
      // This way we can uniformly check for the presence of a specific style.
      const styleArray = Array.isArray(todoItem.props.style)
        ? todoItem.props.style
        : [todoItem.props.style];

      expect(styleArray).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ textDecorationLine: "line-through" }),
        ])
      );

      // checking toggle
      fireEvent.press(todoItem);

      expect(styleArray).toEqual(
        expect.arrayContaining([
          expect.not.objectContaining({ textDecorationLine: "line-through" }),
        ])
      );
    });

    it("can navigate to edit page on long press", async () => {
      render(<WrappedMainPage />);

      const input = await screen.findByTestId("todo-input");
      const addButton = await screen.findByTestId("add-button");

      fireEvent.changeText(input, "Todo to edit");
      fireEvent.press(addButton);

      const todoItem = await screen.findByText("Todo to edit");
      const selectedID = todoItem.props.testID.replace("todo-text-", "");
      const todoPressable = await screen.findByTestId(`todo-${selectedID}`);

      // Simulate long press
      fireEvent(todoPressable, "longPress");

      // Grab the mocked useRouter
      const { useRouter } = require("expo-router");
      const router = useRouter();
      // Assert navigation called with correct path
      expect(router.navigate).toHaveBeenCalledWith(`./todos/${selectedID}`);
    });

    it("disables add button when input is empty", async () => {
      const { textInput, addButton } = await renderMainPage();
      fireEvent.changeText(textInput, "");
      expect(addButton.props.accessibilityState.disabled).toBe(true);
    });
  });

  // describe("EditPage Integration", () => {
  //   it("renders input with existing todo title");
  //   it("can update todo title and save");
  //   it("cancel button discards changes");
  //   it("can toggle isImportant flag");
  //   it("prevents marking more than MAX_IMPORTANT_TODO_LIMIT as important");
  //   it("disables save button if no changes made");
  //   it("shows 'Todo not found' if invalid id");
  // });
});
