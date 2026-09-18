import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  Alert, SafeAreaView, ScrollView
} from 'react-native';

export default function AddEditTaskScreen({ task = null, onSave, onCancel }) {
  const isEditing = !!task;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Study');

  const today = new Date();
  const [day, setDay] = useState(String(today.getDate()).padStart(2, '0'));
  const [month, setMonth] = useState(String(today.getMonth() + 1).padStart(2, '0'));
  const [year, setYear] = useState(String(today.getFullYear()));

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'Medium');
      setCategory(task.category || 'Study');

      if (task.due_date) {
        const parts = task.due_date.split('-');
        if (parts.length === 3) {
          setYear(parts[0]);
          setMonth(parts[1]);
          setDay(parts[2]);
        }
      }
    }
  }, [task]);

  const days = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, '0')
  );
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, '0')
  );
  const years = Array.from({ length: 6 }, (_, i) =>
    String(today.getFullYear() + i)
  );

  const getDueDate = () => `${year}-${month}-${day}`;

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال عنوان المهمة');
      return;
    }

    const d = new Date(`${year}-${month}-${day}`);
    if (isNaN(d.getTime())) {
      Alert.alert('تنبيه', 'التاريخ غير صحيح');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      due_date: getDueDate(),
      category,
    });
  };

  const priorities = ['Low', 'Medium', 'High'];
  const categories = ['Study', 'Exams', 'Personal'];

  const ChipRow = ({ options, selected, onSelect }) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.chip, selected === opt && styles.chipActive]}
          onPress={() => onSelect(opt)}
        >
          <Text style={[styles.chipText, selected === opt && styles.chipTextActive]}>
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onCancel} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Task' : 'Add Task'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Title */}
        <View style={styles.card}>
          <Text style={styles.label}>Task Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Review lecture notes"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#8E8E93"
          />
        </View>

        {/* Description */}
        <View style={styles.card}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add more details..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholderTextColor="#8E8E93"
          />
        </View>

        {/* Priority */}
        <View style={styles.card}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.row}>
            {priorities.map((p) => {
              const active = priority === p;
              const color =
                p === 'High' ? '#FF3B5C' :
                p === 'Medium' ? '#FF9F43' : '#00C853';
              return (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.optionBtn,
                    active && { backgroundColor: color, borderColor: color },
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[styles.optionText, active && { color: '#FFF' }]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Category */}
        <View style={styles.card}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.row}>
            {categories.map((c) => {
              const active = category === c;
              return (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.optionBtn,
                    active && { backgroundColor: '#6C5CE7', borderColor: '#6C5CE7' },
                  ]}
                  onPress={() => setCategory(c)}
                >
                  <Text style={[styles.optionText, active && { color: '#FFF' }]}>
                    {c}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Due Date */}
        <View style={styles.card}>
          <Text style={styles.label}>Due Date *</Text>
          <Text style={styles.datePreview}>📅  {getDueDate()}</Text>

          <Text style={styles.subLabel}>Day</Text>
          <ChipRow options={days} selected={day} onSelect={setDay} />

          <Text style={styles.subLabel}>Month</Text>
          <ChipRow options={months} selected={month} onSelect={setMonth} />

          <Text style={styles.subLabel}>Year</Text>
          <ChipRow options={years} selected={year} onSelect={setYear} />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {isEditing ? 'Save Changes' : 'Add Task'}
          </Text>
        </TouchableOpacity>
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
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#6C5CE7',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#1A1A2E',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0DCF5',
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#FFF',
  },
  optionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  datePreview: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6C5CE7',
    marginBottom: 4,
  },
  chipScroll: {
    marginBottom: 2,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#EDE9FE',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#6C5CE7',
  },
  chipText: {
    fontSize: 13,
    color: '#6C5CE7',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFF',
  },
  saveButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#6C5CE7',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 16,
  },
});