import { useState } from 'react';
import { Text, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import AppButton from '../ui/AppButton';

export default function FileUpload({
  onUpload,
  uploading = false,
  disabled = false,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState('');

  async function handleSelectFile() {
    if (picking || disabled || uploading) {
      return;
    }
    setPicking(true);
    setError('');

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      setSelectedFile(result.assets[0]);
    } catch {
      setError('Could not select a file. Please try again.');
    } finally {
      setPicking(false);
    }
  }

  async function handleUpload() {
    if (!selectedFile || uploading || picking || disabled) {
      return;
    }

    setError('');

    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
    } catch (err) {
      setError(err.message || 'Could not upload the file. Please try again.');
    }
  }

  return (
    <View style={{ gap: 8 }}>
      <AppButton
        title={picking ? 'Opening...' : 'Choose file'}
        variant="link"
        onPress={handleSelectFile}
        disabled={disabled || picking || uploading}
      />

      {selectedFile && (
        <>
          <Text>Selected file: {selectedFile.name}</Text>

          <AppButton
            title={uploading ? 'Uploading...' : 'Upload'}
            variant="primary"
            onPress={handleUpload}
            disabled={disabled || picking || uploading}
          />

          <AppButton
            title="Clear selection"
            variant="secondary"
            onPress={() => setSelectedFile(null)}
            disabled={disabled || picking || uploading}
          />
        </>
      )}

      {error ? (
        <Text style={{ color: '#b00020' }} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
