import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const dummyChats = [
  { id: '1', name: 'Alice', lastMessage: 'Hey, how are you?', unread: 2 },
  { id: '2', name: 'Bob', lastMessage: 'Let’s meet tomorrow', unread: 0 },
  { id: '3', name: 'Group Chat', lastMessage: 'New updates here', unread: 5 },
]

const ChatsScreen = () => {
    return (
    <View style={styles.container}>
      <Text style={styles.header}>Chats</Text>

      <FlatList
        data={dummyChats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatItem} onPress={() => router.push({ pathname: `/chat/[chatId]`, params: { chatId: item.id }})}>
            <View style={styles.chatInfo}>
              <Text style={styles.chatName}>{item.name}</Text>
              <Text style={styles.lastMessage}>{item.lastMessage}</Text>
            </View>

            {item.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unread}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginVertical: 16,
  },
  list: {
    gap: 12,
  },
  chatItem: {
    backgroundColor: "#1E293B",
    padding: 16,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  lastMessage: {
    color: "#94A3B8",
    fontSize: 14,
  },
  unreadBadge: {
    backgroundColor: "#3B82F6",
    borderRadius: 999,
    minWidth: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  unreadText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default ChatsScreen