import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Modal, Alert
} from 'react-native';
import { useMedicines } from '../hooks/useMedicines';

type Props = { visible: boolean; onClose: () => void; };

export default function AddMedicineSheet({ visible, onClose }: Props) {
  const { addMedicine } = useMedicines();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [defaultDose, setDefaultDose] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;
    setLoading(true);
    const result = await addMedicine(name.trim(), description || undefined, defaultDose || undefined);
    setLoading(false);
    if (result) {
      setName(''); setDescription(''); setDefaultDose('');
      onClose();
    } else {
      Alert.alert('Error saving medicine');
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Add Medicine</Text>

          <Text style={styles.label}>Name *</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName}
            placeholder="e.g. Paracetamol" placeholderTextColor="#9ca3af" autoFocus />

          <Text style={styles.label}>Description</Text>
          <TextInput style={styles.input} value={description} onChangeText={setDescription}
            placeholder="Optional notes" placeholderTextColor="#9ca3af" />

          <Text style={styles.label}>Default Dose</Text>
          <TextInput style={styles.input} value={defaultDose} onChangeText={setDefaultDose}
            placeholder="e.g. 1 tablet, 500mg" placeholderTextColor="#9ca3af" />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, (!name.trim() || loading) && styles.btnDisabled]}
              onPress={handleSave} disabled={!name.trim() || loading}>
              <Text style={styles.saveText}>{loading ? 'Saving...' : 'Save Medicine'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
  handle: { width: 40, height: 4, backgroundColor: '#e5e0d8', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '800', color: '#1a1a1a', marginBottom: 20, letterSpacing: -0.5 },
  label: { fontSize: 12, fontWeight: '600', color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    borderWidth: 1, borderColor: '#e5e0d8', borderRadius: 10,
    padding: 13, fontSize: 15, color: '#1a1a1a', marginBottom: 16,
  },
  actions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#e5e0d8', alignItems: 'center' },
  cancelText: { fontWeight: '600', color: '#6b7280' },
  saveBtn: { flex: 2, padding: 14, borderRadius: 10, backgroundColor: '#3b6ef5', alignItems: 'center' },
  saveText: { fontWeight: '700', color: '#fff' },
  btnDisabled: { opacity: 0.4 },
});
