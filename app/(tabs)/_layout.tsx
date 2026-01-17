import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router/tabs";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#64748B",
        tabBarStyle: {
            backgroundColor: "#1E293B",
            borderTopWidth: 0,
            borderTopColor: "transparent",
            height: 60,
            paddingBottom: 6,
            paddingTop: 6,
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
  )
}