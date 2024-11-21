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

const LoginScreen = ({ onLoginSuccess, onRegister }) => {
  const { theme, fontSizes } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
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
      setError('Please enter your password');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setError('');
    setLoading(true);

    try {
      const existingUsers = await AsyncStorage.getItem('@users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const user = users.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
      
      if (!user) {
        setError('Email not registered');
        setLoading(false);
        return;
      }

      if (user.password !== formData.password) {
        setError('Invalid password');
        setLoading(false);
        return;
      }

      // Store the current user data
      const currentUser = {
        ...user,
        loginTime: new Date().toISOString()
      };

      await AsyncStorage.setItem('@current_user', JSON.stringify(currentUser));
      await AsyncStorage.setItem('@auth_token', 'dummy_token');
      
      // Create initial settings for the user if they don't exist
      const settings = await AsyncStorage.getItem('@settings');
      if (!settings) {
        const initialSettings = {
          appearance: {
            darkMode: false,
            fontSize: 'medium'
          },
          notifications: {
            pushEnabled: true,
            emailEnabled: false,
            newHeroes: true,
            updates: true,
            newsletters: false
          }
        };
        await AsyncStorage.setItem('@settings', JSON.stringify(initialSettings));
      }

      onLoginSuccess();

    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
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
          <Image
            source={require('./assets/placeholder.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.welcomeText, { 
            color: theme.text,
            fontSize: fontSizes.xl 
          }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitleText, { 
            color: theme.textSecondary,
            fontSize: fontSizes.md 
          }]}>
            Sign in to continue your adventure
          </Text>
        </View>

        <View style={styles.formContainer}>
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

          {/* Forgot Password */}
          <TouchableOpacity 
            style={styles.forgotPasswordContainer}
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon!')}
          >
            <Text style={[styles.forgotPasswordText, { 
              color: theme.textSecondary,
              fontSize: fontSizes.sm 
            }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Error Message */}
          {error ? (
            <Text style={[styles.errorText, { fontSize: fontSizes.sm }]}>
              {error}
            </Text>
          ) : null}

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
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
                <Text style={[styles.loginButtonText, { fontSize: fontSizes.md }]}>
                  Sign In
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, { 
              color: theme.textSecondary,
              fontSize: fontSizes.sm 
            }]}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={onRegister}>
              <Text style={[styles.registerLink, { 
                color: '#ED1D24',
                fontSize: fontSizes.sm 
              }]}>
                {' Sign Up'}
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontFamily: 'PoppinsRegular',
  },
  errorText: {
    color: '#ED1D24',
    fontFamily: 'PoppinsRegular',
    marginBottom: 16,
    textAlign: 'center',
  },
  loginButton: {
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
  loginButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins',
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  registerText: {
    fontFamily: 'PoppinsRegular',
  },
  registerLink: {
    fontFamily: 'Poppins',
    fontWeight: '600',
  }
});

export default LoginScreen;