import { Banner } from "./Banner";
import { TaskList } from "./TaskList";

const TASK_LIST = [
  { id: 1, checked: false, label: "Петрушка" },
  { id: 2, checked: false, label: "Огурцы" },
  { id: 3, checked: false, label: "Помидоры" },
];

function App() {
  return (
    <>
      <Banner />
      <TaskList tasks={TASK_LIST} />{" "}
    </>
  );
}

export default App;
