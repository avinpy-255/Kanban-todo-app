import React, { useState, useEffect } from 'react';
import { Task, Column } from '../types';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import '../styles/KanbanBoard.css';
import { Timer, Plus, Moon, Sun } from 'lucide-react';

const initialColumns: Column[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'inProgress', title: 'In Progress' },
  { id: 'done', title: 'Done' }
];

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPomodoroMode, setIsPomodoroMode] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (columnId: Column['id']) => {
    if (!draggedTask) return;

    const updatedTasks = tasks.map(task => {
      if (task.id === draggedTask.id) {
        // Clear any existing timeouts
        if (task.deleteTimeout) {
          window.clearTimeout(task.deleteTimeout);
        }

        const updatedTask = { ...task, status: columnId };

        // Handle dropping in "done" column with Pomodoro mode
        if (columnId === 'done' && isPomodoroMode) {
          const timeout = window.setTimeout(() => {
            setTasks(prev => prev.filter(t => t.id !== task.id));
          }, 60000);
          updatedTask.deleteTimeout = timeout;
          updatedTask.deleteTime = Date.now() + 60000;
        }

        // Handle dropping in "inProgress" column with Pomodoro mode
        if (columnId === 'inProgress' && isPomodoroMode) {
          updatedTask.timer = {
            startTime: Date.now(),
            isRunning: true
          };
        }

        return updatedTask;
      }
      return task;
    });

    setTasks(updatedTasks);
    setDraggedTask(null);
  };

  const handleAddTask = (task: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      status: 'todo'
    };
    setTasks([...tasks, newTask]);
    setIsFormOpen(false);
  };

  const handleEditTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const togglePomodoroMode = () => {
    setIsPomodoroMode(!isPomodoroMode);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="kanban-container">
      <div className="kanban-header">
        <div className="header-controls">
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button 
            className={`pomodoro-toggle ${isPomodoroMode ? 'active' : ''}`}
            onClick={togglePomodoroMode}
          >
            <Timer size={20} />
            Pomodoro Mode
          </button>
          <button className="add-task-button" onClick={() => setIsFormOpen(true)}>
            <Plus size={20} />
            Add Task
          </button>
        </div>
      </div>

      <div className="kanban-board">
        {initialColumns.map(column => (
          <div
            key={column.id}
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <h2>{column.title}</h2>
            <div className="task-list">
              {tasks
                .filter(task => task.status === column.id)
                .map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDragStart={() => handleDragStart(task)}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    isPomodoroMode={isPomodoroMode}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <div className="modal-overlay">
          <TaskForm
            onSubmit={handleAddTask}
            onClose={() => setIsFormOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;