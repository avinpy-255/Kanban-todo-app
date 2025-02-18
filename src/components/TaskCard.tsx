import React, { useState, useEffect } from "react";
import { Task } from "../types";
import { Edit2, Trash2, Play, Pause, RotateCcw } from "lucide-react";
import "../styles/TaskCard.css";

interface TaskCardProps {
  task: Task;
  onDragStart: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isPomodoroMode: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onDragStart,
  onEdit,
  onDelete,
  isPomodoroMode,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [deleteTimeLeft, setDeleteTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    let interval: number;

    if (isPomodoroMode) {
      if (task.status === "inProgress" && task.timer?.isRunning) {
        interval = window.setInterval(() => {
          const elapsed = Date.now() - (task.timer?.startTime || 0);
          const remaining = Math.max(0, 25 * 60 * 1000 - elapsed);

          setTimeLeft(remaining);

          if (remaining === 0) {
            onEdit({ ...task, status: "done" });
          }
        }, 1000);
      } else if (task.status === "done" && task.deleteTime) {
        interval = window.setInterval(() => {
          const remaining = Math.max(0, (task.deleteTime ?? 0) - Date.now());
          setDeleteTimeLeft(remaining);
        }, 1000);
      }
    }

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [task, isPomodoroMode, onEdit]);

  const handleSaveEdit = () => {
    onEdit({
      ...task,
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  const toggleTimer = () => {
    if (!task.timer) {
      onEdit({
        ...task,
        timer: {
          startTime: Date.now(),
          isRunning: true,
        },
      });
    } else {
      onEdit({
        ...task,
        timer: {
          ...task.timer,
          isRunning: !task.timer.isRunning,
          startTime: task.timer.isRunning
            ? task.timer.startTime
            : Date.now() - (task.timer.pausedTime || 0),
        },
      });
    }
  };

  const resetTimer = () => {
    onEdit({
      ...task,
      timer: {
        startTime: Date.now(),
        isRunning: false,
      },
    });
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`task-card ${task.status}`}
      draggable
      onDragStart={onDragStart}
    >
      {isEditing ? (
        <div className="task-edit-form">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Task title"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Task description"
          />
          <div className="task-edit-actions">
            <button onClick={handleSaveEdit}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-content">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
          </div>

          {isPomodoroMode && task.status === "inProgress" && (
            <div className="timer-controls">
              {timeLeft !== null && (
                <div className="timer-display">{formatTime(timeLeft)}</div>
              )}
              <button onClick={toggleTimer}>
                {task.timer?.isRunning ? (
                  <Pause size={16} />
                ) : (
                  <Play size={16} />
                )}
              </button>
              <button onClick={resetTimer}>
                <RotateCcw size={16} />
              </button>
            </div>
          )}

          {isPomodoroMode &&
            task.status === "done" &&
            deleteTimeLeft !== null && (
              <div className="delete-countdown">
                Deleting in {formatTime(deleteTimeLeft)}
              </div>
            )}

          <div className="task-actions">
            <button onClick={() => setIsEditing(true)}>
              <Edit2 size={16} />
            </button>
            <button onClick={() => onDelete(task.id)}>
              <Trash2 size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;
