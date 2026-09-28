import { StyleSheet, Text, View } from 'react-native';
import TaskEditForm from '../TaskForm/TaskEditForm';
import TaskAttachment from '../TaskAttachment/TaskAttachment';
import FileUpload from '../FileUpload/FileUpload';
import StatusBadge from '../StatusBadge/StatusBadge';
import AppButton from '../ui/AppButton';

export default function TaskItem({
  task,
  isEditing,
  isDeleting,
  isUploading,
  disabled,
  onEdit,
  onCancel,
  onUpdate,
  onDelete,
  onUpload,
}) {
  return (
    <View style={styles.taskItem}>
      {isEditing ? (
        <TaskEditForm
          task={task}
          onSubmit={onUpdate}
          onCancel={onCancel}
        />
      ) : (
        <>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text>{task.description}</Text>
          <View style={styles.statusContainer}>
            <StatusBadge status={task.status} />
          </View>
          <Text>
            Due date:{' '}
            {task.dueDate ? task.dueDate.split('T')[0] : 'No due date'}
          </Text>

          <View style={styles.attachmentSection}>
            <Text style={styles.sectionTitle}>Attachment</Text>
            {task.fileName ? (
              <TaskAttachment fileName={task.fileName} />
            ) : (
              <Text style={styles.sectionHint}>No attachment yet.</Text>
            )}
            <FileUpload
              onUpload={onUpload}
              uploading={isUploading}
              disabled={disabled}
            />
          </View>

          <View style={styles.taskActions}>
            <View style={styles.actionButton}>
              <AppButton
                title="Edit"
                variant="secondary"
                onPress={onEdit}
                disabled={disabled}
              />
            </View>
            <View style={styles.actionButton}>
              <AppButton
                title={isDeleting ? 'Deleting...' : 'Delete'}
                variant="danger"
                onPress={onDelete}
                disabled={disabled}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
