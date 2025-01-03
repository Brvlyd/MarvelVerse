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
import CategoryScreen from './CategoryScreen';
import { NotificationModal } from './modals';
import { useTheme } from './ThemeContext';

const { width } = Dimensions.get('window');

const publicKey = '2f1fd8ca50b11bb6eed11409974d9cfe';
const hash = 'd3ee58dc3fc006a3051b143c3eea0144';
const timestamp = 1;

const categories = [
  { id: 'popular', name: 'Popular', icon: 'star', description: 'The most beloved characters in the Marvel Universe' },
  { id: 'avengers', name: 'Avengers', icon: 'shield', description: 'Earth\'s Mightiest Heroes, united against common threats' },
  { id: 'xmen', name: 'X-Men', icon: 'flash', description: 'Mutant heroes fighting for peaceful coexistence' },
  { id: 'villains', name: 'Villains', icon: 'skull', description: 'The greatest threats to the Marvel Universe' },
];

const featuredHeroes = [
  { 
    id: 1009368,
    name: 'Iron Man', 
    type: 'Avenger',
    description: 'Genius inventor Tony Stark creates high-tech armor to become Iron Man, Earth\'s greatest defender.',
    image: require('./assets/ironman.jpeg'),
    thumbnail: {
      path: 'http://i.annihil.us/u/prod/marvel/i/mg/9/c0/527bb7b37ff55',
      extension: 'jpg'
    },
    comics: {
      items: [
        { name: 'Iron Man: Extremis' },
        { name: 'Civil War' },
        { name: 'Invincible Iron Man' }
      ]
    },
    series: {
      items: [
        { name: 'Iron Man (2020)' },
        { name: 'Avengers' },
        { name: 'Tony Stark: Iron Man' }
      ]
    },
    stories: {
      items: [
        { name: 'Origin of Iron Man' },
        { name: 'The Armor Wars' },
        { name: 'Demon in a Bottle' }
      ]
    },
    urls: [
      { type: 'detail', url: 'http://marvel.com/characters/29/iron_man' },
      { type: 'wiki', url: 'http://marvel.com/universe/Iron_Man' }
    ]
  },
  { 
    id: 1009610,
    name: 'Spider-Man', 
    type: 'Street Level',
    description: 'Bitten by a radioactive spider, Peter Parker fights crime with spider-like abilities as Spider-Man.',
    image: require('./assets/spider-man.jpeg'),
    thumbnail: {
      path: 'http://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b',
      extension: 'jpg'
    },
    comics: {
      items: [
        { name: 'Amazing Spider-Man' },
        { name: 'Ultimate Spider-Man' },
        { name: 'Spectacular Spider-Man' }
      ]
    },
    series: {
      items: [
        { name: 'Spider-Man (2022)' },
        { name: 'Friendly Neighborhood Spider-Man' },
        { name: 'Web of Spider-Man' }
      ]
    },
    stories: {
      items: [
        { name: 'With Great Power' },
        { name: 'The Night Gwen Stacy Died' },
        { name: 'Kraven\'s Last Hunt' }
      ]
    },
    urls: [
      { type: 'detail', url: 'http://marvel.com/characters/54/spider-man' },
      { type: 'wiki', url: 'http://marvel.com/universe/Spider-Man_(Peter_Parker)' }
    ]
  },
  { 
    id: 1009664,
    name: 'Thor', 
    type: 'Cosmic',
    description: 'Thor Odinson wields his mighty hammer Mjolnir as the God of Thunder and protector of both Asgard and Earth.',
    image: require('./assets/thor.jpeg'),
    thumbnail: {
      path: 'http://i.annihil.us/u/prod/marvel/i/mg/d/d0/5269657a74350',
      extension: 'jpg'
    },
    comics: {
      items: [
        { name: 'Thor: God of Thunder' },
        { name: 'Journey into Mystery' },
        { name: 'The Mighty Thor' }
      ]
    },
    series: {
      items: [
        { name: 'Thor (2020)' },
        { name: 'War of the Realms' },
        { name: 'Asgardians of the Galaxy' }
      ]
    },
    stories: {
      items: [
        { name: 'Tales of Asgard' },
        { name: 'God Butcher Saga' },
        { name: 'Ragnarok' }
      ]
    },
    urls: [
      { type: 'detail', url: 'http://marvel.com/characters/60/thor' },
      { type: 'wiki', url: 'http://marvel.com/universe/Thor' }
    ]
  }
];

