import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  Animated,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as Font from 'expo-font';
import CharacterCard from './Card';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 24;

const publicKey = '2f1fd8ca50b11bb6eed11409974d9cfe';
const hash = 'd3ee58dc3fc006a3051b143c3eea0144';
const timestamp = 1;

// Custom Components
const SearchBar = ({ searchQuery, onChangeText, onClear, onSubmit }) => (
  <View style={styles.searchContainer}>
    <View style={styles.searchInputContainer}>
      <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search heroes..."
        placeholderTextColor="#666"
        value={searchQuery}
        onChangeText={onChangeText}
        autoCorrect={false}
        blurOnSubmit={false}
        autoCapitalize="none"
        returnKeyType="search"
        enablesReturnKeyAutomatically={true}
        onSubmitEditing={onSubmit}
      />
      {searchQuery !== '' && (
        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={onClear}
        >
          <Ionicons name="close-circle" size={20} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const Navbar = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'search', icon: 'search', label: 'Search' },
    { id: 'favorites', icon: 'heart', label: 'Favorites' },
    { id: 'profile', icon: 'person', label: 'Profile' },
  ];

  return (
    <View style={styles.navbar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={styles.tabButton}
          onPress={() => onTabPress(tab.id)}
        >
          <View style={[
            styles.tabContent,
            activeTab === tab.id && styles.activeTabContent
          ]}>
            <Animated.View style={[
              styles.iconContainer,
              activeTab === tab.id && styles.activeIconContainer
            ]}>
              <Ionicons
                name={activeTab === tab.id ? `${tab.icon}` : `${tab.icon}-outline`}
                size={24}
                color={activeTab === tab.id ? '#ED1D24' : '#666'}
              />
            </Animated.View>
            <Text style={[
              styles.tabLabel,
              activeTab === tab.id && styles.activeTabLabel
            ]}>
              {tab.label}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Main Screen Component
export default function MarvelScreen() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Poppins': require('./assets/fonts/Poppins-Regular.ttf'),
          'PoppinsRegular': require("./assets/fonts/Poppins-Regular.ttf"),
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
      />
    );
  };

  if (loading && isInitialLoad) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ED1D24" />
        <Text style={styles.loadingText}>Loading Marvel Heroes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ED1D24" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
      case 'search':
        return (
          <>
            <SearchBar
              searchQuery={searchQuery}
              onChangeText={setSearchQuery}
              onClear={handleClearSearch}
              onSubmit={() => fetchMarvelCharacters(searchQuery)}
            />
            {loading && !isInitialLoad ? (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#ED1D24" />
              </View>
            ) : null}

            {characters.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No characters found</Text>
              </View>
            ) : (
              <FlatList
                data={characters}
                keyExtractor={(item) => item.id.toString()}
                keyboardShouldPersistTaps="always"
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={renderCharacterCard}
                showsVerticalScrollIndicator={false}
              />
            )}
          </>
        );
      case 'favorites':
        return (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={renderCharacterCard}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No favorites yet</Text>
              </View>
            }
          />
        );
      case 'profile':
        return (
          <View style={styles.profileContainer}>
            <Text style={styles.profileText}>Profile Screen Coming Soon</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>MARVEL</Text>
        </View>
        <Text style={styles.headerSubText}>Universe</Text>
      </View>
      
      {renderContent()}
      
      <Navbar 
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 60,
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
    marginBottom: 10,
  },
  headerTextContainer: {
    backgroundColor: '#ED1D24',
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '29%',
    marginBottom: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 49,
    fontFamily: 'MarvelRegular',
    letterSpacing: -1,
    textAlign: 'center',
    marginBottom: 3,
    marginTop: 1,
  },
  headerSubText: {
    color: '#333',
    fontSize: 18,
    fontFamily: 'Poppins',
    fontWeight: '500',
    marginTop: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: 'transparent',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#333',
    fontSize: 16,
    fontFamily: 'PoppinsRegular',
  },
  clearButton: {
    padding: 8,
  },
  listContainer: {
    padding: 12,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    padding: 8,
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    padding: 4,
    borderRadius: 20,
  },
  activeTabContent: {
    backgroundColor: '#FFEBEE',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
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
    fontFamily: 'Poppins',
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#ED1D24',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    color: '#333',
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  noResultsText: {
    color: '#333',
    fontSize: 16,
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  errorText: {
    color: '#ED1D24',
    fontSize: 16,
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  profileText: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
});