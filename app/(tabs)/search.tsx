import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native';
import { Search as SearchIcon, MapPin, Star } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface CleanerProfile {
  id: string;
  user_id: string;
  age: number | null;
  experience_years: number | null;
  hourly_rate: number | null;
  bio: string | null;
  services: string[] | null;
  is_available: boolean;
  rating: number | null;
  total_jobs: number;
  profiles: {
    full_name: string;
    location: string | null;
    avatar_url: string | null;
  };
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cleaners, setCleaners] = useState<CleanerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { profile } = useAuth();

  useEffect(() => {
    fetchCleaners();
  }, []);

  const fetchCleaners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cleaner_profiles')
        .select(`
          *,
          profiles (
            full_name,
            location,
            avatar_url
          )
        `)
        .eq('is_available', true)
        .order('rating', { ascending: false });

      if (error) {
        setError('Failed to load cleaners');
        console.error('Error fetching cleaners:', error);
      } else {
        setCleaners(data || []);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCleaners = cleaners.filter(cleaner => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const name = cleaner.profiles?.full_name?.toLowerCase() || '';
    const location = cleaner.profiles?.location?.toLowerCase() || '';
    const services = cleaner.services?.join(' ').toLowerCase() || '';
    
    return name.includes(query) || 
           location.includes(query) || 
           services.includes(query);
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading cleaners...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {profile?.role === 'employer' ? 'Find Cleaners' : 'Browse Cleaners'}
        </Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <SearchIcon size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, location, or service..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchCleaners}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.resultsContainer}>
          {filteredCleaners.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'No cleaners found matching your search' : 'No cleaners available'}
              </Text>
            </View>
          ) : (
            filteredCleaners.map((cleaner) => (
              <TouchableOpacity key={cleaner.id} style={styles.cleanerCard}>
                <View style={styles.cleanerHeader}>
                  <Image
                    source={{ 
                      uri: cleaner.profiles?.avatar_url || 
                           'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg' 
                    }}
                    style={styles.avatar}
                  />
                  <View style={styles.cleanerInfo}>
                    <Text style={styles.cleanerName}>
                      {cleaner.profiles?.full_name || 'Unknown'}
                    </Text>
                    <View style={styles.locationContainer}>
                      <MapPin size={14} color="#666" />
                      <Text style={styles.location}>
                        {cleaner.profiles?.location || 'Location not specified'}
                      </Text>
                    </View>
                    <View style={styles.ratingContainer}>
                      <Star size={14} color="#f39c12" fill="#f39c12" />
                      <Text style={styles.rating}>
                        {cleaner.rating?.toFixed(1) || '0.0'} ({cleaner.total_jobs} jobs)
                      </Text>
                    </View>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>
                      {cleaner.hourly_rate ? `${cleaner.hourly_rate} Kz/hr` : 'Rate not set'}
                    </Text>
                    <View style={styles.availableBadge}>
                      <Text style={styles.availableText}>Available</Text>
                    </View>
                  </View>
                </View>

                {cleaner.services && cleaner.services.length > 0 && (
                  <View style={styles.servicesContainer}>
                    {cleaner.services.slice(0, 3).map((service, index) => (
                      <View key={index} style={styles.serviceTag}>
                        <Text style={styles.serviceText}>{service}</Text>
                      </View>
                    ))}
                    {cleaner.services.length > 3 && (
                      <Text style={styles.moreServices}>
                        +{cleaner.services.length - 3} more
                      </Text>
                    )}
                  </View>
                )}

                {cleaner.bio && (
                  <Text style={styles.bio} numberOfLines={2}>
                    {cleaner.bio}
                  </Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2c3e50',
  },
  searchSection: {
    padding: 16,
    backgroundColor: '#fff',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  cleanerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cleanerHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  cleanerInfo: {
    flex: 1,
  },
  cleanerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2ecc71',
    marginBottom: 4,
  },
  availableBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  availableText: {
    fontSize: 12,
    color: '#2ecc71',
    fontWeight: '600',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 6,
  },
  serviceTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  serviceText: {
    fontSize: 12,
    color: '#1565c0',
    fontWeight: '500',
  },
  moreServices: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  bio: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});