import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import CharacterCard from './Card';
import ProfileScreen from './ProfileScreen';
import DetailScreen from './DetailScreen';
import SearchScreen from './SearchScreen';
import { NotificationModal } from './modals';

const { width } = Dimensions.get('window');

const publicKey = '2f1fd8ca50b11bb6eed11409974d9cfe';
const hash = 'd3ee58dc3fc006a3051b143c3eea0144';
const timestamp = 1;

// Categories for Home screen
const categories = [
  { id: 'popular', name: 'Popular', icon: 'star' },
  { id: 'avengers', name: 'Avengers', icon: 'shield' },
  { id: 'xmen', name: 'X-Men', icon: 'flash' },
  { id: 'villains', name: 'Villains', icon: 'skull' },
];

// Featured heroes for Home screen carousel
const featuredHeroes = [
  { 
    id: 1, 
    name: 'Iron Man', 
    type: 'Avenger',
    image: require('./assets/ironman.jpeg')
  },
  { 
    id: 2, 
    name: 'Spider-Man', 
    type: 'Street Level', 
    image: require('./assets/spider-man.jpeg')
  },
  { 
    id: 3, 
    name: 'Thor', 
    type: 'Cosmic',
    image: require('./assets/thor.jpeg')
  },
];

export default function MarvelScreen() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [favorites, setFavorites] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Poppins': require('./assets/fonts/Poppins-Regular.ttf'),
          'PoppinsRegular': require('./assets/fonts/Poppins-Regular.ttf'),
          'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
          'MarvelRegular': require('./assets/fonts/Marvel-Regular.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontsLoaded(true);
      }
    }
    loadFonts();
  }, []);

  useEffect(() => {
    fetchMarvelCharacters('');
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      const timeoutId = setTimeout(() => {
        fetchMarvelCharacters(searchQuery);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery]);

  const fetchMarvelCharacters = async (query) => {
    try {
      setLoading(true);
      setError(null);
      let url = `https://gateway.marvel.com/v1/public/characters?ts=${timestamp}&apikey=${publicKey}&hash=${hash}&limit=50`;
      
      if (query) {
        url += `&nameStartsWith=${encodeURIComponent(query)}`;
      }

      const response = await axios.get(url);
      setCharacters(response.data.data.results);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching Marvel characters:', err);
      setError('Failed to load Marvel characters');
      setLoading(false);
    }
  };

  const toggleFavorite = (character) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(fav => fav.id === character.id);
      if (isFavorite) {
        return prevFavorites.filter(fav => fav.id !== character.id);
      } else {
        return [...prevFavorites, character];
      }
    });
  };

  const handleCharacterPress = (character) => {
    setSelectedCharacter(character);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchMarvelCharacters('');
  };

  const renderCharacterCard = ({ item }) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);
    return (
      <CharacterCard
        item={item}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
        onPress={handleCharacterPress}
      />
    );
  };

  const HomeHeader = () => (
    <View style={styles.homeHeader}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome Back!</Text>
        <Text style={styles.dateText}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.notificationButton}
        onPress={() => setShowNotifications(true)}
      >
        <Ionicons name="notifications-outline" size={24} color="#333" />
        <View style={styles.notificationBadge} />
      </TouchableOpacity>
    </View>
  );

  const CategoryList = () => (
    <View style={styles.categorySection}>
      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity 
            key={category.id} 
            style={styles.categoryCard}
          >
            <View style={styles.categoryIcon}>
              <Ionicons name={category.icon} size={24} color="#ED1D24" />
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const FeaturedCarousel = () => (
    <View style={styles.featuredSection}>
      <Text style={styles.sectionTitle}>Featured Heroes</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuredContainer}
      >
        {featuredHeroes.map((hero) => (
          <View key={hero.id} style={styles.featuredCard}>
            <Image
              source={hero.image}  // Changed this line
              style={styles.featuredImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.featuredGradient}
            />
            <View style={styles.featuredInfo}>
              <Text style={styles.featuredName}>{hero.name}</Text>
              <Text style={styles.featuredType}>{hero.type}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const HomeScreen = ({ characters, renderCharacterCard }) => (
    <ScrollView 
      style={styles.homeScreen} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.homeContent, styles.screenPadding]}
    >
      <HomeHeader />
      <CategoryList />
      <FeaturedCarousel />
      
      <View style={styles.trendingSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Heroes</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllButton}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.trendingGrid}>
          {characters.slice(0, 6).map((item) => (
            <View key={item.id} style={styles.trendingGridItem}>
              {renderCharacterCard({ item })}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ED1D24" />
      </View>
    );
  }

  const renderContent = () => {
    if (selectedCharacter) {
      return (
        <DetailScreen
          character={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
          isFavorite={favorites.some(fav => fav.id === selectedCharacter.id)}
          onToggleFavorite={toggleFavorite}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <View style={styles.screenContainer}>
            <HomeScreen 
              characters={characters}
              renderCharacterCard={renderCharacterCard}
            />
          </View>
        );
      case 'search':
        return (
          <View style={styles.screenContainer}>
            <SearchScreen
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleClearSearch={handleClearSearch}
              characters={characters}
              loading={loading}
              renderCharacterCard={renderCharacterCard}
              handleSearch={fetchMarvelCharacters}
            />
          </View>
        );
      case 'favorites':
        return (
          <View style={styles.screenContainer}>
            <FlatList
              data={favorites}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              contentContainerStyle={[styles.listContainer, styles.screenPadding]}
              columnWrapperStyle={styles.columnWrapper}
              renderItem={renderCharacterCard}
              ListEmptyComponent={
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No favorites yet</Text>
                </View>
              }
            />
          </View>
        );
      case 'profile':
        return (
          <View style={styles.screenContainer}>
            <ScrollView 
              contentContainerStyle={styles.screenPadding}
              showsVerticalScrollIndicator={false}
            >
              <ProfileScreen />
            </ScrollView>
          </View>
        );
      default:
        return null;
    }
  };

  // Helper function to get the correct icon name for navigation tabs
  const getIconName = (tabName) => {
    const icons = {
      home: activeTab === tabName ? 'home' : 'home-outline',
      search: activeTab === tabName ? 'search' : 'search-outline',
      favorites: activeTab === tabName ? 'heart' : 'heart-outline',
      profile: activeTab === tabName ? 'person' : 'person-outline'
    };
    return icons[tabName];
  };

  return (
    <SafeAreaView style={styles.container}>
      {!selectedCharacter && (
        <View style={styles.headerContainer}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>MARVEL</Text>
          </View>
          <Text style={styles.headerSubText}>Universe</Text>
        </View>
      )}
      
      {renderContent()}
      
      {!selectedCharacter && (
        <View style={styles.navbar}>
          {['home', 'search', 'favorites', 'profile'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabButton}
              onPress={() => setActiveTab(tab)}
            >
              <View style={[
                styles.tabContent,
                activeTab === tab && styles.activeTabContent
              ]}>
                <View style={[
                  styles.iconContainer,
                  activeTab === tab && styles.activeIconContainer
                ]}>
                  <Ionicons
                    name={getIconName(tab)}
                    size={24}
                    color={activeTab === tab ? '#ED1D24' : '#666'}
                  />
                </View>
                <Text style={[
                  styles.tabLabel,
                  activeTab === tab && styles.activeTabLabel
                ]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <NotificationModal 
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... Styles tetap sama seperti sebelumnya ...
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  screenContainer: {
    flex: 1,
  },
  screenPadding: {
    paddingBottom: Platform.OS === 'ios' ? 90 : 80,
  },
  headerContainer: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTextContainer: {
    backgroundColor: '#ED1D24',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 3,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 60,
    fontFamily: 'MarvelRegular',
    letterSpacing: -1,
  },
  headerSubText: {
    color: '#333',
    fontSize: 20,
    fontFamily: 'Poppins',
    marginTop: 0,
  },
  homeScreen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  homeContent: {
    paddingBottom: Platform.OS === 'ios' ? 90 : 80,
  },
  homeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
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
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    fontFamily: 'Poppins',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'PoppinsRegular',
    marginTop: 4,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ED1D24',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  categorySection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    fontFamily: 'Poppins',
    marginBottom: 15,
  },
  categoryContainer: {
    paddingVertical: 10,
  },
  categoryCard: {
    width: 100,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 15,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'PoppinsRegular',
    textAlign: 'center',
  },
  featuredSection: {
    padding: 20,
  },
  featuredContainer: {
    paddingVertical: 10,
  },
  featuredCard: {
    width: width * 0.7,
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 15,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  featuredInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  featuredName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Poppins',
    fontWeight: '700',
  },
  featuredType: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'PoppinsRegular',
    opacity: 0.8,
  },
  trendingSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllButton: {
    color: '#ED1D24',
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  trendingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  trendingGridItem: {
    width: '48%',
    marginBottom: 15,
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    padding: 4,
  },
  activeTabContent: {
    backgroundColor: '#FFEBEE',
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  activeIconContainer: {
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'PoppinsRegular',
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#ED1D24',
    fontFamily: 'Poppins',
  },
  listContainer: {
    padding: 15,
    paddingBottom: Platform.OS === 'ios' ? 90 : 80,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'PoppinsRegular',
    textAlign: 'center',
  },
});