import React, { useState } from "react";
import { X } from "lucide-react";
import "../styles/TaskForm.css";

interface TaskFormProps {
  onSubmit: (task: { title: string; description: string }) => void;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({ title, description });
      setTitle("");
      setDescription("");
    }
  };

  return (
    <div className="task-form">
      <button className="close-button" onClick={onClose}>
        <X size={20} />
      </button>
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
          />
        </div>
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default TaskForm;
