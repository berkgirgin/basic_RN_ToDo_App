import { ToDo } from "@/types/todo";

function sortTodoList(todoList: ToDo[]): ToDo[] {
  return todoList.sort((a, b) => b.id - a.id);
}

export { sortTodoList };
