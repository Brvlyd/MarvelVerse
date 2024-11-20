// Constants for notifications
export const NOTIFICATION_TYPES = {
    UPDATE: 'update',
    EVENT: 'event',
    FAVORITE: 'favorite',
    SYSTEM: 'system'
  };
  
  export const MOCK_NOTIFICATIONS = [
    {
      id: 1,
      type: NOTIFICATION_TYPES.UPDATE,
      title: 'New Character Added',
      message: 'Echo has joined the Marvel Universe! Check out her unique abilities now.',
      time: '2m ago',
      read: false
    },
    {
      id: 2,
      type: NOTIFICATION_TYPES.EVENT,
      title: 'Limited Time Event',
      message: 'The Multiverse Saga event has begun! Explore alternate universe heroes.',
      time: '1h ago',
      read: false
    },
    {
      id: 3,
      type: NOTIFICATION_TYPES.FAVORITE,
      title: 'Spider-Man Updated',
      message: 'New comic series featuring your favorite hero Spider-Man is now available.',
      time: '3h ago',
      read: true
    },
    {
      id: 4,
      type: NOTIFICATION_TYPES.SYSTEM,
      title: 'Daily Rewards',
      message: 'Don\'t forget to check in daily to earn special rewards and badges!',
      time: '5h ago',
      read: true
    },
    {
      id: 5,
      type: NOTIFICATION_TYPES.UPDATE,
      title: 'App Update Available',
      message: 'Version 2.0 is here with new features and improvements.',
      time: '1d ago',
      read: true
    }
  ];
  
  // Helper functions for notifications
  export const getNotificationIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.UPDATE:
        return 'arrow-up-circle';
      case NOTIFICATION_TYPES.EVENT:
        return 'star';
      case NOTIFICATION_TYPES.FAVORITE:
        return 'heart';
      case NOTIFICATION_TYPES.SYSTEM:
        return 'information-circle';
      default:
        return 'notifications';
    }
  };
  
  export const getNotificationColor = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.UPDATE:
        return '#2196F3';
      case NOTIFICATION_TYPES.EVENT:
        return '#FF9800';
      case NOTIFICATION_TYPES.FAVORITE:
        return '#E91E63';
      case NOTIFICATION_TYPES.SYSTEM:
        return '#4CAF50';
      default:
        return '#757575';
    }
  };
  
  // Modal position constants
  export const MODAL_POSITIONS = {
    BOTTOM: 'bottom',
    RIGHT: 'right',
    CENTER: 'center'
  };
  
  // Animation types
  export const ANIMATION_TYPES = {
    SLIDE: 'slide',
    FADE: 'fade',
    CUSTOM: 'custom'
  };
  
  // Storage keys for modals
  export const MODAL_STORAGE_KEYS = {
    USER_INFO: '@user_info',
    SETTINGS: '@settings',
    NOTIFICATIONS: '@notifications'
  };
  
  // Export modal components
  export { default as BaseModal } from './BaseModal';
  export { default as NotificationModal } from './NotificationModal';
  
  // Modal configuration defaults
  export const MODAL_DEFAULTS = {
    animationDuration: 300,
    maxHeight: '80%',
    borderRadius: 25,
    backdropOpacity: 0.5
  };