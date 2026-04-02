import { Tabs } from 'expo-router';

export default function AppLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#e5e0d8' },
      tabBarActiveTintColor: '#3b6ef5',
      tabBarInactiveTintColor: '#9ca3af',
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
    }}>
      <Tabs.Screen name="home" options={{ title: 'Today' }} />
      <Tabs.Screen name="medicines" options={{ title: 'Medicines' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
