import { useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export const SignOutButton = () => {
  const { signOut } = useClerk()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true) // show loading overlay

    try {
      await signOut()
      // Simulate a 3-second "logging out" screen
      setTimeout(() => {
        setLoading(false)
        router.replace('/(auth)/signIn')
      }, 3000)
    } catch (err: any) {
      setLoading(false)
      console.error(err)
      alert(err.errors?.[0]?.longMessage || "Something went wrong")
    }
  }

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      {/* Loading overlay */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.loadingContainer}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Logging out...</Text>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'red',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    backgroundColor: '#1E293B',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
})
