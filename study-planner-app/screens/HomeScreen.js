import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  FlatList, SafeAreaView, Platform
} from 'react-native';

export default function HomeScreen({
  tasks,
  onAddTask,
  onViewDetails,
  onToggleComplete,
  onDelete,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority =
      filterPriority === 'All' || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#FF3B5C';
      case 'Medium': return '#FF9F43';
      case 'Low': return '#00C853';
      default: return '#8E8E93';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Study': return '📚';
      case 'Exams': return '📝';
      case 'Personal': return '👤';
      default: return '📁';
    }
  };

  const handleDelete = (item) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`Delete "${item.title}"?`);
      if (confirmed) onDelete(item.id);
    } else {
      const { Alert } = require('react-native');
      Alert.alert(
        'Are you sure?',
        `Delete "${item.title}"?`,
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', style: 'destructive', onPress: () => onDelete(item.id) },
        ]
      );
    }
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onViewDetails(item)}
      >
        <View style={styles.cardTop}>
          <Text style={styles.cardCategory}>
            {getCategoryIcon(item.category)}  {item.category || 'General'}
          </Text>
          <View style={[styles.badge, { backgroundColor: getPriorityColor(item.priority) + '22' }]}>
            <Text style={[styles.badgeText, { color: getPriorityColor(item.priority) }]}>
              {item.priority}
            </Text>
          </View>
        </View>

        <Text style={[styles.taskTitle, item.completed && styles.completedText]}>
          {item.title}
        </Text>

        {item.description ? (
          <Text style={styles.taskDesc} numberOfLines={2}>{item.description}</Text>
        ) : null}

        <View style={styles.cardFooter}>
          <Text style={styles.dueDateText}>📅  {item.due_date || 'No date'}</Text>
          <View style={[
            styles.statusPill,
            { backgroundColor: item.completed ? '#E8F5E9' : '#FFF3E0' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: item.completed ? '#00C853' : '#FF9F43' }
            ]}>
              {item.completed ? 'Done' : 'To do'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* الأزرار من برّه */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[
            styles.completeBtn,
            { backgroundColor: item.completed ? '#FF9F43' : '#00C853' },
          ]}
          onPress={() => onToggleComplete(item.id)}
        >
          <Text style={styles.actionBtnText}>
            {item.completed ? '↩ Undo' : '✓ Done'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => onViewDetails(item)}
        >
          <Text style={styles.actionBtnText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.actionBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>Hello!</Text>
          <Text style={styles.headerTitle}>My Tasks</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={onAddTask}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#8E8E93"
        />
      </View>

      <View style={styles.filterRow}>
        {['All', 'High', 'Medium', 'Low'].map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.filterChip, filterPriority === p && styles.filterChipActive]}
            onPress={() => setFilterPriority(p)}
          >
            <Text style={[styles.filterChipText, filterPriority === p && styles.filterChipTextActive]}>
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderTask}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 18,
  },
  hello: {
    fontSize: 14,
    color: '#8E8E93',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  addButton: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 14,
    shadowColor: '#6C5CE7',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1A2E',
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#EDE9FE',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#6C5CE7',
  },
  filterChipText: {
    color: '#6C5CE7',
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFF',
  },
  taskCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#6C5CE7',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardCategory: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  taskDesc: {
    color: '#8E8E93',
    fontSize: 13,
    marginBottom: 10,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dueDateText: {
    color: '#8E8E93',
    fontSize: 12,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
  },
  completeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 6,
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#6C5CE7',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#FF3B5C',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 6,
  },
  actionBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#8E8E93',
    marginTop: 50,
    fontSize: 15,
  },
});