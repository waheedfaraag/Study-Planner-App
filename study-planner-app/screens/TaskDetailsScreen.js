import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  SafeAreaView, ScrollView, Platform
} from 'react-native';

export default function TaskDetailsScreen({
  task,
  onEdit,
  onBack,
  onDelete,
  onToggleComplete,
}) {
  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>Task not found</Text>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backLink}>← Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const getPriorityColor = (priority) => {
    if (priority === 'High') return '#FF3B5C';
    if (priority === 'Medium') return '#FF9F43';
    if (priority === 'Low') return '#00C853';
    return '#8E8E93';
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Study': return '📚';
      case 'Exams': return '📝';
      case 'Personal': return '👤';
      default: return '📁';
    }
  };

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`Delete "${task.title}"?`);
      if (confirmed) onDelete(task.id);
    } else {
      const { Alert } = require('react-native');
      Alert.alert(
        'Are you sure?',
        `Delete "${task.title}"?`,
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', style: 'destructive', onPress: () => onDelete(task.id) },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Task Details</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Main Card */}
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.categoryText}>
              {getCategoryIcon(task.category)}  {task.category || 'General'}
            </Text>
            <View style={[styles.badge, { backgroundColor: getPriorityColor(task.priority) + '22' }]}>
              <Text style={[styles.badgeText, { color: getPriorityColor(task.priority) }]}>
                {task.priority}
              </Text>
            </View>
          </View>

          <Text style={[styles.title, task.completed && styles.completedText]}>
            {task.title}
          </Text>

          <View style={[
            styles.statusPill,
            { backgroundColor: task.completed ? '#E8F5E9' : '#FFF3E0' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: task.completed ? '#00C853' : '#FF9F43' }
            ]}>
              {task.completed ? '✅ Done' : '⏳ To do'}
            </Text>
          </View>

          <Text style={styles.label}>Description</Text>
          <Text style={styles.description}>
            {task.description || 'No description'}
          </Text>

          <Text style={styles.label}>Due Date</Text>
          <Text style={styles.infoText}>📅  {task.due_date || 'Not set'}</Text>
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={[
            styles.completeBtn,
            { backgroundColor: task.completed ? '#FF9F43' : '#00C853' },
          ]}
          onPress={() => onToggleComplete(task.id)}
        >
          <Text style={styles.completeBtnText}>
            {task.completed ? '↩ Mark as To do' : '✓ Mark as Done'}
          </Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.editBtn]}
            onPress={() => onEdit(task)}
          >
            <Text style={styles.actionBtnText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={handleDelete}
          >
            <Text style={styles.actionBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 20,
    color: '#6C5CE7',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  backLink: {
    color: '#6C5CE7',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#8E8E93',
    marginTop: 40,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#6C5CE7',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 10,
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    color: '#1A1A2E',
    lineHeight: 22,
  },
  infoText: {
    fontSize: 15,
    color: '#1A1A2E',
    fontWeight: '500',
  },
  completeBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  completeBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: '#6C5CE7',
    marginRight: 8,
  },
  deleteBtn: {
    backgroundColor: '#FF3B5C',
    marginLeft: 8,
  },
  actionBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
});