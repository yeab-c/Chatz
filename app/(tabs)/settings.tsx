import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SignOutButton } from '../components/SignOutButton'

const settingsOptions = [
  { id: '1', label: 'Account' },
  { id: '2', label: 'Notifications' },
  { id: '3', label: 'Privacy' },
  { id: '4', label: 'Appearance' },
  { id: '5', label: 'Help & Support' },
  { id: '6', label: 'About' },
]

const Settings = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.optionsList}>
        {settingsOptions.map((option) => (
          <TouchableOpacity key={option.id} style={styles.optionItem}>
            <Text style={styles.optionText}>{option.label}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.dangerZone}>
        <SignOutButton />
      </View>
    </ScrollView>
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
  optionsList: {
    gap: 12,
  },
  optionItem: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 24,
    color: '#64748B',
  },
  dangerZone: {
    marginTop: 32,
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: '#DC2626',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default Settings
