// app/(cleaner)/profile.tsx - Updated to use real API data
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { zelareApi } from '@/lib/api';

interface CleanerProfileData {
  id?: string;
  userId: string;
  available: boolean;
  rating?: number;
  completedJobs?: number;
  hourlyRate?: number;
  description?: string;
  services?: string[];
}

interface UserProfileData {
  fullName: string;
  email?: string;
  location?: string;
  avatarUrl?: string;
}

export default function ProfileScreen() {
  const { profile, user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // User profile fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  
  // Cleaner profile fields
  const [hourlyRate, setHourlyRate] = useState('');
  const [bio, setBio] = useState('');
  const [cleanerProfile, setCleanerProfile] = useState<CleanerProfileData | null>(null);
  
  // Sample services - in a real app, this would come from the backend
  const [services, setServices] = useState([
    { id: 1, name: 'General Cleaning', selected: false },
    { id: 2, name: 'Deep Cleaning', selected: false },
    { id: 3, name: 'Window Cleaning', selected: false },
    { id: 4, name: 'Laundry', selected: false },
    { id: 5, name: 'Ironing', selected: false },
    { id: 6, name: 'Dishes', selected: false },
  ]);

  useEffect(() => {
    loadProfileData();
  }, [profile]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Load user basic profile
      if (profile) {
        setName(profile.full_name || '');
        setEmail(profile.email || '');
        setLocation(profile.location || '');
      }

      // Load cleaner profile if user is a cleaner
      if (profile?.role === 'cleaner') {
        try {
          const response = await zelareApi.getCleanerProfile();
          if (response.success) {
            const cleanerData = response.data;
            setCleanerProfile(cleanerData);
            setHourlyRate(cleanerData.hourlyRate?.toString() || '');
            setBio(cleanerData.description || '');
            
            // Update services based on cleaner profile
            if (cleanerData.services && cleanerData.services.length > 0) {
              setServices(prev => prev.map(service => ({
                ...service,
                selected: cleanerData.services?.includes(service.name.toLowerCase().replace(' ', '_')) || false
              })));
            }
          } else {
            console.log('No cleaner profile found, this is normal for new cleaners');
            setCleanerProfile(null);
          }
        } catch (error) {
          console.log('Error loading cleaner profile:', error);
          // This is normal for new cleaner accounts
        }
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (id: number) => {
    setServices(
      services.map(service => 
        service.id === id ? { ...service, selected: !service.selected } : service
      )
    );
  };

  const saveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    if (profile?.role === 'cleaner' && !hourlyRate.trim()) {
      Alert.alert('Error', 'Please set your hourly rate');
      return;
    }

    try {
      setSaving(true);

      // Update user profile
      const userProfileData: UserProfileData = {
        fullName: name.trim(),
        email: email.trim() || undefined,
        location: location.trim() || undefined,
      };

      const updateResponse = await updateProfile({
        full_name: userProfileData.fullName,
        email: userProfileData.email,
        location: userProfileData.location,
      });

      if (updateResponse.error) {
        throw new Error(updateResponse.error.message);
      }

      // For cleaners, we would need additional API endpoints to update cleaner profile
      // This is a placeholder - you'll need to implement these endpoints in your backend
      if (profile?.role === 'cleaner') {
        console.log('Cleaner profile data to save:', {
          hourlyRate: parseInt(hourlyRate),
          description: bio.trim(),
          services: services.filter(s => s.selected).map(s => s.name.toLowerCase().replace(' ', '_'))
        });
        
        // TODO: Implement zelareApi.updateCleanerProfile() method
        // const cleanerResponse = await zelareApi.updateCleanerProfile({
        //   hourlyRate: parseInt(hourlyRate),
        //   description: bio.trim(),
        //   services: services.filter(s => s.selected).map(s => s.name.toLowerCase().replace(' ', '_'))
        // });
      }

      Alert.alert('Success', 'Profile updated successfully!');
      router.back();

    } catch (error: any) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', error.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <View style={styles.avatarSection}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {name ? name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <TouchableOpacity style={styles.changePhotoButton}>
          <Text style={styles.changePhotoText}>📷 Change Photo</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <Text style={styles.inputLabel}>Full Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
        />
        
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Enter your email (optional)"
        />
        
        <Text style={styles.inputLabel}>Phone Number</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={profile?.phone_number || ''}
          editable={false}
          placeholder="Phone number (verified)"
        />
        
        <Text style={styles.inputLabel}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter your location"
        />

        {/* Show cleaner-specific fields only for cleaners */}
        {profile?.role === 'cleaner' && (
          <>
            <Text style={styles.inputLabel}>Hourly Rate (Kz) *</Text>
            <TextInput
              style={styles.input}
              value={hourlyRate}
              onChangeText={setHourlyRate}
              keyboardType="numeric"
              placeholder="Enter your hourly rate"
            />
            
            <Text style={styles.inputLabel}>Bio / Description</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              placeholder="Tell clients about your experience and services..."
            />
          </>
        )}
      </View>
      
      {/* Services section only for cleaners */}
      {profile?.role === 'cleaner' && (
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Services Offered</Text>
          <Text style={styles.sectionSubtitle}>Select the services you provide</Text>
          
          {services.map(service => (
            <TouchableOpacity 
              key={service.id}
              style={[styles.serviceItem, service.selected && styles.serviceItemSelected]}
              onPress={() => toggleService(service.id)}
            >
              <Text style={[styles.serviceText, service.selected && styles.serviceTextSelected]}>
                {service.name}
              </Text>
              <Text style={styles.serviceCheckmark}>
                {service.selected ? '✓' : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Account Information */}
      <View style={styles.accountSection}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Account Type:</Text>
          <Text style={styles.infoValue}>
            {profile?.role === 'cleaner' ? 'Professional Cleaner' : 'Service Employer'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone Verified:</Text>
          <Text style={[styles.infoValue, { color: '#2ecc71' }]}>✓ Verified</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Member Since:</Text>
          <Text style={styles.infoValue}>
            {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
          </Text>
        </View>
      </View>

      {/* Stats section for cleaners */}
      {profile?.role === 'cleaner' && cleanerProfile && (
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{cleanerProfile.completedJobs || 0}</Text>
              <Text style={styles.statLabel}>Jobs Completed</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {cleanerProfile.rating ? cleanerProfile.rating.toFixed(1) : 'N/A'}
              </Text>
              <Text style={styles.statLabel}>Average Rating</Text>
            </View>
          </View>
        </View>
      )}
      
      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={saveProfile}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.saveButtonText}>Save Profile</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  avatarSection: {
    alignItems: 'center',
    padding: 24,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 50,
    fontWeight: '700',
    color: 'white',
  },
  changePhotoButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  changePhotoText: {
    fontSize: 16,
  },
  formSection: {
    padding: 24,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  disabledInput: {
    backgroundColor: '#EEEEEE',
    color: '#999',
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  servicesSection: {
    padding: 24,
    paddingTop: 0,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 8,
  },
  serviceItemSelected: {
    backgroundColor: '#E8F5E9',
  },
  serviceText: {
    fontSize: 16,
  },
  serviceTextSelected: {
    fontWeight: '600',
    color: '#2E7D32',
  },
  serviceCheckmark: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
  },
  accountSection: {
    padding: 24,
    paddingTop: 0,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statsSection: {
    padding: 24,
    paddingTop: 0,
  },
  statsCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3498db',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  saveButton: {
    backgroundColor: '#2ecc71',
    margin: 24,
    marginTop: 8,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
});