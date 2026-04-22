import { Task } from "./Task";

type TaskListProps = {
  tasks: { label: string; checked: boolean }[];
};

export const TaskList = ({ tasks }: TaskListProps) => {
  return (
    <ul style={{ display: "flex", flexFlow: "column" }}>
      {tasks.map(({ label, checked }) => (
        <Task name="task" checked={checked}>
          {label}
        </Task>
      ))}
    </ul>
  );
};
