import { Pressable, StyleSheet, Text } from 'react-native';

const variants = {
  primary: { backgroundColor: '#175CD3', borderColor: '#175CD3', color: '#FFFFFF' },
  secondary: { backgroundColor: '#FFFFFF', borderColor: '#D0D5DD', color: '#344054' },
  link: { backgroundColor: 'transparent', borderColor: 'transparent', color: '#175CD3' },
  danger: { backgroundColor: '#FEF3F2', borderColor: '#FECDCA', color: '#B42318' },
};

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  accessibilityLabel,
}) {
  const appearance = variants[variant] ?? variants.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: appearance.backgroundColor,
          borderColor: appearance.borderColor,
        },
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.label, { color: appearance.color }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    maxWidth: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 16, fontWeight: '600', textAlign: 'center', flexShrink: 1 },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.5 },
});
