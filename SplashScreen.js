import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { useTheme } from './ThemeContext';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const { theme } = useTheme();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(300),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.delay(1000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ]).start(() => {
      onFinish && onFinish();
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Image
          source={require('./assets/splashscreen.png')}
          style={styles.logo}
          resizeMode="cover"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height * 1.1,
    overflow: 'hidden',
  },
  logoContainer: {
    width: width,
    height: height * 1.1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});