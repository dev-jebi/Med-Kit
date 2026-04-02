import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

export default function SettingsScreen() {
  const { profile, signOut } = useAuth();

  function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{profile?.name || '—'}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Age</Text>
        <Text style={styles.value}>{profile?.age || '—'}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Timezone</Text>
        <Text style={styles.value}>{profile?.timezone || '—'}</Text>
      </View>
      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f4f0', padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#1a1a1a', letterSpacing: -0.5, marginBottom: 24 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: '#e5e0d8' },
  label: { fontSize: 11, fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  value: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  signOutBtn: { marginTop: 32, backgroundColor: '#fef2f2', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#fecaca' },
  signOutText: { color: '#dc2626', fontWeight: '700', fontSize: 15 },
});
