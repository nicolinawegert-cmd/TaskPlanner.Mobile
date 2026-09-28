import { Alert, Linking, Text, View } from 'react-native';
import { getTaskFileUrl } from '../../services/taskService';
import AppButton from '../ui/AppButton';

export default function TaskAttachment({ fileName }) {
  if (!fileName) {
    return null;
  }

  async function handleOpenFile() {
    try {
      const url = getTaskFileUrl(fileName);
      await Linking.openURL(url);
    } catch {
      Alert.alert('Could not open attachment', 'Please try again.');
    }
  }

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: '#344054', fontSize: 14 }}>{fileName}</Text>
      <AppButton title="Open attachment" variant="link" onPress={handleOpenFile} />
    </View>
  );
}
