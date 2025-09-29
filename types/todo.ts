export type ToDo = {
  id: number;
  title: string;
  isImportant: boolean;
  isCompleted: boolean;
  timeOfEntry: string;
  timeOfCompletion: string | null;
};
