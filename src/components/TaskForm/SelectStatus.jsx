import { Button, Text, View } from 'react-native';

const statusOptions = [
  { value: 'NotStarted', label: 'Inte påbörjad' },
  { value: 'InProgress', label: 'Pågående' },
  { value: 'Completed', label: 'Klar' },
];

export default function SelectStatus({ value, onChange, disabled }) {
  return (
    <View style={{ gap: 8 }}>
      <Text>Status</Text>

      {statusOptions.map((option) => (
        <Button
          key={option.value}
          title={
            value === option.value ? `${option.label} (vald)` : option.label
          }
          onPress={() => onChange(option.value)}
          disabled={disabled}
        />
      ))}
    </View>
  );
}
