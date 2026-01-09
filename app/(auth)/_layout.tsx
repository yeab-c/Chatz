import { Stack } from 'expo-router';
import React from 'react';

const authLayout = () => {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="signIn" options={{ title: 'Sign-in' }} />
      <Stack.Screen name="signUp" options={{ title: 'Sign-up' }} />
    </Stack>
  );
}

export default authLayout