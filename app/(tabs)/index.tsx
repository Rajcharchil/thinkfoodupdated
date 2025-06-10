import FoodCard from '@/components/FoodCard';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { db } from '@/firebase/config';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { ChefHat, Filter, LogOut, Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
  cookTime?: string;
}

export default function MenuScreen() {
  const { logout } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Enhanced demo data for when Firebase is not configured
  const demoFoodItems: FoodItem[] = [
    {
      id: '1',
      name: 'Margherita Pizza',
      description: 'Classic pizza with fresh tomatoes, mozzarella, and basil on a crispy thin crust',
      price: 299,
      image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
      category: 'Pizza',
      rating: 4.8,
      cookTime: '15-20 min'
    },
    {
      id: '2',
      name: 'Gourmet Chicken Burger',
      description: 'Grilled chicken breast with avocado, lettuce, tomato, and chipotle mayo',
      price: 249,
      image: 'https://images.pexels.com/photos/552056/pexels-photo-552056.jpeg',
      category: 'Burgers',
      rating: 4.6,
      cookTime: '12-15 min'
    },
    {
      id: '3',
      name: 'Caesar Salad Supreme',
      description: 'Fresh romaine lettuce with parmesan cheese, croutons, and house-made dressing',
      price: 199,
      image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg',
      category: 'Salads',
      rating: 4.4,
      cookTime: '5-8 min'
    },
    {
      id: '4',
      name: 'Spaghetti Carbonara',
      description: 'Creamy pasta with crispy bacon, farm-fresh eggs, and aged parmesan cheese',
      price: 329,
      image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg',
      category: 'Pasta',
      rating: 4.9,
      cookTime: '18-22 min'
    },
    {
      id: '5',
      name: 'Fish Tacos Deluxe',
      description: 'Grilled mahi-mahi with cabbage slaw, pico de gallo, and chipotle crema',
      price: 279,
      image: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg',
      category: 'Mexican',
      rating: 4.7,
      cookTime: '10-14 min'
    },
    {
      id: '6',
      name: 'Chocolate Lava Cake',
      description: 'Decadent chocolate cake with molten center, served with vanilla ice cream',
      price: 149,
      image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
      category: 'Desserts',
      rating: 4.8,
      cookTime: '8-10 min'
    },
    {
      id: '7',
      name: 'BBQ Pulled Pork',
      description: 'Slow-cooked pulled pork with tangy BBQ sauce on a brioche bun',
      price: 229,
      image: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg',
      category: 'Burgers',
      rating: 4.5,
      cookTime: '15-18 min'
    },
    {
      id: '8',
      name: 'Vegetarian Buddha Bowl',
      description: 'Quinoa, roasted vegetables, avocado, and tahini dressing in a nourishing bowl',
      price: 189,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      category: 'Healthy',
      rating: 4.3,
      cookTime: '12-15 min'
    },
    {
      id: '9',
      name: 'Pepperoni Pizza',
      description: 'Classic pepperoni pizza with mozzarella cheese and spicy pepperoni slices',
      price: 319,
      image: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg',
      category: 'Pizza',
      rating: 4.7,
      cookTime: '15-20 min'
    },
    {
      id: '10',
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon with lemon herb butter and seasonal vegetables',
      price: 399,
      image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg',
      category: 'Seafood',
      rating: 4.9,
      cookTime: '20-25 min'
    }
  ];

  const categories = ['All', 'Pizza', 'Burgers', 'Salads', 'Pasta', 'Mexican', 'Desserts', 'Healthy', 'Seafood'];

  const fetchFoodItems = async () => {
    try {
      setError('');
      const querySnapshot = await getDocs(collection(db, 'menu'));
      const items: FoodItem[] = [];
      
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as FoodItem);
      });
      
      if (items.length > 0) {
        setFoodItems(items);
        setFilteredItems(items);
      } else {
        // If no items in Firestore, use demo data
        setFoodItems(demoFoodItems);
        setFilteredItems(demoFoodItems);
      }
    } catch (error) {
      console.error('Error fetching food items:', error);
      // Load demo data if Firebase fails
      setFoodItems(demoFoodItems);
      setFilteredItems(demoFoodItems);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchQuery, selectedCategory, foodItems]);

  const filterItems = () => {
    let filtered = foodItems;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFoodItems();
  };

  const renderCategoryFilter = () => (
    <View style={styles.categoryContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category === 'All' ? null : category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const handleSignOut = async () => {
    try {
      await logout();
      router.replace('/(auth)/signup');
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ChefHat size={60} color="#FF6B35" />
        <ActivityIndicator size="large" color="#FF6B35" style={styles.loader} />
        <Text style={styles.loadingText}>Preparing your delicious menu...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: colors.text }]}>Menu</Text>
            <TouchableOpacity 
              style={[styles.signOutButton, { backgroundColor: colors.card }]} 
              onPress={handleSignOut}
            >
              <LogOut size={20} color={colors.error} />
              <Text style={[styles.signOutText, { color: colors.error }]}>Sign Out</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchContainer}>
            <Search size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for dishes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={20} color="#FF6B35" />
            </TouchableOpacity>
          </View>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {renderCategoryFilter()}

        <View style={styles.menuContainer}>
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <FoodCard item={item} />}
            numColumns={2}
            contentContainerStyle={styles.list}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#FF6B35']}
                tintColor="#FF6B35"
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <ChefHat size={80} color="#ddd" />
                <Text style={styles.emptyText}>No dishes found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
              </View>
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff5f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    padding: 4,
  },
  categoryContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
  },
  menuContainer: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loader: {
    marginVertical: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  errorText: {
    color: '#2e7d32',
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    gap: 4,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '600',
  },
});