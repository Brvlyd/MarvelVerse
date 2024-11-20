import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 24;

const CharacterCard = ({ item, isFavorite, onToggleFavorite, onPress }) => {
  const scaleAnim = useState(new Animated.Value(1))[0];
  const shadowAnim = useState(new Animated.Value(1))[0];

  const onPressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(shadowAnim, {
        toValue: 0.5,
        useNativeDriver: true,
      })
    ]).start();
  };

  const onPressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 200,
        friction: 20,
        useNativeDriver: true,
      }),
      Animated.spring(shadowAnim, {
        toValue: 1,
        tension: 200,
        friction: 20,
        useNativeDriver: true,
      })
    ]).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => onPress(item)}
    >
      <Animated.View style={[
        styles.cardContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: shadowAnim.interpolate({
            inputRange: [0.5, 1],
            outputRange: [0.8, 1]
          })
        }
      ]}>
        <View style={styles.card}>
          <Image
            style={styles.image}
            source={{ 
              uri: `${item.thumbnail.path}.${item.thumbnail.extension}`,
            }}
            defaultSource={require('./assets/placeholder.png')}
          />
          {/* Gradient overlay on image */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
          
          <View style={styles.contentWrapper}>
            <View style={styles.cardContent}>
              <View style={styles.nameContainer}>
                <Text style={styles.name} numberOfLines={2}>
                  {item.name}
                </Text>
              </View>
              
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => onToggleFavorite(item)}
              >
                <Animated.View style={styles.favoriteIconContainer}>
                  <Ionicons
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={22}
                    color={isFavorite ? '#ED1D24' : '#ffffff'}
                    style={styles.favoriteIcon}
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  contentWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  nameContainer: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: '700',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  favoriteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 8,
    backdropFilter: 'blur(10px)',
  },
  favoriteIconContainer: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});

export default CharacterCard;