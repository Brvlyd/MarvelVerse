import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  TextInput,
  Switch,
  Platform,
  Linking,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseModal } from './modals';

const STORAGE_KEYS = {
  USER_INFO: '@user_info',
  SETTINGS: '@settings'
};

const MODAL_POSITIONS = {
  BOTTOM: 'bottom'
};

const MenuItem = ({ title, icon, onPress }) => (
  <TouchableOpacity 
    style={styles.menuItem} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.menuIconContainer}>
      <Ionicons name={icon} size={22} color="#666" />
    </View>
    <Text style={styles.menuText}>{title}</Text>
    <Ionicons name="chevron-forward" size={20} color="#666" />
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const [userInfo, setUserInfo] = useState({
    name: "Bravely Dirgayuska",
    email: "bravelydirgayuska@gmail.com",
    favoriteHeroes: 12,
  });

  const [editedName, setEditedName] = useState(userInfo.name);
  const [editedEmail, setEditedEmail] = useState(userInfo.email);
  const [activeModal, setActiveModal] = useState(null);

  const [settings, setSettings] = useState({
    notifications: {
      pushEnabled: true,
      emailEnabled: false,
    },
    appearance: {
      darkMode: false,
      fontSize: 'medium',
    }
  });

  const handleLinkPress = useCallback(async (url) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while opening the link');
    }
  }, []);

  const handleUpdateProfile = useCallback(() => {
    if (!editedName.trim() || !editedEmail.trim()) {
      Alert.alert('Error', 'Name and email cannot be empty');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setUserInfo(prev => ({
      ...prev,
      name: editedName.trim(),
      email: editedEmail.trim()
    }));
    setActiveModal(null);

    try {
      AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify({
        name: editedName.trim(),
        email: editedEmail.trim(),
        favoriteHeroes: userInfo.favoriteHeroes
      }));
    } catch (error) {
      console.error('Error saving user info:', error);
    }
  }, [editedName, editedEmail, userInfo.favoriteHeroes]);

  const handleUpdateSettings = useCallback((type, key, value) => {
    setSettings(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: value
      }
    }));

    try {
      AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({
        ...settings,
        [type]: {
          ...settings[type],
          [key]: value
        }
      }));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [settings]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                STORAGE_KEYS.USER_INFO, 
                STORAGE_KEYS.SETTINGS
              ]);
            } catch (error) {
              console.error('Error during logout:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, []);

  const menuItems = [
    { 
      id: 1, 
      title: 'Edit Profile', 
      icon: 'person-outline',
      onPress: () => setActiveModal('profile')
    },
    { 
      id: 2, 
      title: 'Notifications', 
      icon: 'notifications-outline',
      onPress: () => setActiveModal('notifications')
    },
    { 
      id: 3, 
      title: 'Appearance', 
      icon: 'color-palette-outline',
      onPress: () => setActiveModal('appearance')
    },
    { 
      id: 4, 
      title: 'Help & Support', 
      icon: 'help-circle-outline',
      onPress: () => setActiveModal('help')
    },
  ];

  const renderMainContent = () => (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      bounces={true}
    >
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image
            source={require('./assets/profile.jpg')}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{userInfo.name}</Text>
            <Text style={styles.email}>{userInfo.email}</Text>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <Ionicons name="heart" size={20} color="#ED1D24" />
          <Text style={styles.statsText}>
            {userInfo.favoriteHeroes} Favorite Heroes
          </Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <MenuItem 
            key={item.id} 
            title={item.title} 
            icon={item.icon}
            onPress={item.onPress}
          />
        ))}
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out-outline" size={22} color="#ED1D24" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderModals = () => (
    <View>
      <BaseModal
        visible={activeModal === 'profile'}
        onClose={() => setActiveModal(null)}
        position={MODAL_POSITIONS.BOTTOM}
        title="Edit Profile"
      >
        <View style={styles.modalForm}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter your name"
              maxLength={50}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={editedEmail}
              onChangeText={setEditedEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleUpdateProfile}
          >
            <Text style={styles.submitButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </BaseModal>

      <BaseModal
        visible={activeModal === 'notifications'}
        onClose={() => setActiveModal(null)}
        position={MODAL_POSITIONS.BOTTOM}
        title="Notifications"
      >
        <View style={styles.modalForm}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive push notifications for updates
              </Text>
            </View>
            <Switch
              value={settings.notifications.pushEnabled}
              onValueChange={(value) => 
                handleUpdateSettings('notifications', 'pushEnabled', value)
              }
              trackColor={{ false: "#767577", true: "#ED1D24" }}
              thumbColor={Platform.OS === 'ios' ? "#FFFFFF" : 
                settings.notifications.pushEnabled ? "#FFFFFF" : "#f4f3f4"}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Email Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive email updates and newsletters
              </Text>
            </View>
            <Switch
              value={settings.notifications.emailEnabled}
              onValueChange={(value) => 
                handleUpdateSettings('notifications', 'emailEnabled', value)
              }
              trackColor={{ false: "#767577", true: "#ED1D24" }}
              thumbColor={Platform.OS === 'ios' ? "#FFFFFF" : 
                settings.notifications.emailEnabled ? "#FFFFFF" : "#f4f3f4"}
            />
          </View>
        </View>
      </BaseModal>

      <BaseModal
        visible={activeModal === 'appearance'}
        onClose={() => setActiveModal(null)}
        position={MODAL_POSITIONS.BOTTOM}
        title="Appearance"
      >
        <View style={styles.modalForm}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Switch between light and dark theme
              </Text>
            </View>
            <Switch
              value={settings.appearance.darkMode}
              onValueChange={(value) => 
                handleUpdateSettings('appearance', 'darkMode', value)
              }
              trackColor={{ false: "#767577", true: "#ED1D24" }}
              thumbColor={Platform.OS === 'ios' ? "#FFFFFF" : 
                settings.appearance.darkMode ? "#FFFFFF" : "#f4f3f4"}
            />
          </View>
          <View style={styles.fontSizeSelector}>
            <Text style={styles.settingTitle}>Font Size</Text>
            <View style={styles.fontSizeOptions}>
              {['small', 'medium', 'large'].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.fontSizeOption,
                    settings.appearance.fontSize === size && styles.selectedFontSize
                  ]}
                  onPress={() => handleUpdateSettings('appearance', 'fontSize', size)}
                >
                  <Text style={[
                    styles.fontSizeText,
                    settings.appearance.fontSize === size && styles.selectedFontSizeText
                  ]}>
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </BaseModal>

      <BaseModal
        visible={activeModal === 'help'}
        onClose={() => setActiveModal(null)}
        position={MODAL_POSITIONS.BOTTOM}
        title="Help & Support"
      >
        <View style={styles.modalForm}>
          <TouchableOpacity 
            style={styles.helpItem}
            onPress={() => handleLinkPress('https://developer.marvel.com/documentation/getting_started')}
          >
            <Ionicons name="book-outline" size={24} color="#333" />
            <View style={styles.helpItemContent}>
              <Text style={styles.helpItemTitle}>Documentation</Text>
              <Text style={styles.helpItemDescription}>Learn how to use Marvel API</Text>
            </View>
            <Ionicons name="open-outline" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.helpItem}
            onPress={() => handleLinkPress('https://developer.marvel.com/docs')}
          >
            <Ionicons name="code-slash-outline" size={24} color="#333" />
            <View style={styles.helpItemContent}>
              <Text style={styles.helpItemTitle}>API Reference</Text>
              <Text style={styles.helpItemDescription}>Explore Marvel API endpoints</Text>
            </View>
            <Ionicons name="open-outline" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.helpItem}
            onPress={() => handleLinkPress('https://developer.marvel.com/forum')}
          >
            <Ionicons name="chatbubbles-outline" size={24} color="#333" />
            <View style={styles.helpItemContent}>
              <Text style={styles.helpItemTitle}>Developer Forum</Text>
              <Text style={styles.helpItemDescription}>Join the Marvel developer community</Text>
            </View>
            <Ionicons name="open-outline" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.helpItem}
            onPress={() => handleLinkPress('https://developer.marvel.com/terms')}
          >
            <Ionicons name="document-text-outline" size={24} color="#333" />
            <View style={styles.helpItemContent}>
              <Text style={styles.helpItemTitle}>Terms & Conditions</Text>
              <Text style={styles.helpItemDescription}>Read Marvel API usage terms</Text>
            </View>
            <Ionicons name="open-outline" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.helpItem}
            onPress={() => handleLinkPress('mailto:support@marvel.com')}
          >
            <Ionicons name="mail-outline" size={24} color="#333" />
            <View style={styles.helpItemContent}>
              <Text style={styles.helpItemTitle}>Contact Support</Text>
              <Text style={styles.helpItemDescription}>Email the Marvel support team</Text>
            </View>
            <Ionicons name="open-outline" size={20} color="#666" />
          </TouchableOpacity>

          <View style={styles.marvelCredit}>
            <Image
              source={require('./assets/placeholder.png')}
              style={styles.marvelLogo}
              resizeMode="contain"
            />
            <Text style={styles.marvelCreditText}>
              Data provided by Marvel. © 2024 Bravely Co.
            </Text>
          </View>
        </View>
      </BaseModal>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {renderMainContent()}
      {renderModals()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EEEEEE',
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'Poppins',
  },
  email: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'PoppinsRegular',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 12,
  },
  statsText: {
    fontSize: 14,
    color: '#333333',
    fontFamily: 'PoppinsRegular',
    marginLeft: 8,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    fontFamily: 'PoppinsRegular',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    margin: 20,
    padding: 15,
    borderRadius: 15,
    marginBottom: 30,
  },
  logoutText: {
    color: '#ED1D24',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins',
    marginLeft: 8,
  },
  modalForm: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    fontFamily: 'PoppinsRegular',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    fontFamily: 'PoppinsRegular',
  },
  submitButton: {
    backgroundColor: '#ED1D24',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  settingInfo: {
    flex: 1,
    paddingRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'PoppinsRegular',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'PoppinsRegular',
  },
  fontSizeSelector: {
    marginTop: 20,
  },
  fontSizeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  fontSizeOption: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  selectedFontSize: {
    backgroundColor: '#ED1D24',
  },
  fontSizeText: {
    fontSize: 14,
    color: '#333333',
    fontFamily: 'PoppinsRegular',
  },
  selectedFontSizeText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  helpItemContent: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
  },
  helpItemTitle: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'PoppinsRegular',
    marginBottom: 4,
  },
  helpItemDescription: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'PoppinsRegular',
  },
  marvelCredit: {
    marginTop: 30,
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  marvelLogo: {
    width: 100,
    height: 40,
    marginBottom: 10,
  },
  marvelCreditText: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'PoppinsRegular',
    textAlign: 'center',
  },
});

export default ProfileScreen;