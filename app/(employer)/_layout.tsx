import { Stack } from 'expo-router';

export default function EmployerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="profile/[id]" />
      <Stack.Screen name="chat/[id]" />
      <Stack.Screen name="active-booking/[id]" />
      <Stack.Screen name="payment-confirmation/[id]" />
    </Stack>
  );
}