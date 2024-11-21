import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import MarvelScreen from './MarvelScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import SplashScreen from './SplashScreen';
import * as Font from 'expo-font';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

ExpoSplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    checkAuthStatus();
    loadResources();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authToken = await AsyncStorage.getItem('@auth_token');
      setIsAuthenticated(!!authToken);
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const loadResources = async () => {
    try {
      await Font.loadAsync({
        'Poppins': require('./assets/fonts/Poppins-Regular.ttf'),
        'PoppinsRegular': require('./assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
        'MarvelRegular': require('./assets/fonts/Marvel-Regular.ttf'),
      });
      setFontsLoaded(true);
    } catch (e) {
      console.warn('Error loading fonts:', e);
      setFontsLoaded(true);
    }
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await ExpoSplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleLoginSuccess = async () => {
    try {
      await AsyncStorage.setItem('@auth_token', 'dummy_token');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving auth token:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@auth_token');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  };

  if (!fontsLoaded || isCheckingAuth) {
    return null;
  }

  return (
    <ThemeProvider>
      <View style={styles.container} onLayout={onLayoutRootView}>
        {showSplash ? (
          <SplashScreen onFinish={handleSplashFinish} />
        ) : !isAuthenticated ? (
          showRegister ? (
            <RegisterScreen 
              onRegisterSuccess={handleLoginSuccess}
              onBackToLogin={() => setShowRegister(false)}
            />
          ) : (
            <LoginScreen 
              onLoginSuccess={handleLoginSuccess}
              onRegister={() => setShowRegister(true)}
            />
          )
        ) : (
          <>
            <MarvelScreen onLogout={handleLogout} />
            <StatusBar style="light" />
          </>
        )}
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});