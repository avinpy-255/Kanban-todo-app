export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "inProgress" | "done";
  timer?: {
    startTime: number;
    pausedTime?: number;
    isRunning: boolean;
  };
  deleteTimeout?: number;
  deleteTime?: number;
}

export interface Column {
  id: "todo" | "inProgress" | "done";
  title: string;
}
