import { useState } from 'react';
import { Button, Platform, Text, View } from 'react-native';
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
    <View style={{ gap: 8 }}>
      <Text>Due date</Text>

      <Text>{value ? value.toLocaleDateString('en-GB') : 'No due date'}</Text>

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
