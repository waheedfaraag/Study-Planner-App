import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import AddEditTaskScreen from './screens/AddEditTaskScreen';
import TaskDetailsScreen from './screens/TaskDetailsScreen';
import { apiTasks } from './services/tasksService';

const STORAGE_KEY = 'STUDY_PLANNER_TASKS';

// تخزين بسيط يشتغل على Web (Snack) وMobile
const storage = {
  async get(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
    } catch (e) {}
    return null;
  },
  async set(key, value) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } catch (e) {}
  },
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('list');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  // كل ما المهام تتغير → احفظها
  useEffect(() => {
    if (!loading) {
      saveTasksToStorage(tasks);
    }
  }, [tasks]);

  const capitalize = (str) => {
    if (!str) return 'Medium';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const saveTasksToStorage = async (list) => {
    try {
      await storage.set(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.log('Save storage error:', e.message);
    }
  };

  const loadTasks = async () => {
    setLoading(true);

    // 1) حمّل من التخزين المحلي أولاً
    try {
      const saved = await storage.get(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTasks(parsed);
          setLoading(false);
          // نكمّل ونحاول نجيب من الـ API في الخلفية
        }
      }
    } catch (e) {
      console.log('Read storage error:', e.message);
    }

    // 2) حاول الـ API
    try {
      const data = await apiTasks.getTasks();
      const mapped = (data || []).map((t) => ({
        ...t,
        category: t.category_name || null,
        priority: capitalize(t.priority),
      }));
      if (mapped.length > 0) {
        setTasks(mapped);
      }
    } catch (err) {
      console.log('API Error:', err.message);
      // لو مفيش بيانات محلية، حط أمثلة
      setTasks((prev) => {
        if (prev.length > 0) return prev;
        return [
          {
            id: '1',
            title: 'إعداد عرض التخرج',
            description: 'تجهيز السلايدات الخاصة بالبروجكت',
            priority: 'High',
            due_date: '2026-09-10',
            category: 'Study',
            completed: false,
          },
          {
            id: '2',
            title: 'مراجعة Code Quality',
            description: 'التأكد من نظافة الكود',
            priority: 'Medium',
            due_date: '2026-09-12',
            category: 'Personal',
            completed: false,
          },
        ];
      });
    } finally {
      setLoading(false);
    }
  };

  // ========== Navigation ==========

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsEditing(false);
    setCurrentScreen('form');
  };

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setCurrentScreen('details');
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsEditing(true);
    setCurrentScreen('form');
  };

  const handleBackToList = () => {
    setSelectedTask(null);
    setIsEditing(false);
    setCurrentScreen('list');
  };

  // ========== CRUD ==========

  const handleSaveTask = async (taskData) => {
    const payload = {
      title: taskData.title,
      description: taskData.description || null,
      due_date: taskData.due_date,
      priority: taskData.priority.toLowerCase(),
    };

    try {
      if (isEditing && selectedTask) {
        const updated = await apiTasks.updateTask(selectedTask.id, payload);
        setTasks((prev) =>
          prev.map((t) =>
            String(t.id) === String(selectedTask.id)
              ? {
                  ...updated,
                  category: taskData.category || updated.category_name,
                  priority: capitalize(updated.priority),
                }
              : t
          )
        );
      } else {
        const created = await apiTasks.createTask(payload);
        setTasks((prev) => [
          {
            ...created,
            category: taskData.category || created.category_name,
            priority: capitalize(created.priority),
          },
          ...prev,
        ]);
      }
    } catch (err) {
      console.log('Save error:', err.message);
      if (isEditing && selectedTask) {
        setTasks((prev) =>
          prev.map((t) =>
            String(t.id) === String(selectedTask.id)
              ? { ...t, ...taskData }
              : t
          )
        );
      } else {
        setTasks((prev) => [
          {
            id: Date.now().toString(),
            ...taskData,
            completed: false,
          },
          ...prev,
        ]);
      }
    }

    handleBackToList();
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await apiTasks.deleteTask(taskId);
    } catch (err) {
      console.log('Delete error:', err.message);
    }

    setTasks((prev) => prev.filter((t) => String(t.id) !== String(taskId)));

    if (currentScreen === 'details') {
      handleBackToList();
    }
  };

  const handleToggleComplete = async (taskId) => {
    const id = String(taskId);
    const task = tasks.find((t) => String(t.id) === id);
    if (!task) return;

    setTasks((prev) =>
      prev.map((t) =>
        String(t.id) === id
          ? { ...t, completed: !Boolean(t.completed) }
          : t
      )
    );

    setSelectedTask((prev) =>
      prev && String(prev.id) === id
        ? { ...prev, completed: !Boolean(prev.completed) }
        : prev
    );

    try {
      if (task.completed) {
        await apiTasks.undoTask(taskId);
      } else {
        await apiTasks.completeTask(taskId);
      }
    } catch (err) {
      console.log('Toggle API error:', err.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C5CE7" />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <>
      {currentScreen === 'list' && (
        <HomeScreen
          tasks={tasks}
          onAddTask={handleAddTask}
          onViewDetails={handleViewDetails}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTask}
        />
      )}

      {currentScreen === 'form' && (
        <AddEditTaskScreen
          task={isEditing ? selectedTask : null}
          onSave={handleSaveTask}
          onCancel={handleBackToList}
        />
      )}

      {currentScreen === 'details' && (
        <TaskDetailsScreen
          task={selectedTask}
          onEdit={handleEditTask}
          onBack={handleBackToList}
          onDelete={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
  },
  loadingText: {
    marginTop: 12,
    color: '#8E8E93',
    fontSize: 15,
  },
});