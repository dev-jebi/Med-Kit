import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useMedicines } from '../../hooks/useMedicines';
import FAB from '../../components/FAB';
import AddMedicineSheet from '../../components/AddMedicineSheet';
import AddCourseSheet from '../../components/AddCourseSheet';

export default function MedicinesScreen() {
  const { medicines, loading } = useMedicines();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Medicines</Text>
        <Text style={styles.subtitle}>{medicines.length} in your list</Text>
        {medicines.map(m => (
          <TouchableOpacity
            key={m.id} style={styles.item} activeOpacity={0.7}
            onPress={() => setExpanded(expanded === m.id ? null : m.id)}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName}>{m.name}</Text>
              <Text style={styles.itemChevron}>{expanded === m.id ? '▲' : '▼'}</Text>
            </View>
            {expanded === m.id && (
              <View style={styles.itemExpanded}>
                {m.description && <Text style={styles.itemDesc}>{m.description}</Text>}
                {m.default_dose && <Text style={styles.itemMeta}>Default dose: {m.default_dose}</Text>}
                {m.default_qty && <Text style={styles.itemMeta}>Default qty: {m.default_qty}</Text>}
              </View>
            )}
          </TouchableOpacity>
        ))}
        {medicines.length === 0 && !loading && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No medicines yet</Text>
            <Text style={styles.emptyHint}>Tap + to add one</Text>
          </View>
        )}
      </ScrollView>
      <FAB onAddMedicine={() => setShowAddMedicine(true)} onAddCourse={() => setShowAddCourse(true)} />
      <AddMedicineSheet visible={showAddMedicine} onClose={() => setShowAddMedicine(false)} />
      <AddCourseSheet visible={showAddCourse} onClose={() => setShowAddCourse(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f4f0' },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 28, fontWeight: '800', color: '#1a1a1a', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: '#9ca3af', marginBottom: 20 },
  item: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: '#e5e0d8' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemName: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  itemChevron: { fontSize: 11, color: '#9ca3af' },
  itemExpanded: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  itemDesc: { fontSize: 13, color: '#6b7280', marginBottom: 6 },
  itemMeta: { fontSize: 12, color: '#9ca3af', marginBottom: 3 },
  emptyBox: { backgroundColor: '#fff', borderRadius: 12, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: '#e5e0d8', borderStyle: 'dashed' },
  emptyText: { fontSize: 15, fontWeight: '700', color: '#9ca3af' },
  emptyHint: { fontSize: 12, color: '#d1d5db', marginTop: 4 },
});