export default function MarvelScreen({ onLogout }) {
  const { theme, fontSizes } = useTheme();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [favorites, setFavorites] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
    <View style={[styles.homeHeader, { backgroundColor: theme.surface }]}>
      <View style={styles.welcomeContainer}>
        <Text style={[styles.welcomeText, { color: theme.text, fontSize: fontSizes.lg }]}>
          Welcome Back!
        </Text>
        <Text style={[styles.dateText, { color: theme.textSecondary, fontSize: fontSizes.sm }]}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>
      <TouchableOpacity 
        style={[styles.notificationButton, { backgroundColor: theme.background }]}
        onPress={() => setShowNotifications(true)}
      >
        <Ionicons name="notifications-outline" size={24} color={theme.text} />
        <View style={styles.notificationBadge} />
      </TouchableOpacity>
    </View>
  );

  const CategoryList = () => (
    <View style={styles.categorySection}>
      <Text style={[styles.sectionTitle, { color: theme.text, fontSize: fontSizes.lg }]}>
        Categories
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity 
            key={category.id} 
            style={[styles.categoryCard, { backgroundColor: theme.surface }]}
            onPress={() => setSelectedCategory(category)}
          >
            <View style={[styles.categoryIcon, { backgroundColor: theme.background }]}>
              <Ionicons name={category.icon} size={24} color="#ED1D24" />
            </View>
            <Text style={[styles.categoryName, { 
              color: theme.text,
              fontSize: fontSizes.sm 
            }]}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const FeaturedCarousel = () => {
    const handleFeaturePress = (hero) => {
      setSelectedCharacter(hero);
    };

    return (
      <View style={styles.featuredSection}>
        <Text style={[styles.sectionTitle, { color: theme.text, fontSize: fontSizes.lg }]}>
          Featured Heroes
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredContainer}
        >
          {featuredHeroes.map((hero) => (
            <TouchableOpacity
              key={hero.id}
              style={[styles.featuredCard, { backgroundColor: theme.surface }]}
              onPress={() => handleFeaturePress(hero)}
              activeOpacity={0.7}
            >
              <Image
                source={hero.image}
                style={styles.featuredImage}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.featuredGradient}
              />
              <View style={styles.featuredInfo}>
                <Text style={[styles.featuredName, { 
                  color: '#FFFFFF',
                  fontSize: fontSizes.md 
                }]}>{hero.name}</Text>
                <Text style={[styles.featuredType, { 
                  color: '#FFFFFF',
                  fontSize: fontSizes.sm 
                }]}>{hero.type}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const HomeScreen = ({ characters, renderCharacterCard }) => (
    <ScrollView 
      style={[styles.homeScreen, { backgroundColor: theme.background }]} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.homeContent, styles.screenPadding]}
    >
      <HomeHeader />
      <CategoryList />
      <FeaturedCarousel />
      
      <View style={styles.trendingSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { 
            color: theme.text,
            fontSize: fontSizes.lg 
          }]}>Trending Heroes</Text>
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

    if (selectedCategory) {
      return (
        <CategoryScreen
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
          onCharacterPress={handleCharacterPress}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      );
    }


    switch (activeTab) {
      case 'home':
        return (
          <View style={[styles.screenContainer, { backgroundColor: theme.background }]}>
            <HomeScreen 
              characters={characters}
              renderCharacterCard={renderCharacterCard}
            />
          </View>
        );
      case 'search':
        return (
          <View style={[styles.screenContainer, { backgroundColor: theme.background }]}>
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
          <View style={[styles.screenContainer, { backgroundColor: theme.background }]}>
            <FlatList
              data={favorites}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              contentContainerStyle={[styles.listContainer, styles.screenPadding]}
              columnWrapperStyle={styles.columnWrapper}
              renderItem={renderCharacterCard}
              ListEmptyComponent={
                <View style={styles.noResultsContainer}>
                  <Text style={[styles.noResultsText, { 
                    color: theme.text,
                    fontSize: fontSizes.md 
                  }]}>No favorites yet</Text>
                </View>
              }
            />
          </View>
        );
      case 'profile':
        return (
          <View style={[styles.screenContainer, { backgroundColor: theme.background }]}>
            <ScrollView 
              contentContainerStyle={styles.screenPadding}
              showsVerticalScrollIndicator={false}
            >
            <ProfileScreen 
              favoriteCount={favorites.length} 
              onLogout={onLogout}
            />
            </ScrollView>
          </View>
        );
      default:
        return null;
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#ED1D24" />
      </View>
    );
  }

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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {!selectedCharacter && !selectedCategory && (
        <View style={[styles.headerContainer, { backgroundColor: theme.surface }]}>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.headerText, { fontSize: fontSizes.xxl }]}>MARVEL</Text>
          </View>
          <Text style={[styles.headerSubText, { 
            color: theme.text,
            fontSize: fontSizes.lg 
          }]}>Universe</Text>
        </View>
      )}
      
      {renderContent()}
      
      {!selectedCharacter && !selectedCategory && (
        <View style={[styles.navbar, { backgroundColor: theme.surface }]}>
          {['home', 'search', 'favorites', 'profile'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabButton}
              onPress={() => setActiveTab(tab)}
            >
              <View style={[
                styles.tabContent,
                activeTab === tab && [
                  styles.activeTabContent,
                  { backgroundColor: theme.background }
                ]
              ]}>
                <View style={[
                  styles.iconContainer,
                  activeTab === tab && styles.activeIconContainer,
                  { backgroundColor: activeTab === tab ? theme.surface : 'transparent' }
                ]}>
                  <Ionicons
                    name={getIconName(tab)}
                    size={24}
                    color={activeTab === tab ? '#ED1D24' : theme.textSecondary}
                  />
                </View>
                <Text style={[
                  styles.tabLabel,
                  { color: theme.textSecondary },
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
  container: {
    flex: 1,
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
    fontFamily: 'MarvelRegular',
    letterSpacing: -1,
  },
  headerSubText: {
    fontFamily: 'Poppins',
    marginTop: 0,
  },
  homeScreen: {
    flex: 1,
  },
  homeContent: {
    paddingBottom: Platform.OS === 'ios' ? 90 : 80,
  },
  homeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
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
    fontWeight: '700',
    fontFamily: 'Poppins',
  },
  dateText: {
    fontFamily: 'PoppinsRegular',
    marginTop: 4,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontWeight: '700',
    fontFamily: 'Poppins',
    marginBottom: 15,
  },
  categoryContainer: {
    paddingVertical: 10,
  },
  categoryCard: {
    width: 100,
    height: 100,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
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
    fontFamily: 'Poppins',
    fontWeight: '700',
  },
  featuredType: {
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
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  noResultsText: {
    fontSize: 16,
    fontFamily: 'PoppinsRegular',
    textAlign: 'center',
  },
});