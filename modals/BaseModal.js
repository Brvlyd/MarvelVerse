import React from 'react';
import { 
  View, 
  Modal, 
  StyleSheet, 
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
  ScrollView,
  Animated,
  Text
} from 'react-native';
import { useTheme } from '../ThemeContext';

const { height } = Dimensions.get('window');

const BaseModal = ({ 
  visible, 
  onClose, 
  children, 
  title,
  position = 'bottom',
  useScrollView = true,
  animationType = 'slide'
}) => {
  const { theme, fontSizes } = useTheme();
  const [slideAnimation] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 20
      }).start();
    } else {
      Animated.spring(slideAnimation, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 20
      }).start();
    }
  }, [visible]);

  const getAnimationStyle = () => {
    switch (position) {
      case 'right':
        return {
          transform: [{
            translateX: slideAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [300, 0]
            })
          }]
        };
      case 'bottom':
        return {
          transform: [{
            translateY: slideAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [300, 0]
            })
          }]
        };
      default:
        return {
          opacity: slideAnimation
        };
    }
  };

  const getContainerStyle = () => {
    const baseStyle = [
      styles.modalContent, 
      { backgroundColor: theme.surface }
    ];

    switch (position) {
      case 'right':
        return [...baseStyle, styles.rightModal];
      case 'bottom':
        return [...baseStyle, styles.bottomModal];
      default:
        return [...baseStyle, styles.centerModal];
    }
  };

  const renderContent = () => {
    const content = (
      <>
        {title && (
          <View style={[styles.titleContainer, { borderBottomColor: theme.border }]}>
            <Text style={[styles.titleText, { 
              color: theme.text,
              fontSize: fontSizes.lg 
            }]}>{title}</Text>
          </View>
        )}
        {children}
      </>
    );

    if (useScrollView) {
      return (
        <ScrollView 
          bounces={false} 
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      );
    }

    return content;
  };

  if (animationType === 'slide' || animationType === 'fade') {
    return (
      <Modal
        animationType={animationType}
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>
          <View style={getContainerStyle()}>
            {renderContent()}
          </View>
        </View>
      </Modal>
    );
  }

  if (!visible) return null;
  
  return (
    <View style={styles.modalOverlay}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View 
          style={[
            styles.backdrop,
            {
              opacity: slideAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5]
              })
            }
          ]} 
        />
      </TouchableWithoutFeedback>
      <Animated.View style={[getContainerStyle(), getAnimationStyle()]}>
        {renderContent()}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    maxHeight: height * 0.8,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    position: 'relative',
  },
  rightModal: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '80%',
    maxWidth: 320,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    borderTopRightRadius: 0,
  },
  bottomModal: {
    width: '100%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  centerModal: {
    margin: 20,
    borderRadius: 25,
  },
  titleContainer: {
    padding: 20,
    borderBottomWidth: 1,
  },
  titleText: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default BaseModal;