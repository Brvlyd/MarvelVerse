import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BaseModal from './BaseModal';

const NotificationModal = ({ visible, onClose }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications] = useState([
    {
      id: 1,
      type: 'update',
      title: 'New Character Added',
      message: 'Echo has joined the Marvel Universe! Check out her unique abilities now.',
      time: '2m ago',
      read: false
    },
    {
      id: 2,
      type: 'event',
      title: 'Limited Time Event',
      message: 'The Multiverse Saga event has begun! Explore alternate universe heroes.',
      time: '1h ago',
      read: false
    },
    {
      id: 3,
      type: 'favorite',
      title: 'Spider-Man Updated',
      message: 'New comic series featuring your favorite hero Spider-Man is now available.',
      time: '3h ago',
      read: true
    }
  ]);

  const getIconName = (type) => {
    switch (type) {
      case 'update': return 'arrow-up-circle';
      case 'event': return 'star';
      case 'favorite': return 'heart';
      case 'system': return 'information-circle';
      default: return 'notifications';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'update': return '#2196F3';
      case 'event': return '#FF9800';
      case 'favorite': return '#E91E63';
      case 'system': return '#4CAF50';
      default: return '#757575';
    }
  };

  const filteredNotifications = activeFilter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);

  return (
    <BaseModal visible={visible} onClose={onClose} position="right">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>
              {filteredNotifications.length} {activeFilter === 'unread' ? 'unread' : 'total'} notifications
            </Text>
          </View>
          <TouchableOpacity 
            onPress={onClose}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            onPress={() => setActiveFilter('all')}
            style={[
              styles.filterButton,
              activeFilter === 'all' && styles.filterButtonActive
            ]}
          >
            <Text style={[
              styles.filterButtonText,
              activeFilter === 'all' && styles.filterButtonTextActive
            ]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveFilter('unread')}
            style={[
              styles.filterButton,
              activeFilter === 'unread' && styles.filterButtonActive
            ]}
          >
            <Text style={[
              styles.filterButtonText,
              activeFilter === 'unread' && styles.filterButtonTextActive
            ]}>
              Unread
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notifications List */}
        <ScrollView style={styles.notificationsList}>
          {filteredNotifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                !notification.read && styles.notificationItemUnread
              ]}
            >
              <View style={[
                styles.iconContainer,
                { backgroundColor: `${getIconColor(notification.type)}15` }
              ]}>
                <Ionicons
                  name={getIconName(notification.type)}
                  size={20}
                  color={getIconColor(notification.type)}
                />
              </View>
              <View style={styles.contentContainer}>
                <View style={styles.titleRow}>
                  <Text style={styles.notificationTitle} numberOfLines={1}>
                    {notification.title}
                  </Text>
                  <Text style={styles.timeText}>{notification.time}</Text>
                </View>
                <Text style={styles.messageText} numberOfLines={2}>
                  {notification.message}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 320,
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'Poppins',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    fontFamily: 'PoppinsRegular',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  filterButtonActive: {
    backgroundColor: '#FFEBEE',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'PoppinsRegular',
  },
  filterButtonTextActive: {
    color: '#ED1D24',
    fontWeight: '600',
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  notificationItemUnread: {
    backgroundColor: '#F8F9FA',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
    marginRight: 8,
    fontFamily: 'Poppins',
  },
  timeText: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'PoppinsRegular',
  },
  messageText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    fontFamily: 'PoppinsRegular',
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
});

export default NotificationModal;