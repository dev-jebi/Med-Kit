import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from './supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Permission not granted for notifications');
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('medkit-reminders', {
      name: 'Medicine Reminders',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#3b6ef5',
      sound: 'default',
    });
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}

export async function saveTokenToSupabase(token: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from('profiles')
    .update({ expo_push_token: token })
    .eq('id', user.id);
}

export function useNotificationListeners(
  onReceived: (n: Notifications.Notification) => void,
  onResponse: (r: Notifications.NotificationResponse) => void
) {
  const receivedSub = Notifications.addNotificationReceivedListener(onReceived);
  const responseSub = Notifications.addNotificationResponseReceivedListener(onResponse);
  return () => {
    receivedSub.remove();
    responseSub.remove();
  };
}
