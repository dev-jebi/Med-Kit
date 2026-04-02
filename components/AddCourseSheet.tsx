import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Modal, ScrollView, Alert
} from 'react-native';
import { useMedicines } from '../hooks/useMedicines';
import { useCourses } from '../hooks/useCourses';

type Props = { visible: boolean; onClose: () => void; };

export default function AddCourseSheet({ visible, onClose }: Props) {
  const { medicines } = useMedicines();
  const { addCourse } = useCourses();
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [dose, setDose] = useState('');
  const [totalQty, setTotalQty] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeInput, setTimeInput] = useState('');
  const [times, setTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const isComplete = selectedMedicine && dose.trim() && startDate && times.length > 0;

  function addTime() {
    const t = timeInput.trim();
    if (!t || times.includes(t)) return;
    setTimes(prev => [...prev, t].sort());
    setTimeInput('');
  }

  function removeTime(t: string) {
    setTimes(prev => prev.filter(x => x !== t));
  }

  async function handleStart() {
    if (!isComplete) return;
    setLoading(true);
    const result = await addCourse(
      selectedMedicine, dose.trim(),
      totalQty ? parseInt(totalQty) : null,
      startDate, times
    );
    setLoading(false);
    if (result) {
      setSelectedMedicine(''); setDose(''); setTotalQty('');
      setTimes([]); setTimeInput('');
      onClose();
    } else {
      Alert.alert('Error starting course');
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.sheet} keyboardShouldPersistTaps="handled">
          <View style={styles.handle} />
          <Text style={styles.title}>Add Course</Text>

          <Text style={styles.label}>Medicine *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll}>
            {medicines.map(m => (
              <TouchableOpacity
                key={m.id}
                style={[styles.pill, selectedMedicine === m.id && styles.pillActive]}
                onPress={() => {
                  setSelectedMedicine(m.id);
                  if (m.default_dose) setDose(m.default_dose);
                  if (m.default_qty) setTotalQty(String(m.default_qty));
                }}>
                <Text style={[styles.pillText, selectedMedicine === m.id && styles.pillTextActive]}>
                  {m.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Dose per intake *</Text>
          <TextInput style={styles.input} value={dose} onChangeText={setDose}
            placeholder="e.g. 1 tablet" placeholderTextColor="#9ca3af" />

          <Text style={styles.label}>Total Quantity</Text>
          <TextInput style={styles.input} value={totalQty} onChangeText={setTotalQty}
            placeholder="e.g. 10" placeholderTextColor="#9ca3af" keyboardType="numeric" />

          <Text style={styles.label}>Start Date *</Text>
          <TextInput style={styles.input} value={startDate} onChangeText={setStartDate}
            placeholder="YYYY-MM-DD" placeholderTextColor="#9ca3af" />

          <Text style={styles.label}>Reminder Times * (HH:MM 24hr)</Text>
          <View style={styles.timeRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              value={timeInput} onChangeText={setTimeInput}
              placeholder="e.g. 08:00" placeholderTextColor="#9ca3af" />
            <TouchableOpacity style={styles.addTimeBtn} onPress={addTime}>
              <Text style={styles.addTimeBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.timeChips}>
            {times.map(t => (
              <TouchableOpacity key={t} style={styles.chip} onPress={() => removeTime(t)}>
                <Text style={styles.chipText}>{t} ✕</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, (!isComplete || loading) && styles.btnDisabled]}
              onPress={handleStart} disabled={!isComplete || loading}>
              <Text style={styles.saveText}>{loading ? 'Starting...' : 'Start Course'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 48 },
  handle: { width: 40, height: 4, backgroundColor: '#e5e0d8', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '800', color: '#1a1a1a', marginBottom: 20, letterSpacing: -0.5 },
  label: { fontSize: 12, fontWeight: '600', color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { borderWidth: 1, borderColor: '#e5e0d8', borderRadius: 10, padding: 13, fontSize: 15, color: '#1a1a1a', marginBottom: 16 },
  pillScroll: { marginBottom: 16 },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: '#e5e0d8', marginRight: 8, backgroundColor: '#fff' },
  pillActive: { backgroundColor: '#3b6ef5', borderColor: '#3b6ef5' },
  pillText: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  pillTextActive: { color: '#fff' },
  timeRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  addTimeBtn: { backgroundColor: '#3b6ef5', borderRadius: 10, paddingHorizontal: 16, justifyContent: 'center' },
  addTimeBtnText: { color: '#fff', fontWeight: '700' },
  timeChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { backgroundColor: '#eef1fe', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  chipText: { color: '#3b6ef5', fontWeight: '600', fontSize: 13 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#e5e0d8', alignItems: 'center' },
  cancelText: { fontWeight: '600', color: '#6b7280' },
  saveBtn: { flex: 2, padding: 14, borderRadius: 10, backgroundColor: '#3b6ef5', alignItems: 'center' },
  saveText: { fontWeight: '700', color: '#fff' },
  btnDisabled: { opacity: 0.4 },
});
