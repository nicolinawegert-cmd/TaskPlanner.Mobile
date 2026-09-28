import { StyleSheet, Text, View } from 'react-native';

const variants = {
  neutral: { backgroundColor: '#F2F4F7', color: '#344054' },
  info: { backgroundColor: '#EFF8FF', color: '#175CD3' },
  success: { backgroundColor: '#ECFDF3', color: '#027A48' },
  warning: { backgroundColor: '#FFFAEB', color: '#93370D' },
  danger: { backgroundColor: '#FEF3F2', color: '#B42318' },
};

export default function Badge({ label, variant = 'neutral', accessibilityLabel }) {
  const appearance = variants[variant] ?? variants.neutral;

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel ?? label}
      style={[
        styles.badge,
        { backgroundColor: appearance.backgroundColor },
      ]}
    >
      <Text style={[styles.label, { color: appearance.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
});
