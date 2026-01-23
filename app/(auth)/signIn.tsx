import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email)

  const onSignInPress = async () => {
    if (!isLoaded) {
      Alert.alert("Loading", "Please wait a moment and try again.")
      return
    }

    if (!emailAddress.trim()) {
      Alert.alert("Email required", "Please enter your email address.")
      return
    }
    if (!validateEmail(emailAddress)) {
      Alert.alert("Invalid email", "Please enter a valid email address.")
      return
    }

    if (!password) {
      Alert.alert("Password required", "Please enter your password.")
      return
    }
    if (password.length < 8) {
      Alert.alert("Invalid password", "Password must be at least 8 characters.")
      return
    }

    setLoading(true)
    
    const timeoutId = setTimeout(() => {
      if (loading) {
        Alert.alert("Taking longer than usual", "Please check your internet connection.")
      }
    }, 10000)
    
    try {
      const signInAttempt = await signIn.create({ 
        identifier: emailAddress.trim().toLowerCase(), 
        password 
      })
      
      clearTimeout(timeoutId)

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/(tabs)/chats')
      } else if (signInAttempt.status === 'needs_first_factor') {
        Alert.alert("Verification needed", "Please complete two-factor authentication.")
      } else if (signInAttempt.status === 'needs_second_factor') {
        Alert.alert("Verification needed", "Please complete second factor authentication.")
      } else {
        Alert.alert("Sign-in incomplete", "Unable to complete sign-in. Please try again.")
      }
    } catch (err: any) {
      clearTimeout(timeoutId)
      
      // Only log unexpected errors in development
      if (__DEV__ && !err.errors) {
        console.error("Sign-in error:", err)
      }

      if (err.errors && err.errors.length > 0) {
        const error = err.errors[0]
        
        switch (error.code) {
          case 'form_identifier_not_found':
            Alert.alert("Account not found", "No account exists with this email address.")
            break
          case 'form_password_incorrect':
            Alert.alert("Incorrect password", "The password you entered is incorrect.")
            break
          case 'form_param_format_invalid':
            Alert.alert("Invalid format", "Please check your email and password format.")
            break
          case 'strategy_for_user_invalid':
            Alert.alert("Sign-in method unavailable", "This sign-in method is not available for your account.")
            break
          case 'session_exists':
            Alert.alert("Already signed in", "You are already signed in.")
            router.replace('/(tabs)/chats')
            break
          case 'user_locked':
            Alert.alert("Account locked", "Your account has been locked. Please contact support.")
            break
          default:
            Alert.alert("Error", error.longMessage || error.message || "Something went wrong during sign-in.")
        }
      } else if (err.status === 401) {
        Alert.alert("Invalid credentials", "Email or password is incorrect.")
      } else if (err.status === 422) {
        Alert.alert("Invalid input", "Please check your email and password.")
      } else if (err.status === 429) {
        Alert.alert("Too many attempts", "You've made too many sign-in attempts. Please try again later.")
      } else if (err.status >= 500) {
        Alert.alert("Server error", "Our servers are experiencing issues. Please try again later.")
      } else if (err.message) {
        Alert.alert("Error", err.message)
      } else {
        Alert.alert("Error", "An unexpected error occurred. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            value={emailAddress}
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            onChangeText={setEmailAddress}
            style={styles.input}
            editable={!loading}
          />
          <TextInput
            value={password}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            onChangeText={setPassword}
            style={styles.input}
            editable={!loading}
          />
        </View>

        <TouchableOpacity 
          onPress={onSignInPress} 
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity disabled={loading}>
          <Text style={[styles.linkText, loading && styles.linkDisabled]}>Forgot password?</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <Link href="/(auth)/signUp" asChild>
            <TouchableOpacity disabled={loading}>
              <Text style={[styles.signUpLink, loading && styles.linkDisabled]}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    paddingHorizontal: 24,
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
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    color: '#3B82F6',
    fontSize: 14,
    textAlign: 'center',
  },
  linkDisabled: {
    opacity: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  signUpLink: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
})