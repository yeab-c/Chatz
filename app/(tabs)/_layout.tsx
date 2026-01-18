import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { Tabs } from "expo-router/tabs";
export default function RootLayout() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, title: "Chats" }} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#3B82F6",
          tabBarInactiveTintColor: "#64748B",
          tabBarStyle: {
              backgroundColor: "#1E293B",
              borderTopWidth: 0,
              borderTopColor: "transparent",
              height: 90,
              paddingBottom: 30,
              paddingTop: 10,
          },
          headerShown: false,
        }}
      >
          <Tabs.Screen
              name="chats"
              options={{
                  title: "Chats",
                  tabBarIcon: ({color, size}) => (
                      <Ionicons name="chatbubbles-outline" color={color} size={size} />
                  ),
              }}
          />
          <Tabs.Screen
              name="profile"
              options={{
                  title: "Profile",
                  tabBarIcon: ({color, size}) => (
                      <Ionicons name="person-circle-outline" color={color} size={size} />
                  ),
              }}
          />
          <Tabs.Screen
              name="settings"
              options={{
                  title: "Settings",
                  tabBarIcon: ({color, size}) => (
                      <Ionicons name="settings-outline" color={color} size={size} />
                  ),
              }}
          />
      </Tabs>
    </>
  )
}