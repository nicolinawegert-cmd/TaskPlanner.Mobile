import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask, uploadTaskFile } from './src/services/taskService';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import TaskForm from './src/components/TaskForm/TaskForm';
import TaskEditForm from './src/components/TaskForm/TaskEditForm';
import TaskAttachment from './src/components/TaskAttachment/TaskAttachment';
import FileUpload from './src/components/FileUpload/FileUpload';
import StatusBadge from './src/components/StatusBadge/StatusBadge';
import AppButton from './src/components/ui/AppButton';

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
            <View style={styles.taskItem}>
              {editingTaskId === item.id ? (
                <TaskEditForm
                  task={item}
                  onSubmit={handleUpdateTask}
                  onCancel={() => setEditingTaskId(null)}
                />
              ) : (
                <>
                  <Text style={styles.taskTitle}>{item.title}</Text>
                  <Text>{item.description}</Text>
                  <View style={styles.statusContainer}>
                    <StatusBadge status={item.status} />
                  </View>
                  <Text>
                    Due date:{' '}
                    {item.dueDate ? item.dueDate.split('T')[0] : 'No due date'}
                  </Text>

                  <View style={styles.attachmentSection}>
                    <Text style={styles.sectionTitle}>Attachment</Text>
                    {item.fileName ? (
                      <TaskAttachment fileName={item.fileName} />
                    ) : (
                      <Text style={styles.sectionHint}>No attachment yet.</Text>
                    )}
                    <FileUpload
                      onUpload={(file) => handleFileUpload(item.id, file)}
                      uploading={uploadingTaskId === item.id}
                      disabled={
                        editingTaskId !== null ||
                        deletingTaskId !== null ||
                        uploadingTaskId !== null ||
                        refreshing
                      }
                    />
                  </View>

                  <View style={styles.taskActions}>
                    <View style={styles.actionButton}>
                      <AppButton
                        title="Edit"
                        variant="secondary"
                        onPress={() => setEditingTaskId(item.id)}
                        disabled={
                          editingTaskId !== null ||
                          deletingTaskId !== null ||
                          uploadingTaskId !== null ||
                          refreshing
                        }
                      />
                    </View>
                    <View style={styles.actionButton}>
                      <AppButton
                        title={deletingTaskId === item.id ? 'Deleting...' : 'Delete'}
                        variant="danger"
                        onPress={() => confirmDeleteTask(item)}
                        disabled={
                          editingTaskId !== null ||
                          deletingTaskId !== null ||
                          uploadingTaskId !== null ||
                          refreshing
                        }
                      />
                    </View>
                  </View>
                </>
              )}
            </View>
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
  statusContainer: {
    marginVertical: 8,
  },
  attachmentSection: {
    marginTop: 16,
    padding: 12,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#101828' },
  sectionHint: { fontSize: 14, color: '#475467' },
  taskActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#D0D5DD',
  },
  actionButton: { flexGrow: 1, flexBasis: 110, maxWidth: '100%' },
});
