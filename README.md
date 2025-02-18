# React Kanban Board with Pomodoro Timer

A modern, feature-rich Kanban board built with React and TypeScript, featuring a Pomodoro timer integration and dark mode support.

## Features

### 🎯 Core Kanban Functionality
- Three-column layout: To Do, In Progress, and Done
- Drag and drop tasks between columns
- Create, edit, and delete tasks
- Responsive design - adapts to all screen sizes
- Local storage persistence

### ⏲️ Pomodoro Timer Integration
- Toggle Pomodoro mode on/off
- 25-minute timer for tasks in the "In Progress" column
- Timer controls (play, pause, reset)
- Automatic task movement to "Done" when timer completes
- Auto-delete countdown for completed tasks (1 minute)

### 🎨 UI/UX Features
- Dark/Light mode toggle
- Clean, modern interface
- Smooth animations and transitions
- Intuitive task management
- Visual feedback for drag and drop operations

## Usage

### Task Management
1. **Creating Tasks**
   - Click the "Add Task" button
   - Enter title and description
   - Click "Add Task" to save

2. **Editing Tasks**
   - Click the edit icon on any task
   - Modify title and/or description
   - Save changes

3. **Moving Tasks**
   - Drag and drop tasks between columns
   - Tasks can be moved freely in default mode

### Pomodoro Mode
1. **Enabling Pomodoro Mode**
   - Click the "Pomodoro Mode" toggle in the header
   - Timer features will activate for tasks

2. **Timer Features**
   - Moving a task to "In Progress" starts a 25-minute timer
   - Timer controls:
     - Play/Pause: Control timer progress
     - Reset: Start timer over
   - When timer completes, task moves to "Done"

3. **Auto-Delete Feature**
   - In Pomodoro mode, tasks moved to "Done" will auto-delete after 1 minute
   - A countdown timer shows remaining time
   - Move task out of "Done" to cancel auto-delete

### Theme Switching
- Click the theme toggle button in the header
- Switches between light and dark mode
- Theme preference is saved in local storage

## Technical Details

### Technologies Used
- React 18
- TypeScript
- CSS3 with CSS Variables
- Local Storage API
- Lucide React Icons

### Key Components
- `KanbanBoard`: Main component managing the board state
- `TaskCard`: Individual task display and management
- `TaskForm`: New task creation interface
- Custom CSS for styling and animations

### State Management
- React hooks for local state
- Local storage for persistence
- TypeScript interfaces for type safety

