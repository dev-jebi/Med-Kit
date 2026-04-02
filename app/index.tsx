import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
      <ActivityIndicator size="large" color="#3b6ef5" />
    </View>
  );
}
