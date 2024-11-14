import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const userInfo = {
    name: "John Doe",
    email: "john.doe@email.com",
    joinDate: "January 2024",
    favoriteHeroes: 12,
    totalCollections: 3,
    preferences: {
      language: "English",
      notifications: "Enabled",
      theme: "Light Mode"
    }
  };

  const renderInfoItem = (label, value, icon) => (
    <View style={styles.infoItem}>
      <Ionicons name={icon} size={24} color="#666" style={styles.infoIcon} />
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  const renderSettingItem = (label, value, icon) => (
    <TouchableOpacity style={styles.settingItem}>
      <Ionicons name={icon} size={24} color="#666" style={styles.settingIcon} />
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        <View style={styles.settingValueContainer}>
          <Text style={styles.settingValue}>{value}</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('./assets/placeholder.png')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="camera" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{userInfo.name}</Text>
        <Text style={styles.email}>{userInfo.email}</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userInfo.favoriteHeroes}</Text>
          <Text style={styles.statLabel}>Favorite Heroes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userInfo.totalCollections}</Text>
          <Text style={styles.statLabel}>Collections</Text>
        </View>
      </View>

      {/* Account Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        {renderInfoItem("Member Since", userInfo.joinDate, "calendar-outline")}
        {renderInfoItem("Email Address", userInfo.email, "mail-outline")}
        {renderInfoItem("Account Type", "Standard", "person-outline")}
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        {renderSettingItem("Language", userInfo.preferences.language, "language-outline")}
        {renderSettingItem("Notifications", userInfo.preferences.notifications, "notifications-outline")}
        {renderSettingItem("Theme", userInfo.preferences.theme, "color-palette-outline")}
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        {renderSettingItem("Edit Profile", "", "create-outline")}
        {renderSettingItem("Change Password", "", "lock-closed-outline")}
        {renderSettingItem("Help & Support", "", "help-circle-outline")}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEEEEE',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#ED1D24',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'Poppins',
  },
  email: {
    fontSize: 16,
    color: '#666666',
    marginTop: 5,
    fontFamily: 'PoppinsRegular',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#EEEEEE',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ED1D24',
    fontFamily: 'Poppins',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
    fontFamily: 'PoppinsRegular',
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 15,
    fontFamily: 'Poppins',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoIcon: {
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'PoppinsRegular',
  },
  infoValue: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Poppins',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  settingIcon: {
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'PoppinsRegular',
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: '#666666',
    marginRight: 5,
    fontFamily: 'PoppinsRegular',
  },
  logoutButton: {
    backgroundColor: '#FFEBEE',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  logoutText: {
    color: '#ED1D24',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
});

export default ProfileScreen;