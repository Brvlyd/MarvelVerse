import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput,
  Platform,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './ThemeContext';

const { width } = Dimensions.get('window');
const SEARCH_HISTORY_KEY = '@search_history';
const MAX_HISTORY_ITEMS = 5;

const SearchBar = ({ searchQuery, onChangeText, onClear, onSubmit }) => {
  const { theme, fontSizes } = useTheme();
  return (
    <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
      <View style={[styles.searchInputContainer, { backgroundColor: theme.background }]}>
        <Ionicons name="search" size={20} color={theme.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { 
            color: theme.text,
            fontSize: fontSizes.md
          }]}
          placeholder="Search Marvel heroes..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={onChangeText}
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
        />
        {searchQuery !== '' && (
          <TouchableOpacity style={styles.clearButton} onPress={onClear}>
            <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const trendingSearches = [
  'Spider-Man', 
  'Iron Man', 
  'Thor', 
  'Hulk', 
  'Black Widow'
];

const popularCharacters = {
  'Spider-Man': ['Spider-Man', 'Spider-Man (Miles Morales)', 'Spider-Man (2099)', 'Spider-Man (Ultimate)'],
  'Iron Man': ['Iron Man', 'Iron Man (Ultimate)', 'Iron Lad', 'Iron Patriot'],
  'Thor': ['Thor', 'Thor Girl', 'Thor (Ultimate)', 'Beta Ray Bill'],
  'Hulk': ['Hulk', 'Hulk (Ultimate)', 'Red Hulk', 'She-Hulk'],
  'Black Widow': ['Black Widow', 'Black Widow (Ultimate)', 'Yelena Belova'],
  'Captain': ['Captain America', 'Captain Britain', 'Captain Marvel', 'Captain Marvel (Carol Danvers)'],
  'Doctor': ['Doctor Strange', 'Doctor Doom', 'Doctor Octopus', 'Doctor Spectrum'],
  'Black': ['Black Panther', 'Black Widow', 'Black Cat', 'Black Knight'],
};

const SearchScreen = ({ 
  searchQuery, 
  setSearchQuery, 
  handleClearSearch, 
  characters,
  loading,
  renderCharacterCard,
  handleSearch 
}) => {
  const { theme, fontSizes } = useTheme();
  const [searchHistory, setSearchHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    loadSearchHistory();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      updateSuggestions(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const addToSearchHistory = async (query) => {
    if (!query.trim()) return;

    try {
      const newHistory = [
        query,
        ...searchHistory.filter(item => item !== query)
      ].slice(0, MAX_HISTORY_ITEMS);

      setSearchHistory(newHistory);
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const removeFromHistory = async (itemToRemove) => {
    try {
      const newHistory = searchHistory.filter(item => item !== itemToRemove);
      setSearchHistory(newHistory);
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error removing from search history:', error);
    }
  };

  const clearSearchHistory = async () => {
    try {
      setSearchHistory([]);
      await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };

  const updateSuggestions = (query) => {
    query = query.toLowerCase();
    let newSuggestions = [];
    
    Object.entries(popularCharacters).forEach(([key, variants]) => {
      if (key.toLowerCase().includes(query)) {
        newSuggestions.push(...variants.filter(variant => 
          variant.toLowerCase().includes(query)
        ));
      }
    });
    
    setSuggestions([...new Set(newSuggestions)].slice(0, 5));
  };

  const handleSuggestionPress = async (suggestion) => {
    setSearchQuery(suggestion);
    await addToSearchHistory(suggestion);
    handleSearch(suggestion);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SearchBar
        searchQuery={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          if (text === '') {
            handleClearSearch();
          }
        }}
        onClear={handleClearSearch}
        onSubmit={async () => {
          if (searchQuery.trim()) {
            await addToSearchHistory(searchQuery.trim());
            handleSearch(searchQuery);
          }
        }}
      />
      
      {searchQuery === '' ? (
        <ScrollView 
          style={styles.searchSuggestions}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.trendingSection}>
            <Text style={[styles.sectionTitle, { color: theme.text, fontSize: fontSizes.lg }]}>
              Trending Now
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingContainer}
            >
              {trendingSearches.map((search, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[styles.trendingItem, { backgroundColor: theme.surface }]}
                  onPress={() => handleSuggestionPress(search)}
                >
                  <View style={styles.trendingNumber}>
                    <Text style={[styles.trendingNumberText, { fontSize: fontSizes.sm }]}>
                      {index + 1}
                    </Text>
                  </View>
                  <Text style={[styles.trendingText, { 
                    color: theme.text,
                    fontSize: fontSizes.sm 
                  }]}>{search}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {searchHistory.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.text, fontSize: fontSizes.lg }]}>
                  Recent Searches
                </Text>
                <TouchableOpacity onPress={clearSearchHistory}>
                  <Text style={[styles.clearAllText, { fontSize: fontSizes.sm }]}>Clear All</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.recentSearches, { backgroundColor: theme.surface }]}>
                {searchHistory.map((search, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={[styles.recentSearchItem, { borderBottomColor: theme.border }]}
                    onPress={() => handleSuggestionPress(search)}
                  >
                    <View style={styles.recentSearchLeft}>
                      <Ionicons name="time-outline" size={20} color={theme.textSecondary} />
                      <Text style={[styles.recentSearchText, { 
                        color: theme.text,
                        fontSize: fontSizes.sm 
                      }]}>{search}</Text>
                    </View>
                    <TouchableOpacity onPress={() => removeFromHistory(search)}>
                      <Ionicons name="close-outline" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      ) : (
        <>
          {suggestions.length > 0 && !loading && (
            <View style={[styles.suggestionsContainer, { backgroundColor: theme.surface }]}>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.suggestionItem, { borderBottomColor: theme.border }]}
                  onPress={() => handleSuggestionPress(suggestion)}
                >
                  <Ionicons name="search-outline" size={20} color={theme.textSecondary} />
                  <Text style={[styles.suggestionText, { 
                    color: theme.text,
                    fontSize: fontSizes.sm 
                  }]}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {loading ? (
            <View style={[styles.loadingOverlay, { backgroundColor: theme.background }]}>
              <ActivityIndicator size="large" color="#ED1D24" />
            </View>
          ) : (
            <FlatList
              data={characters}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              contentContainerStyle={styles.searchResults}
              columnWrapperStyle={styles.columnWrapper}
              renderItem={renderCharacterCard}
              ListEmptyComponent={
                <View style={styles.noResultsContainer}>
                  <Ionicons name="search-outline" size={48} color={theme.textSecondary} />
                  <Text style={[styles.noResultsText, { 
                    color: theme.text,
                    fontSize: fontSizes.lg 
                  }]}>No characters found</Text>
                  <Text style={[styles.noResultsSubText, { 
                    color: theme.textSecondary,
                    fontSize: fontSizes.sm 
                  }]}>
                    Try adjusting your search to find what you're looking for.
                  </Text>
                </View>
              }
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 15,
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
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'PoppinsRegular',
  },
  clearButton: {
    padding: 8,
  },
  searchSuggestions: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontWeight: '600',
    fontFamily: 'Poppins',
    marginBottom: 15,
  },
  clearAllText: {
    color: '#ED1D24',
    fontFamily: 'PoppinsRegular',
  },
  trendingSection: {
    marginBottom: 25,
  },
  trendingContainer: {
    paddingRight: 20,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    minWidth: width * 0.4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  trendingNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ED1D24',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  trendingNumberText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  trendingText: {
    fontFamily: 'PoppinsRegular',
  },
  recentSearches: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
  },
  recentSearchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recentSearchText: {
    fontFamily: 'PoppinsRegular',
    marginLeft: 10,
    flex: 1,
  },
  suggestionsContainer: {
    borderRadius: 15,
    margin: 15,
    marginTop: 0,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontFamily: 'PoppinsRegular',
    marginLeft: 15,
  },
  searchResults: {
    padding: 15,
    paddingBottom: Platform.OS === 'ios' ? 90 : 80,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  noResultsText: {
    fontWeight: '600',
    fontFamily: 'Poppins',
    marginTop: 15,
  },
  noResultsSubText: {
    fontFamily: 'PoppinsRegular',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default SearchScreen;