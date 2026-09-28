import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { getTasks, createTask } from './src/services/taskService';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import TaskForm from './src/components/TaskForm/TaskForm';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

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
  }, [retryCount]);

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

  async function handleCreateTask(task) {
    const createdTask = await createTask(task);

    setTasks((currentTasks) => [createdTask, ...currentTasks]);
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Hämtar uppgifter...</Text>
      ) : error ? (
        <View>
          <Text accessibilityRole="alert">{error}</Text>
          <Button
            title="Försök igen"
            onPress={() => setRetryCount((count) => count + 1)}
          />
        </View>
      ) : (
        <FlatList
          refreshing={refreshing}
          onRefresh={handleRefresh}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={tasks}
          ListHeaderComponent={<TaskForm onSubmit={handleCreateTask} />}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
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
