import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import {
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'


const MOCK_MESSAGES = [
  { id: '1', text: 'Hey!', sender: 'other' },
  { id: '2', text: 'Hi, how are you?', sender: 'me' },
  { id: '3', text: 'Doing great, you?', sender: 'other' },
  { id: '4', text: 'All good here 👍', sender: 'me' },
  { id: '5', text: 'What are you up to today?', sender: 'other' },
  { id: '6', text: 'Just working on this chat app 😄', sender: 'me' },
  { id: '7', text: 'Nice! React Native?', sender: 'other' },
  { id: '8', text: 'Yeah, with Expo Router.', sender: 'me' },
  { id: '9', text: 'That routing system is pretty clean.', sender: 'other' },
  { id: '10', text: 'Agreed. Took a bit to understand though.', sender: 'me' },
  { id: '11', text: 'Totally normal. Everyone struggles at first.', sender: 'other' },
  { id: '12', text: 'Yeah but it’s starting to click now.', sender: 'me' },
  { id: '13', text: 'That’s the best feeling.', sender: 'other' },
  { id: '14', text: 'Next step is backend + websockets.', sender: 'me' },
  { id: '15', text: 'Nice. Mongo + Redis, right?', sender: 'other' },
  { id: '16', text: 'Exactly. Express too.', sender: 'me' },
  { id: '17', text: 'Sounds like a solid stack.', sender: 'other' },
  { id: '18', text: 'Hope so 🤞', sender: 'me' },
  { id: '19', text: 'You’ll get there. One step at a time.', sender: 'other' },
  { id: '20', text: 'Yeah, focusing on UI first helped a lot.', sender: 'me' },
  { id: '21', text: 'That’s the right approach.', sender: 'other' },
  { id: '22', text: 'Alright, back to coding 😅', sender: 'me' },
  { id: '23', text: 'Good luck! Ping me if you get stuck.', sender: 'other' },
  { id: '24', text: 'Will do. Thanks!', sender: 'me' },
]


export default function ChatRoom() {
  const { chatId } = useLocalSearchParams()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(MOCK_MESSAGES)

  const flatListRef = useRef<FlatList>(null)

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
        flatListRef.current?.scrollToEnd({animated: true})
    })
  }, [])

  const sendMessage = () => {
        if (!message.trim()) return

        const newMessage = {
            id: Date.now().toString(),
            text: message,
            sender: 'me',
        }

        setMessages((prev) => [...prev, newMessage])
        setMessage('')
    }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Chat {chatId}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={ messages }
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messages}
        keyboardDismissMode='interactive'
        keyboardShouldPersistTaps='handled'
        onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({animated: true})
        }
        renderItem={({ item }) => {
          const isMe = item.sender === 'me'
          return (
            <View
              style={[
                styles.messageBubble,
                isMe ? styles.myMessage : styles.otherMessage,
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )
        }}
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#94A3B8"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={() => {
          sendMessage()
        }}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  messages: {
    padding: 16,
    gap: 12,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 12,
  },
  myMessage: {
    backgroundColor: '#3B82F6',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#1E293B',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  inputBar: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#FFFFFF',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
})
