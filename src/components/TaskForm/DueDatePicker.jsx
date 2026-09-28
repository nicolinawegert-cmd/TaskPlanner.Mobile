import { useState } from 'react';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DueDatePicker({ value, onChange, disabled }) {
  const [showPicker, setShowPicker] = useState(false);

  function handleOpen() {
    if (Platform.OS === 'ios' && value === null) {
      onChange(new Date());
    }

    setShowPicker(true);
  }

  function handleDateChange(_event, selectedDate) {
    onChange(selectedDate);

    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
  }

  function handleRemove() {
    onChange(null);
    setShowPicker(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={[styles.date, !value && styles.emptyDate]}>
          {value
            ? value.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : 'No due date'}
        </Text>
        <Text style={styles.hint}>
          {value ? 'Selected due date' : 'You can leave this empty.'}
        </Text>
      </View>

      <Button
        title={value ? 'Change date' : 'Select date'}
        onPress={handleOpen}
        disabled={disabled}
      />

      {showPicker && !disabled && (
        <>
          <DateTimePicker
            value={value ?? new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onValueChange={handleDateChange}
            onDismiss={() => setShowPicker(false)}
          />

          {Platform.OS === 'ios' && (
            <Button title="Done" onPress={() => setShowPicker(false)} />
          )}
        </>
      )}

      {value !== null && (
        <Button
          title="Remove date"
          onPress={handleRemove}
          disabled={disabled}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  summary: {
    gap: 4,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 8,
  },
  date: { fontSize: 20, fontWeight: '700', color: '#101828' },
  emptyDate: { color: '#475467', fontWeight: '500' },
  hint: { fontSize: 14, color: '#475467' },
});
