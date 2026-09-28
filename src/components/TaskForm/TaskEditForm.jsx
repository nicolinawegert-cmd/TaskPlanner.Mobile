import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import SelectStatus from './SelectStatus';
import DueDatePicker from './DueDatePicker';
import { formatDateForApi, parseDateFromApi } from '../../utils/dateUtils';

export default function TaskEditForm({ task, onSubmit, onCancel }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(task.status);
  const [dueDate, setDueDate] = useState(parseDateFromApi(task.dueDate));

  async function handleSubmit() {
    if (saving) {
      return;
    }

    if (!title.trim()) {
      setError('Please enter a task title.');
      return;
    }

    setSaving(true);
    setError('');

try {
  await onSubmit(task.id, {
    title: title.trim(),
    description: description.trim(),
    status: status,
    dueDate: formatDateForApi(dueDate),
  });
} catch (err) {
  setError(err.message || 'Could not update the task.');
} finally {
  setSaving(false);
}
  }

  return (
    <View style={styles.form}>
      <Text style={styles.heading}>Edit task</Text>

      <Text>Title</Text>
      <TextInput
        style={styles.input}
        accessibilityLabel="Title"
        value={title}
        onChangeText={setTitle}
        editable={!saving}
        placeholder="What do you need to do?"
      />

      <Text>Description</Text>
      <TextInput
        style={[styles.input, styles.description]}
        accessibilityLabel="Description"
        value={description}
        onChangeText={setDescription}
        editable={!saving}
        multiline
        placeholder="Add a description"
      />

      <SelectStatus value={status} onChange={setStatus} disabled={saving} />
      
      <DueDatePicker value={dueDate} onChange={setDueDate} disabled={saving} />

      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}

      <Button
        title={saving ? 'Saving...' : 'Save'}
        onPress={handleSubmit}
        disabled={saving}
      />

      <Button title="Cancel" onPress={onCancel} disabled={saving} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginBottom: 24,
    gap: 8,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  description: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  error: {
    color: '#b00020',
  },
});
