import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './ThemeContext';

const { width } = Dimensions.get('window');

const RegisterScreen = ({ onRegisterSuccess, onBackToLogin }) => {
  const { theme, fontSizes } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.password) {
      setError('Please enter a password');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (!formData.confirmPassword) {
      setError('Please confirm your password');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setError('');
    setLoading(true);

    try {
      // Check if email already exists
      const existingUsers = await AsyncStorage.getItem('@users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const emailExists = users.some(user => user.email === formData.email.trim().toLowerCase());
      
      if (emailExists) {
        setError('Email already registered');
        setLoading(false);
        return;
      }

      // Add new user
      const newUser = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password, // In a real app, you should hash the password
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      await AsyncStorage.setItem('@users', JSON.stringify(users));

      // Show success message and redirect to login
      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully. Please login with your credentials.',
        [
          {
            text: 'OK',
            onPress: onBackToLogin
          }
        ]
      );

    } catch (error) {
      console.error('Error during registration:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.surface }]}
            onPress={onBackToLogin}
          >
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </TouchableOpacity>

          <Image
            source={require('./assets/placeholder.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.welcomeText, { 
            color: theme.text,
            fontSize: fontSizes.xl 
          }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitleText, { 
            color: theme.textSecondary,
            fontSize: fontSizes.md 
          }]}>
            Join the Marvel Universe today
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, { backgroundColor: theme.surface }]}>
              <Ionicons name="person-outline" size={20} color={theme.textSecondary} />
              <TextInput
                style={[styles.input, { 
                  color: theme.text,
                  fontSize: fontSizes.md 
                }]}
                placeholder="Full Name"
                placeholderTextColor={theme.textSecondary}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, { backgroundColor: theme.surface }]}>
              <Ionicons name="mail-outline" size={20} color={theme.textSecondary} />
              <TextInput
                style={[styles.input, { 
                  color: theme.text,
                  fontSize: fontSizes.md 
                }]}
                placeholder="Email"
                placeholderTextColor={theme.textSecondary}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, { backgroundColor: theme.surface }]}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} />
              <TextInput
                style={[styles.input, { 
                  color: theme.text,
                  fontSize: fontSizes.md 
                }]}
                placeholder="Password"
                placeholderTextColor={theme.textSecondary}
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, { backgroundColor: theme.surface }]}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} />
              <TextInput
                style={[styles.input, { 
                  color: theme.text,
                  fontSize: fontSizes.md 
                }]}
                placeholder="Confirm Password"
                placeholderTextColor={theme.textSecondary}
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Error Message */}
          {error ? (
            <Text style={[styles.errorText, { fontSize: fontSizes.sm }]}>
              {error}
            </Text>
          ) : null}

          {/* Register Button */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            <LinearGradient
              colors={['#ED1D24', '#C4151B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={[styles.registerButtonText, { fontSize: fontSizes.md }]}>
                  Create Account
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { 
              color: theme.textSecondary,
              fontSize: fontSizes.sm 
            }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={onBackToLogin}>
              <Text style={[styles.loginLink, { 
                color: '#ED1D24',
                fontSize: fontSizes.sm 
              }]}>
                {' Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.6,
    height: 60,
    marginBottom: 20,
  },
  welcomeText: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitleText: {
    fontFamily: 'PoppinsRegular',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'PoppinsRegular',
  },
  errorText: {
    color: '#ED1D24',
    fontFamily: 'PoppinsRegular',
    marginBottom: 16,
    textAlign: 'center',
  },
  registerButton: {
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins',
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontFamily: 'PoppinsRegular',
  },
  loginLink: {
    fontFamily: 'Poppins',
    fontWeight: '600',
  }
});

export default RegisterScreen;