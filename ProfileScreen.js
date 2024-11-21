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
import { useTheme } from './ThemeContext';

const STORAGE_KEYS = {
  USER_INFO: '@user_info',
  SETTINGS: '@settings',
  NOTIFICATIONS: '@notifications'
};

const MODAL_POSITIONS = {
  BOTTOM: 'bottom'
};

const MenuItem = ({ title, icon, onPress, theme, fontSizes }) => (
  <TouchableOpacity 
    style={[styles.menuItem, { backgroundColor: theme.surface }]} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.menuIconContainer, { backgroundColor: theme.background }]}>
      <Ionicons name={icon} size={22} color={theme.textSecondary} />
    </View>
    <Text style={[styles.menuText, { 
      color: theme.text,
      fontSize: fontSizes.md 
    }]}>{title}</Text>
    <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
  </TouchableOpacity>
);

const ProfileScreen = ({ favoriteCount = 0 }) => {
  const { theme, fontSizes, isDarkMode, fontSize, toggleDarkMode, changeFontSize } = useTheme();
  
  const [userInfo, setUserInfo] = useState({
    name: "Bravely Dirgayuska",
    email: "bravelydirgayuska@gmail.com",
    favoriteHeroes: favoriteCount,
  });

  const [editedName, setEditedName] = useState(userInfo.name);
  const [editedEmail, setEditedEmail] = useState(userInfo.email);
  const [activeModal, setActiveModal] = useState(null);
  const [notifications, setNotifications] = useState({
    pushEnabled: true,
    emailEnabled: false,
    newHeroes: true,
    updates: true,
    newsletters: false
  });

  const handleNotificationToggle = useCallback((key) => {
    setNotifications(prev => {
      const newSettings = {
        ...prev,
        [key]: !prev[key]
      };
      
      try {
        AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(newSettings));
      } catch (error) {
        console.error('Error saving notification settings:', error);
      }
      
      return newSettings;
    });
  }, []);

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
        favoriteHeroes: favoriteCount
      }));
    } catch (error) {
      console.error('Error saving user info:', error);
    }
  }, [editedName, editedEmail, favoriteCount]);

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
                STORAGE_KEYS.SETTINGS,
                STORAGE_KEYS.NOTIFICATIONS
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
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
      bounces={true}
    >
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <View style={styles.profileContainer}>
          <Image
            source={require('./assets/profile.jpg')}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.name, { 
              color: theme.text,
              fontSize: fontSizes.lg 
            }]}>{userInfo.name}</Text>
            <Text style={[styles.email, { 
              color: theme.textSecondary,
              fontSize: fontSizes.sm 
            }]}>{userInfo.email}</Text>
          </View>
        </View>
        <View style={[styles.statsContainer, { backgroundColor: theme.background }]}>
          <Ionicons name="heart" size={20} color="#ED1D24" />
          <Text style={[styles.statsText, { 
            color: theme.text,
            fontSize: fontSizes.sm 
          }]}>
            {userInfo.favoriteHeroes} Favorite Heroes
          </Text>
        </View>
      </View>

      <View style={[styles.menuContainer, { backgroundColor: theme.surface }]}>
        {menuItems.map((item) => (
          <MenuItem 
            key={item.id} 
            title={item.title} 
            icon={item.icon}
            onPress={item.onPress}
            theme={theme}
            fontSizes={fontSizes}
          />
        ))}
      </View>

      <TouchableOpacity 
        style={[styles.logoutButton, { backgroundColor: '#FFEBEE' }]}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out-outline" size={22} color="#ED1D24" />
        <Text style={[styles.logoutText, { fontSize: fontSizes.md }]}>Log Out</Text>
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
        <View style={[styles.modalForm, { backgroundColor: theme.surface }]}>
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { 
              color: theme.textSecondary,
              fontSize: fontSizes.sm 
            }]}>Name</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.background,
                color: theme.text,
                fontSize: fontSizes.md 
              }]}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter your name"
              placeholderTextColor={theme.textSecondary}
              maxLength={50}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { 
              color: theme.textSecondary,
              fontSize: fontSizes.sm 
            }]}>Email</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.background,
                color: theme.text,
                fontSize: fontSizes.md 
              }]}
              value={editedEmail}
              onChangeText={setEditedEmail}
              placeholder="Enter your email"
              placeholderTextColor={theme.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleUpdateProfile}
          >
            <Text style={[styles.submitButtonText, { fontSize: fontSizes.md }]}>
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </BaseModal>

      <BaseModal
        visible={activeModal === 'notifications'}
        onClose={() => setActiveModal(null)}
        position={MODAL_POSITIONS.BOTTOM}
        title="Notifications"
      >
        <View style={[styles.modalForm, { backgroundColor: theme.surface }]}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { 
                color: theme.text,
                fontSize: fontSizes.md 
              }]}>Push Notifications</Text>
              <Text style={[styles.settingDescription, { 
                color: theme.textSecondary,
                fontSize: fontSizes.sm 
              }]}>
                Receive push notifications on your device
              </Text>
            </View>
            <Switch
              value={notifications.pushEnabled}
              onValueChange={() => handleNotificationToggle('pushEnabled')}
              trackColor={{ false: "#767577", true: "#ED1D24" }}
              thumbColor={Platform.OS === 'ios' ? "#FFFFFF" : 
                notifications.pushEnabled ? "#FFFFFF" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { 
                color: theme.text,
                fontSize: fontSizes.md 
              }]}>Email Notifications</Text>
              <Text style={[styles.settingDescription, { 
                color: theme.textSecondary,
                fontSize: fontSizes.sm 
              }]}>
                Receive notifications via email
              </Text>
            </View>
            <Switch
              value={notifications.emailEnabled}
              onValueChange={() => handleNotificationToggle('emailEnabled')}
              trackColor={{ false: "#767577", true: "#ED1D24" }}
              thumbColor={Platform.OS === 'ios' ? "#FFFFFF" : 
                notifications.emailEnabled ? "#FFFFFF" : "#f4f3f4"}
            />
          </View>

          <View style={styles.notificationTypes}>
            <Text style={[styles.sectionTitle, { 
              color: theme.text,
              fontSize: fontSizes.md,
              marginBottom: 15
            }]}>Notification Types</Text>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { 
                  color: theme.text,
                  fontSize: fontSizes.md 
                }]}>New Heroes</Text>
                <Text style={[styles.settingDescription, { 
                  color: theme.textSecondary,
                  fontSize: fontSizes.sm 
                }]}>
                  When new heroes are added
                </Text>
              </View>
              <Switch
                value={notifications.newHeroes}
                onValueChange={() => handleNotificationToggle('newHeroes')}
                trackColor={{ false: "#767577", true: "#ED1D24" }}
                thumbColor={Platform.OS === 'ios' ? "#FFFFFF" : 
                  notifications.newHeroes ? "#FFFFFF" : "#f4f3f4"}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { 
                  color: theme.text,
                  fontSize: fontSizes.md 
                }]}>Updates</Text>
                <Text style={[styles.settingDescription, { 
                  color: theme.textSecondary,
                  fontSize: fontSizes.sm 
                }]}>
                  App updates and improvements
                </Text>
              </View>
              <Switch
                value={notifications.updates}
                onValueChange={() => handleNotificationToggle('updates')}
                trackColor={{ false: "#767577", true: "#ED1D24" }}
                thumbColor={Platform.OS === 'ios' ? "#FFFFFF" : 
                  notifications.updates ? "#FFFFFF" : "#f4f3f4"}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { 
                  color: theme.text,
                  fontSize: fontSizes.md 
                }]}>Newsletters</Text>
                <Text style={[styles.settingDescription, { 
                  color: theme.textSecondary,
                  fontSize: fontSizes.sm 
                }]}>
                  Marvel news and updates
                </Text>
              </View>
              <Switch
                value={notifications.newsletters}
                onValueChange={() => handleNotificationToggle('newsletters')}
                trackColor={{ false: "#767577", true: "#ED1D24" }}
                thumbColor={Platform.OS === 'ios' ? "#FFFFFF" : 
                  notifications.newsletters ? "#FFFFFF" : "#f4f3f4"}
              />
            </View>
          </View>
        </View>
      </BaseModal>

      <BaseModal
        visible={activeModal === 'appearance'}
        onClose={() => setActiveModal(null)}
        position={MODAL_POSITIONS.BOTTOM}
        title="Appearance"
      >
        <View style={[styles.modalForm, { backgroundColor: theme.surface }]}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { 
                color: theme.text,
                fontSize: fontSizes.md 
              }]}>Dark Mode</Text>
              <Text style={[styles.settingDescription, { 
                color: theme.textSecondary,
                fontSize: fontSizes.sm 
              }]}>
                Switch between light and dark theme
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: "#767577", true: "#ED1D24" }}
              thumbColor={Platform.OS === 'ios' ? "#FFFFFF" : 
                isDarkMode ? "#FFFFFF" : "#f4f3f4"}
            />
          </View>
          <View style={styles.fontSizeSelector}>
            <Text style={[styles.settingTitle, { 
              color: theme.text,
              fontSize: fontSizes.md 
            }]}>Font Size</Text>
            <View style={styles.fontSizeOptions}>
              {['small', 'medium', 'large'].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.fontSizeOption,
                    { backgroundColor: theme.background },
                    fontSize === size && styles.selectedFontSize
                  ]}
                  onPress={() => changeFontSize(size)}
                >
                  <Text style={[
                    styles.fontSizeText,
                    { color: theme.text },
                    fontSize === size && styles.selectedFontSizeText
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
        <View style={[styles.modalForm, { backgroundColor: theme.surface }]}>
          <TouchableOpacity 
            style={[styles.helpItem, { borderBottomColor: theme.border }]}
            onPress={() => handleLinkPress('https://developer.marvel.com/documentation/getting_started')}
          >
            <Ionicons name="book-outline" size={24} color={theme.text} />
            <View style={styles.helpItemContent}>
              <Text style={[styles.helpItemTitle, { 
                color: theme.text,
                fontSize: fontSizes.md 
              }]}>Documentation</Text>
              <Text style={[styles.helpItemDescription, { 
                color: theme.textSecondary,
                fontSize: fontSizes.sm 
              }]}>Learn how to use Marvel API</Text>
            </View>
            <Ionicons name="open-outline" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.marvelCredit, { borderTopColor: theme.border }]}>
            <Image
              source={require('./assets/placeholder.png')}
              style={styles.marvelLogo}
              resizeMode="contain"
            />
            <Text style={[styles.marvelCreditText, { 
              color: theme.textSecondary,
              fontSize: fontSizes.xs 
            }]}>
              Data provided by Marvel. © 2024 Bravely Co.
            </Text>
          </View>
        </View>
      </BaseModal>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {renderMainContent()}
      {renderModals()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  email: {
    fontFamily: 'PoppinsRegular',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  statsText: {
    fontFamily: 'PoppinsRegular',
    marginLeft: 8,
  },
  menuContainer: {
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontFamily: 'PoppinsRegular',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    padding: 15,
    borderRadius: 15,
    marginBottom: 30,
  },
  logoutText: {
    color: '#ED1D24',
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
    marginBottom: 8,
    fontFamily: 'PoppinsRegular',
  },
  input: {
    borderRadius: 12,
    padding: 12,
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
    fontFamily: 'PoppinsRegular',
    marginBottom: 4,
  },
  settingDescription: {
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
    alignItems: 'center',
  },
  selectedFontSize: {
    backgroundColor: '#ED1D24',
  },
  fontSizeText: {
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
  },
  helpItemContent: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
  },
  helpItemTitle: {
    fontFamily: 'PoppinsRegular',
    marginBottom: 4,
  },
  helpItemDescription: {
    fontFamily: 'PoppinsRegular',
  },
  marvelCredit: {
    marginTop: 30,
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
  },
  marvelLogo: {
    width: 100,
    height: 40,
    marginBottom: 10,
  },
  marvelCreditText: {
    fontFamily: 'PoppinsRegular',
    textAlign: 'center',
  },
  notificationTypes: {
    marginTop: 20,
  },
  sectionTitle: {
    fontFamily: 'PoppinsRegular',
    fontWeight: '600',
  }
});


export default ProfileScreen;