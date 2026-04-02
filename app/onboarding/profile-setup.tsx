import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';

const TIME_DEFAULTS = {
  breakfast_start: '07:00', breakfast_end: '09:00',
  lunch_start: '12:00', lunch_end: '14:00',
  dinner_start: '19:00', dinner_end: '21:00',
};

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [times, setTimes] = useState(TIME_DEFAULTS);
  const [loading, setLoading] = useState(false);

  const isComplete = name.trim() && age.trim() &&
    Object.values(times).every(v => v.trim());

  function updateTime(key: keyof typeof TIME_DEFAULTS, value: string) {
    setTimes(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!isComplete) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      name: name.trim(),
      age: parseInt(age),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ...times,
    });
    setLoading(false);
    if (error) { Alert.alert('Error', error.message); return; }
    router.replace('/(app)/home');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Set up your profile</Text>
      <Text style={styles.subtitle}>This helps us time your reminders correctly</Text>

      <Text style={styles.label}>Your Name *</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName}
        placeholder="e.g. Jebin" placeholderTextColor="#9ca3af" />

      <Text style={styles.label}>Age *</Text>
      <TextInput style={styles.input} value={age} onChangeText={setAge}
        placeholder="e.g. 24" placeholderTextColor="#9ca3af" keyboardType="numeric" />

      <Text style={styles.sectionTitle}>Meal Windows *</Text>
      <Text style={styles.sectionNote}>Enter times as HH:MM (24hr format)</Text>

      {[
        { label: 'Breakfast', start: 'breakfast_start', end: 'breakfast_end' },
        { label: 'Lunch', start: 'lunch_start', end: 'lunch_end' },
        { label: 'Dinner', start: 'dinner_start', end: 'dinner_end' },
      ].map(meal => (
        <View key={meal.label} style={styles.mealRow}>
          <Text style={styles.mealLabel}>{meal.label}</Text>
          <View style={styles.mealTimes}>
            <TextInput
              style={[styles.input, styles.timeInput]}
              value={times[meal.start as keyof typeof TIME_DEFAULTS]}
              onChangeText={v => updateTime(meal.start as keyof typeof TIME_DEFAULTS, v)}
              placeholder="07:00" placeholderTextColor="#9ca3af" />
            <Text style={styles.arrow}>→</Text>
            <TextInput
              style={[styles.input, styles.timeInput]}
              value={times[meal.end as keyof typeof TIME_DEFAULTS]}
              onChangeText={v => updateTime(meal.end as keyof typeof TIME_DEFAULTS, v)}
              placeholder="09:00" placeholderTextColor="#9ca3af" />
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.btn, (!isComplete || loading) && styles.btnDisabled]}
        onPress={handleSave} disabled={!isComplete || loading}>
        <Text style={styles.btnText}>{loading ? 'Saving...' : 'Set Profile'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f4f0' },
  content: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: '800', color: '#1a1a1a', letterSpacing: -0.5, marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#6b7280', marginBottom: 28 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e0d8',
    borderRadius: 10, padding: 13, fontSize: 15, color: '#1a1a1a', marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginTop: 8, marginBottom: 4 },
  sectionNote: { fontSize: 12, color: '#9ca3af', marginBottom: 16 },
  mealRow: { marginBottom: 16 },
  mealLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  mealTimes: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timeInput: { flex: 1, marginBottom: 0 },
  arrow: { color: '#9ca3af', fontSize: 16 },
  btn: { backgroundColor: '#3b6ef5', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 16 },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
