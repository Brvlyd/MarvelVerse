import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const DetailScreen = ({ character, onClose, isFavorite, onToggleFavorite }) => {
  const handleURLPress = (url) => {
    Linking.openURL(url).catch((err) => console.error('Error opening URL:', err));
  };

  // Function to render comic/series/stories list
  const renderList = (items, title) => {
    if (!items || items.items.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        >
          {items.items.slice(0, 5).map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listItemText}>{item.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ 
              uri: `${character.thumbnail.path}.${character.thumbnail.extension}`
            }}
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
          
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          
          {/* Favorite Button */}
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => onToggleFavorite(character)}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={28}
              color={isFavorite ? '#ED1D24' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>

        {/* Character Info */}
        <View style={styles.contentContainer}>
          <Text style={styles.name}>{character.name}</Text>
          
          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {character.description || "No description available."}
            </Text>
          </View>

          {/* Comics */}
          {renderList(character.comics, 'Comics')}

          {/* Series */}
          {renderList(character.series, 'Series')}

          {/* Stories */}
          {renderList(character.stories, 'Stories')}

          {/* Links */}
          {character.urls && character.urls.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <View style={styles.linksContainer}>
                {character.urls.map((url, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.linkButton}
                    onPress={() => handleURLPress(url.url)}
                  >
                    <Text style={styles.linkText}>
                      {url.type.charAt(0).toUpperCase() + url.type.slice(1)}
                    </Text>
                    <Ionicons name="open-outline" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: height * 0.4,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 20,
    fontFamily: 'Poppins',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
    fontFamily: 'Poppins',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    fontFamily: 'PoppinsRegular',
  },
  listContainer: {
    paddingVertical: 8,
  },
  listItem: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  listItemText: {
    fontSize: 14,
    color: '#333333',
    fontFamily: 'PoppinsRegular',
  },
  linksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ED1D24',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 10,
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 8,
    fontFamily: 'PoppinsRegular',
  },
});

export default DetailScreen;