import { Button, Text, View } from 'react-native';

const statusOptions = [
  { value: 'NotStarted', label: 'Not started' },
  { value: 'InProgress', label: 'In progress' },
  { value: 'Completed', label: 'Completed' },
];

export default function SelectStatus({ value, onChange, disabled }) {
  return (
    <View style={{ gap: 8 }}>
      <Text>Status</Text>

      {statusOptions.map((option) => (
        <Button
          key={option.value}
          title={
            value === option.value ? `${option.label} (selected)` : option.label
          }
          onPress={() => onChange(option.value)}
          disabled={disabled}
        />
      ))}
    </View>
  );
}
