import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

const defaultFontSizes = {
  small: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
  },
  medium: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 28,
  },
  large: {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [currentFontSizes, setCurrentFontSizes] = useState(defaultFontSizes.medium);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    setCurrentFontSizes(defaultFontSizes[fontSize]);
  }, [fontSize]);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('@settings');
      if (settings) {
        const { appearance } = JSON.parse(settings);
        setIsDarkMode(appearance?.darkMode ?? false);
        setFontSize(appearance?.fontSize ?? 'medium');
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    }
  };

  const theme = {
    dark: {
      background: '#121212',
      surface: '#1E1E1E',
      text: '#FFFFFF',
      textSecondary: '#AAAAAA',
      border: '#333333',
    },
    light: {
      background: '#F5F5F5',
      surface: '#FFFFFF',
      text: '#333333',
      textSecondary: '#666666',
      border: '#EEEEEE',
    }
  };

  const toggleDarkMode = async () => {
    setIsDarkMode(prev => !prev);
    try {
      const settings = await AsyncStorage.getItem('@settings');
      const parsedSettings = settings ? JSON.parse(settings) : { appearance: {} };
      parsedSettings.appearance.darkMode = !isDarkMode;
      await AsyncStorage.setItem('@settings', JSON.stringify(parsedSettings));
    } catch (error) {
      console.error('Error saving theme settings:', error);
    }
  };

  const changeFontSize = async (size) => {
    setFontSize(size);
    try {
      const settings = await AsyncStorage.getItem('@settings');
      const parsedSettings = settings ? JSON.parse(settings) : { appearance: {} };
      parsedSettings.appearance.fontSize = size;
      await AsyncStorage.setItem('@settings', JSON.stringify(parsedSettings));
    } catch (error) {
      console.error('Error saving font settings:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      fontSize,
      toggleDarkMode,
      changeFontSize,
      theme: isDarkMode ? theme.dark : theme.light,
      fontSizes: currentFontSizes,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};