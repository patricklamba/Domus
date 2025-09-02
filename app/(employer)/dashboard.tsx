import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CLEANERS } from '@/data/mockData';
import { Search, Filter, Star, MapPin, Clock, Calendar, Plus, User, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
interface SortButtonProps {
  icon: React.ReactElement;
  label: string;
  active: boolean;
  onPress: () => void;
}

interface CleanerCardProps {
  name: string;
  rating: number;
  reviews: number;
  location: string;
  hourlyRate: number;
  isAvailable: boolean;
  onPress: () => void;
  profilePicture: string;
}

interface AvailabilityBadgeProps {
  available: boolean;
}

export default function EmployerDashboard() {
  const { signOut } = useAuth(); 
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'price'>('rating');
  const [showFilters, setShowFilters] = useState(false);

  const sortedCleaners = [...CLEANERS].sort((a, b) => {
    return sortBy === 'rating' 
      ? b.rating - a.rating 
      : a.hourlyRate - b.hourlyRate;
  });

  const filteredCleaners = sortedCleaners.filter(cleaner =>
    !searchQuery || cleaner.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/'); 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find a Cleaner</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by city or district..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={showFilters ? "#3498db" : "#666"} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sortContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortButtons}
        >
          <SortButton 
            icon={<Star size={16} />}
            label="Top Rated"
            active={sortBy === 'rating'}
            onPress={() => setSortBy('rating')}
          />
          <SortButton 
            icon={<Clock size={16} />}
            label="Best Price"
            active={sortBy === 'price'}
            onPress={() => setSortBy('price')}
          />
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {filteredCleaners.map((cleaner) => (
          <CleanerCard 
            key={cleaner.id}
            name={cleaner.name}
            rating={cleaner.rating}
            reviews={cleaner.reviews.length}
            location={cleaner.location}
            hourlyRate={cleaner.hourlyRate}
            isAvailable={cleaner.isAvailable}
            profilePicture={cleaner.profilePicture}
            onPress={() => router.push(`/(employer)/profile/${cleaner.id}`)}
          />
        ))}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/(employer)/new-job')}
        >
          <View style={styles.addButton}>
            <Plus size={24} color="#FFF" />
          </View>
          <Text style={styles.navText}>New Job</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/(employer)/profile')}
        >
          <User size={24} color="#666" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/(employer)/help')}
        >
          <HelpCircle size={24} color="#666" />
          <Text style={styles.navText}>Help</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={handleLogout}
        >
          <LogOut size={24} color="#666" />
          <Text style={styles.navText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const SortButton: React.FC<SortButtonProps> = ({ icon, label, active, onPress }) => (
  <TouchableOpacity 
    style={[styles.sortButton, active && styles.sortButtonActive]}
    onPress={onPress}
  >
    {React.cloneElement(icon as React.ReactElement<any>, { 
      color: active ? "#3498db" : "#666" 
    })}
    <Text style={[styles.sortButtonText, active && styles.sortButtonTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const CleanerCard: React.FC<CleanerCardProps> = ({ 
  name, 
  rating, 
  reviews, 
  location, 
  hourlyRate, 
  isAvailable,
  onPress,
  profilePicture
}) => (
  <TouchableOpacity
    style={styles.cleanerCard}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Image 
      source={{ uri: profilePicture }}
      style={styles.profileImage}
    />
    
    <View style={styles.cleanerInfo}>
      <View style={styles.nameRow}>
        <Text style={styles.cleanerName} numberOfLines={1}>
          {name}
        </Text>
        <AvailabilityBadge available={isAvailable} />
      </View>
      
      <View style={styles.ratingContainer}>
        <Star size={16} color="#FFB800" fill="#FFB800" />
        <Text style={styles.ratingText}>
          {rating.toFixed(1)} ({reviews} reviews)
        </Text>
      </View>
      
      <View style={styles.locationContainer}>
        <MapPin size={14} color="#666" />
        <Text style={styles.locationText} numberOfLines={1}>
          {location}
        </Text>
      </View>
      
      <View style={styles.bottomRow}>
        <Text style={styles.priceText}>{hourlyRate.toLocaleString()} Kz/hour</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({ available }) => (
  <View style={[
    styles.availabilityBadge,
    available ? styles.availableBadge : styles.unavailableBadge
  ]}>
    <Text style={[
      styles.availabilityBadgeText,
      { color: available ? '#2ecc71' : '#e74c3c' }
    ]}>
      {available ? 'Available' : 'Booked'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2c3e50',
  },
  searchSection: {
    padding: 16,
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f5',
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    marginLeft: 10,
  },
  sortContainer: {
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  sortButtons: {
    paddingHorizontal: 16,
    gap: 12,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f3f5',
    gap: 8,
  },
  sortButtonActive: {
    backgroundColor: '#e3f2fd',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#666',
  },
  sortButtonTextActive: {
    color: '#3498db',
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  cleanerCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  cleanerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cleanerName: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
    color: '#2c3e50',
  },
  availabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableBadge: {
    backgroundColor: '#e8f5e9',
  },
  unavailableBadge: {
    backgroundColor: '#ffebee',
  },
  availabilityBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3498db',
  },
  viewButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});