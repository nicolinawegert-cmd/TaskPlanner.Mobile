import { StyleSheet, Text, View } from 'react-native';

export default function FormField({ label, hint, children }) {
  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.label}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 4,
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderColor: '#D0D5DD',
    borderWidth: 1,
    borderRadius: 12,
  },
  heading: { gap: 4 },
  label: { fontSize: 17, fontWeight: '700', color: '#101828' },
  hint: { fontSize: 14, color: '#475467' },
});
