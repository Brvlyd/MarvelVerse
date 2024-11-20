import React from 'react';
import { 
  View, 
  Modal, 
  StyleSheet, 
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
  ScrollView,
  Animated
} from 'react-native';

const { height } = Dimensions.get('window');

const BaseModal = ({ 
  visible, 
  onClose, 
  children, 
  title,
  position = 'bottom', // 'bottom', 'right', 'center'
  useScrollView = true,
  animationType = 'slide'
}) => {
  // Animation value for custom animations
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
    switch (position) {
      case 'right':
        return [styles.modalContent, styles.rightModal];
      case 'bottom':
        return [styles.modalContent, styles.bottomModal];
      default:
        return [styles.modalContent, styles.centerModal];
    }
  };

  const renderContent = () => {
    const content = (
      <>
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

  // Use Modal for standard modal behavior
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

  // Use custom animation for special cases
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
    backgroundColor: '#FFFFFF',
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
  }
});

export default BaseModal;