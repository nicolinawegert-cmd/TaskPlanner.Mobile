import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask, uploadTaskFile } from './src/services/taskService';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import TaskForm from './src/components/TaskForm/TaskForm';
import TaskItem from './src/components/TaskItem/TaskItem';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [uploadingTaskId, setUploadingTaskId] = useState(null);

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
          setError(err.message || 'Could not load tasks.');
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
        'Could not refresh tasks',
        'Check your connection and make sure the backend is running. The previous list is still displayed.'
      );
    } finally {
      setRefreshing(false);
    }
  }

  async function handleCreateTask(task) {
    const createdTask = await createTask(task);

    setTasks((currentTasks) => [createdTask, ...currentTasks]);
  }

  async function handleUpdateTask(id, task) {
    const updatedTask = await updateTask(id, task);

    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === id ? updatedTask : currentTask
      )
    );

    setEditingTaskId(null);
  }

  async function handleFileUpload(id, file) {
    setUploadingTaskId(id);

    try {
      const updatedTask = await uploadTaskFile(id, file);

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } finally {
      setUploadingTaskId(null);
    }
  }

  async function handleDeleteTask(id) {
    if (deletingTaskId !== null) {
      return;
    }

    setDeletingTaskId(id);

    try {
      await deleteTask(id);

      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    } catch (err) {
      Alert.alert(
        'Could not delete the task',
        err.message || 'Please try again later.'
      );
    } finally {
      setDeletingTaskId(null);
    }
  }

  function confirmDeleteTask(task) {
    Alert.alert(
      'Delete task?',
      `Delete "${task.title}"? This cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteTask(task.id),
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading tasks...</Text>
      ) : error ? (
        <View>
          <Text accessibilityRole="alert">{error}</Text>
          <Button
            title="Try again"
            onPress={() => setRetryCount((count) => count + 1)}
          />
        </View>
      ) : (
        <FlatList
          refreshing={refreshing}
          onRefresh={
            editingTaskId === null &&
            deletingTaskId === null &&
            uploadingTaskId === null
              ? handleRefresh
              : undefined
          }
          extraData={{ editingTaskId, deletingTaskId, uploadingTaskId }}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={tasks}
          ListHeaderComponent={<TaskForm onSubmit={handleCreateTask} />}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              isEditing={editingTaskId === item.id}
              isDeleting={deletingTaskId === item.id}
              isUploading={uploadingTaskId === item.id}
              disabled={
                editingTaskId !== null ||
                deletingTaskId !== null ||
                uploadingTaskId !== null ||
                refreshing
              }
              onEdit={() => setEditingTaskId(item.id)}
              onCancel={() => setEditingTaskId(null)}
              onUpdate={handleUpdateTask}
              onDelete={() => confirmDeleteTask(item)}
              onUpload={(file) => handleFileUpload(item.id, file)}
            />
          )}
          ListEmptyComponent={<Text>No tasks yet.</Text>}
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
});
