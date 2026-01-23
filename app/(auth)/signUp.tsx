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
    // Check if Clerk is loaded
    if (!isLoaded) {
      Alert.alert("Loading", "Please wait a moment and try again.")
      return
    }
    
    // Validate name
    if (!name.trim()) {
      Alert.alert("Name required", "Please enter your full name.")
      return
    }
    if (name.trim().length < 2) {
      Alert.alert("Invalid name", "Name must be at least 2 characters.")
      return
    }

    // Validate email
    if (!emailAddress.trim()) {
      Alert.alert("Email required", "Please enter your email address.")
      return
    }
    if (!validateEmail(emailAddress)) {
      Alert.alert("Invalid email", "Please enter a valid email address.")
      return
    }

    // Validate password
    if (!password) {
      Alert.alert("Password required", "Please enter a password.")
      return
    }
    if (!validatePassword(password)) {
      Alert.alert("Weak password", "Password must be at least 8 characters long.")
      return
    }
    if (!/[A-Z]/.test(password)) {
      Alert.alert("Weak password", "Password must contain at least one uppercase letter.")
      return
    }
    if (!/[0-9]/.test(password)) {
      Alert.alert("Weak password", "Password must contain at least one number.")
      return
    }

    // Validate password confirmation
    if (!confirmPassword) {
      Alert.alert("Confirmation required", "Please confirm your password.")
      return
    }
    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords do not match. Please try again.")
      return
    }

    setLoading(true)
    try {
      const nameParts = name.trim().split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ') || undefined

      await signUp.create({ 
        emailAddress: emailAddress.trim().toLowerCase(), 
        password,
        firstName,
        lastName
      })
      
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
      Alert.alert("Verification sent", "Please check your email for the verification code.")
    } catch (err: any) {
      // Only log unexpected errors in development
      if (__DEV__ && !err.errors) {
        console.error("Sign-up error:", err)
      }

      // Handle Clerk-specific errors
      if (err.errors && err.errors.length > 0) {
        const error = err.errors[0]
        
        // Handle specific error codes
        switch (error.code) {
          case 'form_identifier_exists':
            Alert.alert("Email already exists", "An account with this email already exists. Please sign in instead.")
            break
          case 'form_password_pwned':
            Alert.alert("Weak password", "This password has been found in a data breach. Please choose a different password.")
            break
          case 'form_password_length_too_short':
            Alert.alert("Password too short", "Password must be at least 8 characters long.")
            break
          case 'form_password_not_strong_enough':
            Alert.alert("Weak password", "Please choose a stronger password with uppercase, lowercase, and numbers.")
            break
          case 'form_param_format_invalid':
            Alert.alert("Invalid format", "Please check your input and try again.")
            break
          case 'form_param_nil':
            Alert.alert("Missing information", "Please fill in all required fields.")
            break
          case 'form_param_value_invalid':
            Alert.alert("Invalid input", "One or more fields contain invalid information.")
            break
          case 'form_identifier_not_found':
            Alert.alert("Email not valid", "Please enter a valid email address.")
            break
          default:
            Alert.alert("Error", error.longMessage || error.message || "Something went wrong during sign-up.")
        }
      } else if (err.status === 422) {
        Alert.alert("Invalid input", "Please check your information and try again.")
      } else if (err.status === 429) {
        Alert.alert("Too many attempts", "You've made too many sign-up attempts. Please try again later.")
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

  const onVerifyPress = async () => {
    // Check if Clerk is loaded
    if (!isLoaded) {
      Alert.alert("Loading", "Please wait a moment and try again.")
      return
    }

    // Validate code
    if (!code.trim()) {
      Alert.alert("Code required", "Please enter the verification code.")
      return
    }
    if (code.trim().length !== 6) {
      Alert.alert("Invalid code", "Verification code must be 6 digits.")
      return
    }

    setLoading(true)
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ 
        code: code.trim() 
      })
      
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        Alert.alert("Success", "Account created successfully!")
        router.replace('/(tabs)/chats')
      } else if (signUpAttempt.status === 'missing_requirements') {
        Alert.alert("Additional info needed", "Please complete your profile information.")
      } else {
        Alert.alert("Verification incomplete", "Unable to verify your email. Please try again.")
      }
    } catch (err: any) {
      // Only log unexpected errors in development
      if (__DEV__ && !err.errors) {
        console.error("Verification error:", err)
      }

      // Handle Clerk-specific errors
      if (err.errors && err.errors.length > 0) {
        const error = err.errors[0]
        
        // Handle specific error codes
        switch (error.code) {
          case 'form_code_incorrect':
            Alert.alert("Incorrect code", "The verification code is incorrect. Please try again.")
            break
          case 'verification_expired':
            Alert.alert("Code expired", "The verification code has expired. Please request a new one.")
            setPendingVerification(false)
            break
          case 'verification_failed':
            Alert.alert("Verification failed", "Unable to verify your email. Please try again.")
            break
          case 'too_many_attempts':
            Alert.alert("Too many attempts", "You've entered the wrong code too many times. Please request a new one.")
            setPendingVerification(false)
            break
          default:
            Alert.alert("Error", error.longMessage || error.message || "Something went wrong during verification.")
        }
      } else if (err.status === 400) {
        Alert.alert("Invalid code", "Please enter a valid 6-digit verification code.")
      } else if (err.status === 422) {
        Alert.alert("Invalid code", "The code you entered is invalid.")
      } else if (err.status === 429) {
        Alert.alert("Too many attempts", "Please wait a moment before trying again.")
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

  const resendCode = async () => {
    if (!isLoaded || loading) return

    setLoading(true)
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      Alert.alert("Code resent", "A new verification code has been sent to your email.")
    } catch (err: any) {
      if (__DEV__) {
        console.error("Resend error:", err)
      }
      Alert.alert("Error", "Failed to resend code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Verify Email</Text>
          <Text style={styles.subtitle}>Enter the 6-digit code sent to {emailAddress}</Text>

          <TextInput
            value={code}
            placeholder="000000"
            placeholderTextColor="#9CA3AF"
            onChangeText={setCode}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={6}
            editable={!loading}
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

          <TouchableOpacity onPress={resendCode} disabled={loading}>
            <Text style={[styles.linkText, loading && styles.linkDisabled]}>
              Didn't receive code? Resend
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setPendingVerification(false)} 
            disabled={loading}
            style={styles.backButton}
          >
            <Text style={[styles.backText, loading && styles.linkDisabled]}>← Back to sign up</Text>
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
              editable={!loading}
            />
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
              placeholder="Password (min. 8 characters)"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              onChangeText={setPassword}
              style={styles.input}
              editable={!loading}
            />
            <TextInput
              value={confirmPassword}
              placeholder="Confirm Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              onChangeText={setConfirmPassword}
              style={styles.input}
              editable={!loading}
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
              <TouchableOpacity disabled={loading}>
                <Text style={[styles.signInLink, loading && styles.linkDisabled]}>Sign In</Text>
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
  linkText: {
    color: '#3B82F6',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  linkDisabled: {
    opacity: 0.5,
  },
  backButton: {
    marginTop: 8,
  },
  backText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
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