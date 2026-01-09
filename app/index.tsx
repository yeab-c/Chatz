import { Text, View } from "react-native";

import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Redirects to (tabs) or (auth)</Text>
      <Link href="/(auth)/signIn">
        <Text>Go to Sign In</Text>
      </Link>
    </View>
  );
}
