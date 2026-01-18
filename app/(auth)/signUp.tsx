import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [name, setName] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email)
  const validatePassword = (pw: string) => pw.length >= 8

  const onSignUpPress = async () => {
    if (!isLoaded) return
    
    if (!name.trim()) {
      return Alert.alert("Name required", "Please enter your name.")
    }
    if (!validateEmail(emailAddress)) {
      return Alert.alert("Invalid email", "Please enter a valid email address.")
    }
    if (!validatePassword(password)) {
      return Alert.alert("Weak password", "Password must be at least 8 characters.")
    }
    if (password !== confirmPassword) {
      return Alert.alert("Password mismatch", "Passwords do not match.")
    }

    setLoading(true)
    try {
      await signUp.create({ 
        emailAddress, 
        password,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' ') || undefined
      })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err: any) {
      if (err.clerkError) {
        Alert.alert("Error", err.errors?.[0]?.longMessage || "Something went wrong")
      }
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return

    if (!code.trim()) {
      return Alert.alert("Code required", "Please enter the verification code.")
    }

    setLoading(true)
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code })
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/(tabs)/chats')
      } else {
        Alert.alert("Verification incomplete", "Please check the code and try again.")
      }
    } catch (err: any) {
      if (err.clerkError) {
        Alert.alert("Error", err.errors?.[0]?.longMessage || "Something went wrong")
      }
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Verify Email</Text>
          <Text style={styles.subtitle}>Enter the code sent to {emailAddress}</Text>

          <TextInput
            value={code}
            placeholder="Verification code"
            placeholderTextColor="#9CA3AF"
            onChangeText={setCode}
            style={styles.input}
            keyboardType="number-pad"
          />

          <TouchableOpacity 
            onPress={onVerifyPress} 
            style={[styles.button, loading && styles.buttonDisabled]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Verify</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          <View style={styles.inputContainer}>
            <TextInput
              value={name}
              placeholder="Full Name"
              placeholderTextColor="#9CA3AF"
              onChangeText={setName}
              style={styles.input}
              autoCapitalize="words"
            />
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              value={emailAddress}
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              onChangeText={setEmailAddress}
              style={styles.input}
            />
            <TextInput
              value={password}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              onChangeText={setPassword}
              style={styles.input}
            />
            <TextInput
              value={confirmPassword}
              placeholder="Confirm Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              onChangeText={setConfirmPassword}
              style={styles.input}
            />
          </View>

          <TouchableOpacity 
            onPress={onSignUpPress} 
            style={[styles.button, loading && styles.buttonDisabled]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <Link href="/(auth)/signIn" asChild>
              <TouchableOpacity>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 40,
  },
  inputContainer: {
    gap: 16,
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#334155',
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#334155',
  },
  dividerText: {
    color: '#64748B',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  signInLink: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
})