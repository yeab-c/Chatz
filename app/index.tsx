import { Redirect } from "expo-router";
import { useState } from "react";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/signIn" />;
  }

  return <Redirect href="/(tabs)/chats" />;
}