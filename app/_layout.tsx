import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const { session, profile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!session) { router.replace('/auth/login'); return; }
    if (!profile) { router.replace('/onboarding/profile-setup'); return; }
    router.replace('/(app)/home');
  }, [session, profile, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#3b6ef5" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="onboarding/profile-setup" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}
