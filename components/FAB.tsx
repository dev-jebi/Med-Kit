import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';

type Props = {
  onAddMedicine: () => void;
  onAddCourse: () => void;
};

export default function FAB({ onAddMedicine, onAddCourse }: Props) {
  const [open, setOpen] = useState(false);

  const options = [
    { label: 'Profile', icon: '👤', onPress: () => router.push('/(app)/settings') },
    { label: 'Settings', icon: '⚙️', onPress: () => router.push('/(app)/settings') },
    { label: 'Add Medicine', icon: '💊', onPress: onAddMedicine },
    { label: 'Add Course', icon: '📋', onPress: onAddCourse },
    { label: 'Active Courses', icon: '✅', onPress: () => router.push('/(app)/home') },
  ];

  function handleOption(fn: () => void) {
    setOpen(false);
    fn();
  }

  return (
    <>
      {open && <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />}
      <View style={styles.container}>
        {open && options.map((opt, i) => (
          <TouchableOpacity key={i} style={styles.option} onPress={() => handleOption(opt.onPress)}>
            <Text style={styles.optionLabel}>{opt.label}</Text>
            <View style={styles.optionBtn}>
              <Text style={styles.optionIcon}>{opt.icon}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.fab, open && styles.fabOpen]}
          onPress={() => setOpen(!open)}>
          <Text style={styles.fabIcon}>{open ? '✕' : '+'}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, zIndex: 10 },
  container: { position: 'absolute', bottom: 28, right: 20, alignItems: 'flex-end', zIndex: 20 },
  fab: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#3b6ef5', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#3b6ef5', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 8,
  },
  fabOpen: { backgroundColor: '#1a1a1a' },
  fabIcon: { color: '#fff', fontSize: 24, fontWeight: '300' },
  option: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  optionLabel: {
    backgroundColor: '#1a1a1a', color: '#fff',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 8, fontSize: 13, fontWeight: '600',
  },
  optionBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#e5e0d8',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  optionIcon: { fontSize: 20 },
});
