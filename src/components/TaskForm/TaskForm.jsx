import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import SelectStatus from './SelectStatus';  

export default function TaskForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('NotStarted');

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
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        status: status,
        dueDate: null,
      });

      setTitle('');
      setDescription('');
      setStatus('NotStarted');
    } catch (err) {
      setError(err.message || 'Kunde inte skapa uppgiften.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.form}>
      <Text style={styles.heading}>Ny uppgift</Text>

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

      <SelectStatus value={status} onChange={setStatus} disabled={saving} />

      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}

      <Button
        title={saving ? 'Sparar...' : 'Lägg till uppgift'}
        onPress={handleSubmit}
        disabled={saving}
      />
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
