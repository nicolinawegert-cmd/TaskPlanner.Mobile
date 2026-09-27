import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { getTasks } from './src/services/taskService';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadTasks() {
      setLoading(true);
      setError('');

      try {
        const data = await getTasks();

        if (!ignore) {
          setTasks(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Något gick fel vid hämtningen.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadTasks();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleRefresh() {
  if (refreshing) {
    return;
  }

  setRefreshing(true);

  try {
    const data = await getTasks();
    setTasks(data);
  } catch {
    Alert.alert(
      'Kunde inte uppdatera',
      'Kontrollera anslutningen och att backend körs. Den tidigare listan visas fortfarande.'
    );
  } finally {
    setRefreshing(false);
  }
}

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Hämtar uppgifter...</Text>
      ) : error ? (
        <Text accessibilityRole="alert">{error}</Text>
      ) : (
        <FlatList
          refreshing={refreshing}
          onRefresh={handleRefresh}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text>Status: {item.status}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>Det finns inga uppgifter ännu.</Text>}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: '100%',
    maxHeight: '80%',
    flexGrow: 0,
  },
  listContent: {
    padding: 20,
  },
  taskItem: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
});
