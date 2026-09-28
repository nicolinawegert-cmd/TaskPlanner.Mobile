import { Alert, Button, Linking, Text, View } from 'react-native';
import { getTaskFileUrl } from '../../services/taskService';

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
      <Text>Attachment: {fileName}</Text>
      <Button title="Open attachment" onPress={handleOpenFile} />
    </View>
  );
}
