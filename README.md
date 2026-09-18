# Study Planner App

A React Native mobile application built with Expo for managing study tasks and personal activities.

## Project Overview

The Study Planner App helps students organize their study schedules, manage tasks, track priorities, and monitor deadlines through a simple and user-friendly interface.

This project was developed as part of the GIG Mobile Developer React Native Bootcamp.

---

## Features

### Task Management
- Add new tasks
- Edit existing tasks
- Delete tasks
- View task details
- Mark tasks as completed

### Task Information
Each task contains:
- Title
- Description
- Category
- Priority Level (High, Medium, Low)
- Due Date

### Search & Filter
- Search tasks by title
- Filter tasks by priority level

### Data Persistence
- Local storage support
- API integration support through a dedicated service layer

---

## Project Structure

```text
study-planner-app/
│
├── App.js
│
├── screens/
│   ├── HomeScreen.js
│   ├── AddEditTaskScreen.js
│   └── TaskDetailsScreen.js
│
├── services/
│   └── tasksService.js
│
└── assets/
```

---

## Technologies Used

- React Native
- Expo
- JavaScript (ES6)
- Axios
- Local Storage
- REST API

---

## Screens

### Home Screen
- Display all tasks
- Search functionality
- Filter by priority
- Quick actions (Complete, Edit, Delete)

### Add/Edit Task Screen
- Create new tasks
- Update existing tasks
- Set category, priority, and due date

### Task Details Screen
- View full task information
- Edit task
- Delete task
- Mark task as completed

---

## Learning Outcomes

Through this project, the following concepts were applied:

- React Native Components
- State Management using Hooks
- CRUD Operations
- API Integration
- Code Organization
- Component Separation
- Mobile UI Design

---

## Author

Waheed Faraag

GIG Mobile Developer React Native Bootcamp
