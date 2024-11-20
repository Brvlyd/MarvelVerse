import React from 'react';
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

const { width } = Dimensions.get('window');

const SearchBar = ({ searchQuery, onChangeText, onClear, onSubmit }) => (
  <View style={styles.searchContainer}>
    <View style={styles.searchInputContainer}>
      <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search Marvel heroes..."
        placeholderTextColor="#666"
        value={searchQuery}
        onChangeText={onChangeText}
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />
      {searchQuery !== '' && (
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <Ionicons name="close-circle" size={20} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

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

const popularSearches = [
  'Spider-Man', 
  'Iron Man', 
  'Thor', 
  'Hulk', 
  'Black Widow',
  'Captain Marvel',
  'Doctor Strange',
  'Black Panther'
];

const recentSearches = [
  'Captain America',
  'Black Panther',
  'Doctor Strange',
  'Wolverine',
  'Deadpool'
];

const SearchScreen = ({ 
  searchQuery, 
  setSearchQuery, 
  handleClearSearch, 
  characters,
  loading,
  renderCharacterCard,
  handleSearch 
}) => {
  const getSearchSuggestions = (query) => {
    if (!query) return [];
    
    query = query.toLowerCase();
    let suggestions = [];
    
    Object.entries(popularCharacters).forEach(([key, variants]) => {
      if (key.toLowerCase().startsWith(query)) {
        suggestions.push(...variants);
      }
    });
    
    Object.values(popularCharacters).flat().forEach(character => {
      if (character.toLowerCase().includes(query) && !suggestions.includes(character)) {
        suggestions.push(character);
      }
    });
    
    return [...new Set(suggestions)].slice(0, 5);
  };

  const handleSuggestionPress = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const suggestions = getSearchSuggestions(searchQuery);

  return (
    <View style={styles.container}>
      <SearchBar
        searchQuery={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          if (text === '') {
            handleClearSearch();
          }
        }}
        onClear={handleClearSearch}
        onSubmit={() => handleSearch(searchQuery)}
      />
      
      {searchQuery === '' ? (
        <ScrollView 
          style={styles.searchSuggestions}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.trendingSection}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingContainer}
            >
              {popularSearches.slice(0, 5).map((search, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.trendingItem}
                  onPress={() => handleSuggestionPress(search)}
                >
                  <View style={styles.trendingNumber}>
                    <Text style={styles.trendingNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.trendingText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Searches</Text>
            <View style={styles.popularTagsContainer}>
              {popularSearches.map((tag, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.popularTag}
                  onPress={() => handleSuggestionPress(tag)}
                >
                  <Text style={styles.popularTagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity>
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.recentSearches}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.recentSearchItem}
                  onPress={() => handleSuggestionPress(search)}
                >
                  <View style={styles.recentSearchLeft}>
                    <Ionicons name="time-outline" size={20} color="#666" />
                    <Text style={styles.recentSearchText}>{search}</Text>
                  </View>
                  <TouchableOpacity>
                    <Ionicons name="close-outline" size={20} color="#666" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        <>
          {suggestions.length > 0 && !loading && (
            <View style={styles.suggestionsContainer}>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionPress(suggestion)}
                >
                  <Ionicons name="search-outline" size={20} color="#666" />
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {loading ? (
            <View style={styles.loadingOverlay}>
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
                  <Ionicons name="search-outline" size={48} color="#666" />
                  <Text style={styles.noResultsText}>No characters found</Text>
                  <Text style={styles.noResultsSubText}>
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
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    padding: 15,
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
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Poppins',
    marginBottom: 15,
  },
  clearAllText: {
    fontSize: 14,
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
    backgroundColor: '#FFFFFF',
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
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  trendingText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'PoppinsRegular',
  },
  popularTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  popularTag: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  popularTagText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'PoppinsRegular',
  },
  recentSearches: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    overflow: 'hidden',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  recentSearchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recentSearchText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'PoppinsRegular',
    marginLeft: 10,
    flex: 1,
  },
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
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
    borderBottomColor: '#EEEEEE',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
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
    backgroundColor: 'rgba(255,255,255,0.9)',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Poppins',
    marginTop: 15,
  },
  noResultsSubText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'PoppinsRegular',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default SearchScreen;