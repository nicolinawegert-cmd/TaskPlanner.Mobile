import { Pressable, StyleSheet, Text, View } from 'react-native';

const statusOptions = [
  { value: 'NotStarted', label: 'Not started' },
  { value: 'InProgress', label: 'In progress' },
  { value: 'Completed', label: 'Completed' },
];

export default function SelectStatus({ value, onChange, disabled }) {
  return (
    <View style={styles.options} accessibilityRole="radiogroup" accessibilityLabel="Status">
      {statusOptions.map((option) => {
        const selected = value === option.value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            disabled={disabled}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ checked: selected, disabled: Boolean(disabled) }}
            style={({ pressed }) => [
              styles.option,
              selected && styles.selectedOption,
              pressed && styles.pressed,
              disabled && styles.disabled,
            ]}
          >
            <Text style={[styles.label, selected && styles.selectedLabel]}>
              {option.label}
            </Text>
            {selected ? <Text style={styles.selection}>Selected</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  options: { gap: 8 },
  option: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  selectedOption: { backgroundColor: '#EFF8FF', borderColor: '#175CD3' },
  label: { fontSize: 16, color: '#344054', flexShrink: 1 },
  selectedLabel: { color: '#175CD3', fontWeight: '700' },
  selection: { fontSize: 13, color: '#175CD3', fontWeight: '600' },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.65 },
});
