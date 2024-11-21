import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CharacterCard from './Card';
import { useTheme } from './ThemeContext';

const CategoryScreen = ({ category, onClose, onCharacterPress }) => {
  const { theme, fontSizes } = useTheme();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Predefined characters for each category with proper thumbnail data
  const categoryCharacters = {
    popular: [
      { 
        id: 1009220, 
        name: 'Captain America',
        description: 'Recipient of the Super-Soldier serum, Steve Rogers fights for American ideals as Captain America.',
        type: 'popular',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/3/50/537ba56d31087',
          extension: 'jpg'
        }
      },
      { 
        id: 1009368, 
        name: 'Iron Man',
        description: 'Genius inventor Tony Stark creates the Iron Man armor to protect the world as a hero.',
        type: 'popular',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/9/c0/527bb7b37ff55',
          extension: 'jpg'
        }
      },
      { 
        id: 1009664, 
        name: 'Thor',
        description: 'The Norse God of Thunder, Thor wields the mighty hammer Mjolnir in defense of both Asgard and Earth.',
        type: 'popular',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/d/d0/5269657a74350',
          extension: 'jpg'
        }
      },
      { 
        id: 1009652, 
        name: 'Spider-Man',
        description: 'Bitten by a radioactive spider, Peter Parker fights crime as the Amazing Spider-Man.',
        type: 'popular',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b',
          extension: 'jpg'
        }
      },
      { 
        id: 1009189, 
        name: 'Black Widow',
        description: 'Natasha Romanoff, former Russian spy, is now one of S.H.I.E.L.D.\'s most lethal agents.',
        type: 'popular',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/f/30/50fecad1f395b',
          extension: 'jpg'
        }
      }
    ],
    avengers: [
      { 
        id: 1009220, 
        name: 'Captain America',
        description: 'Leader of the Avengers, Steve Rogers represents the peak of human potential.',
        type: 'avenger',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/3/50/537ba56d31087',
          extension: 'jpg'
        }
      },
      { 
        id: 1009368, 
        name: 'Iron Man',
        description: 'Core member of the Avengers, Tony Stark provides the team with cutting-edge technology.',
        type: 'avenger',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/9/c0/527bb7b37ff55',
          extension: 'jpg'
        }
      },
      { 
        id: 1009664, 
        name: 'Thor',
        description: 'The Asgardian Avenger brings godlike power to Earth\'s Mightiest Heroes.',
        type: 'avenger',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/d/d0/5269657a74350',
          extension: 'jpg'
        }
      },
      { 
        id: 1009351, 
        name: 'Hulk',
        description: 'Dr. Bruce Banner\'s alter ego provides the Avengers with unbridled strength.',
        type: 'avenger',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/5/a0/538615ca33ab0',
          extension: 'jpg'
        }
      },
      { 
        id: 1009189, 
        name: 'Black Widow',
        description: 'Expert spy and fighter, Natasha Romanoff is a key strategic member of the Avengers.',
        type: 'avenger',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/f/30/50fecad1f395b',
          extension: 'jpg'
        }
      },
      { 
        id: 1009338, 
        name: 'Hawkeye',
        description: 'Master archer Clint Barton never misses his mark as the Avenger known as Hawkeye.',
        type: 'avenger',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/e/90/50fecaf4f101b',
          extension: 'jpg'
        }
      }
    ],
    xmen: [
      { 
        id: 1009718, 
        name: 'Wolverine',
        description: 'The best there is at what he does, Logan is the X-Men\'s most dangerous member.',
        type: 'mutant',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/2/60/537bcaef0f6cf',
          extension: 'jpg'
        }
      },
      { 
        id: 1009257, 
        name: 'Cyclops',
        description: 'Leader of the X-Men, Scott Summers channels solar energy through his eyes.',
        type: 'mutant',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/6/70/526547e2d90ad',
          extension: 'jpg'
        }
      },
      { 
        id: 1009243, 
        name: 'Professor X',
        description: 'Charles Xavier founded the X-Men to promote peaceful coexistence between humans and mutants.',
        type: 'mutant',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/3/e0/528d3378de525',
          extension: 'jpg'
        }
      },
      { 
        id: 1009175, 
        name: 'Beast',
        description: 'Brilliant scientist Dr. Hank McCoy possesses superhuman strength and agility.',
        type: 'mutant',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/2/80/511a79a0451a3',
          extension: 'jpg'
        }
      },
      { 
        id: 1009472, 
        name: 'Nightcrawler',
        description: 'Kurt Wagner can teleport and possesses incredible acrobatic abilities.',
        type: 'mutant',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/1/40/526034979bc98',
          extension: 'jpg'
        }
      },
      { 
        id: 1009310, 
        name: 'Emma Frost',
        description: 'Former villain turned X-Men, Emma Frost is a powerful telepath.',
        type: 'mutant',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/9/80/51151ef7cf4c8',
          extension: 'jpg'
        }
      }
    ],
    villains: [
      { 
        id: 1009281, 
        name: 'Doctor Doom',
        description: 'Victor von Doom is the ruthless ruler of Latveria and archenemy of the Fantastic Four.',
        type: 'villain',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/3/60/53176bb096d17',
          extension: 'jpg'
        }
      },
      { 
        id: 1009466, 
        name: 'Thanos',
        description: 'The Mad Titan seeks ultimate power through the Infinity Stones.',
        type: 'villain',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/6/40/5274137e3e2cd',
          extension: 'jpg'
        }
      },
      { 
        id: 1009389, 
        name: 'Kingpin',
        description: 'Wilson Fisk controls New York\'s criminal underworld with ruthless efficiency.',
        type: 'villain',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/9/60/526034fb5aff7',
          extension: 'jpg'
        }
      },
      { 
        id: 1009227, 
        name: 'Carnage',
        description: 'Serial killer Cletus Kasady bonded with a symbiote to become the lethal Carnage.',
        type: 'villain',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/6/50/535fee423f170',
          extension: 'jpg'
        }
      },
      { 
        id: 1009417, 
        name: 'Magneto',
        description: 'The Master of Magnetism fights for mutant supremacy over humans.',
        type: 'villain',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/3/60/537bc8e8a7648',
          extension: 'jpg'
        }
      },
      { 
        id: 1009515, 
        name: 'Red Skull',
        description: 'Nazi war criminal Johann Schmidt is Captain America\'s greatest enemy.',
        type: 'villain',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/2/03/526036550cd37',
          extension: 'jpg'
        }
      }
    ]
  };

  const getCategoryTitle = () => {
    switch (category.id) {
      case 'popular':
        return 'Popular Heroes';
      case 'avengers':
        return 'Avengers';
      case 'xmen':
        return 'X-Men';
      case 'villains':
        return 'Villains';
      default:
        return 'Characters';
    }
  };

  const getCategoryDescription = () => {
    switch (category.id) {
      case 'popular':
        return 'The most beloved characters in the Marvel Universe';
      case 'avengers':
        return 'Earth\'s Mightiest Heroes, united against common threats';
      case 'xmen':
        return 'Mutant heroes fighting for peaceful coexistence';
      case 'villains':
        return 'The greatest threats to the Marvel Universe';
      default:
        return '';
    }
  };

  useEffect(() => {
    setLoading(true);
    // Simulate API loading delay
    const timer = setTimeout(() => {
      setCharacters(categoryCharacters[category.id] || []);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [category]);

  const renderCharacterCard = ({ item }) => (
    <CharacterCard
      item={item}
      onPress={onCharacterPress}
      isFavorite={false}
      onToggleFavorite={() => {}}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.background }]}
            onPress={onClose}
          >
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={[styles.headerTitle, { 
              color: theme.text,
              fontSize: fontSizes.lg 
            }]}>{getCategoryTitle()}</Text>
            <Text style={[styles.headerDescription, { 
              color: theme.textSecondary,
              fontSize: fontSizes.sm 
            }]}>{getCategoryDescription()}</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ED1D24" />
        </View>
      ) : (
        <FlatList
          data={characters}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={renderCharacterCard}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: '600',
    fontFamily: 'Poppins',
    marginBottom: 4,
  },
  headerDescription: {
    fontFamily: 'PoppinsRegular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 15,
    paddingBottom: Platform.OS === 'ios' ? 90 : 80,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: 'PoppinsRegular',
    textAlign: 'center',
    marginTop: 10,
  },
  characterImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  characterName: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  characterType: {
    fontFamily: 'PoppinsRegular',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  categoryTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ED1D24',
    borderRadius: 15,
  },
  categoryTagText: {
    color: '#FFFFFF',
    fontFamily: 'PoppinsRegular',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginTop: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: '#FFFFFF',
    fontSize: 16,
  },
  statLabel: {
    fontFamily: 'PoppinsRegular',
    color: '#FFFFFF',
    opacity: 0.8,
    fontSize: 12,
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#ED1D24',
  },
  filterButtonText: {
    fontFamily: 'PoppinsRegular',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  sortLabel: {
    fontFamily: 'PoppinsRegular',
    marginRight: 10,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
  },
  sortButtonText: {
    fontFamily: 'PoppinsRegular',
    marginRight: 5,
  },
  gridToggleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchInput: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontFamily: 'PoppinsRegular',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  paginationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  paginationText: {
    fontFamily: 'PoppinsRegular',
    marginHorizontal: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ED1D24',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
});

export default CategoryScreen;