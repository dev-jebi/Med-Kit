import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleAuth() {
    if (!email || !password) { Alert.alert('Fill in all fields'); return; }
    setLoading(true);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) Alert.alert('Error', error.message);
      else Alert.alert('Check your email to confirm your account');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) Alert.alert('Error', error.message);
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.logoArea}>
          <View style={styles.capsule}>
            <View style={styles.capsuleLeft}><Text style={styles.capsuleText}>?</Text></View>
            <View style={styles.capsuleRight}><Text style={styles.capsuleText}>!</Text></View>
          </View>
          <Text style={styles.appName}>MedKit</Text>
          <Text style={styles.tagline}>We got your back, you got your dose</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={[styles.btn, (!email || !password || loading) && styles.btnDisabled]}
            onPress={handleAuth}
            disabled={!email || !password || loading}
          >
            <Text style={styles.btnText}>
              {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={styles.toggle}>
          <Text style={styles.toggleText}>
            {isSignUp ? 'Already a user? ' : 'Not a user? '}
            <Text style={styles.toggleLink}>{isSignUp ? 'Sign In' : 'Sign Up'}</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f7f4f0', padding: 24, justifyContent: 'center' },
  logoArea: { alignItems: 'center', marginBottom: 48 },
  capsule: { flexDirection: 'row', width: 80, height: 40, borderRadius: 20, overflow: 'hidden', marginBottom: 16 },
  capsuleLeft: { flex: 1, backgroundColor: '#3b6ef5', justifyContent: 'center', alignItems: 'center' },
  capsuleRight: { flex: 1, backgroundColor: '#ef4444', justifyContent: 'center', alignItems: 'center' },
  capsuleText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  appName: { fontSize: 36, fontWeight: '800', color: '#1a1a1a', letterSpacing: -1 },
  tagline: { fontSize: 13, color: '#6b7280', marginTop: 6, fontStyle: 'italic', textAlign: 'center' },
  form: { gap: 12 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e0d8',
    borderRadius: 10, padding: 14, fontSize: 15, color: '#1a1a1a',
  },
  btn: { backgroundColor: '#3b6ef5', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 4 },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  toggle: { marginTop: 32, alignItems: 'center' },
  toggleText: { fontSize: 13, color: '#6b7280' },
  toggleLink: { color: '#3b6ef5', fontWeight: '700' },
});
