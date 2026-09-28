import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function TaskEditForm({ task, onSubmit, onCancel }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (saving) {
      return;
    }

    if (!title.trim()) {
      setError('Skriv en titel för uppgiften.');
      return;
    }

    setSaving(true);
    setError('');

try {
  await onSubmit(task.id, {
    title: title.trim(),
    description: description.trim(),
    status: task.status,
    dueDate: task.dueDate,
  });
} catch (err) {
  setError(err.message || 'Kunde inte uppdatera uppgiften.');
} finally {
  setSaving(false);
}
  }

  return (
    <View style={styles.form}>
      <Text style={styles.heading}>Redigera uppgift</Text>

      <Text>Titel</Text>
      <TextInput
        style={styles.input}
        accessibilityLabel="Titel"
        value={title}
        onChangeText={setTitle}
        editable={!saving}
        placeholder="Vad behöver du göra?"
      />

      <Text>Beskrivning</Text>
      <TextInput
        style={[styles.input, styles.description]}
        accessibilityLabel="Beskrivning"
        value={description}
        onChangeText={setDescription}
        editable={!saving}
        multiline
        placeholder="Lägg till en beskrivning"
      />

      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}

      <Button
        title={saving ? 'Sparar...' : 'Spara ändringar'}
        onPress={handleSubmit}
        disabled={saving}
      />

      <Button title="Avbryt" onPress={onCancel} disabled={saving} />
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
