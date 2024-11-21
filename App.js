import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import MarvelScreen from './MarvelScreen';
import SplashScreen from './SplashScreen';
import * as Font from 'expo-font';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './ThemeContext';

ExpoSplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function loadResources() {
      try {
        await Font.loadAsync({
          'Poppins': require('./assets/fonts/Poppins-Regular.ttf'),
          'MarvelRegular': require('./assets/fonts/Marvel-Regular.ttf'),
        });
        setFontsLoaded(true);
      } catch (e) {
        console.warn(e);
      }
    }

    loadResources();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await ExpoSplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <View style={styles.container} onLayout={onLayoutRootView}>
        {showSplash ? (
          <SplashScreen onFinish={handleSplashFinish} />
        ) : (
          <>
            <MarvelScreen />
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