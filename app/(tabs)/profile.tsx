import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Profile = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>

        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Account Status</Text>
        <Text style={styles.infoValue}>Online</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Member Since</Text>
        <Text style={styles.infoValue}>September 2024</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginVertical: 16,
  },
  profileCard: {
    backgroundColor: '#1E293B',
    padding: 24,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#94A3B8',
  },
  infoCard: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  infoLabel: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default Profile
