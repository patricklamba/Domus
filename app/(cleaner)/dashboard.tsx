// app/(cleaner)/dashboard.tsx - Updated to use real API data
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  Alert,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Plus, User, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { zelareApi } from '@/lib/api';

interface CleanerProfileData {
  id: string;
  userId: string;
  available: boolean;
  rating?: number;
  completedJobs?: number;
  hourlyRate?: number;
  description?: string;
  services?: string[];
}

export default function DashboardScreen() {
  const { signOut, profile, user } = useAuth();
  const [cleanerProfile, setCleanerProfile] = useState<CleanerProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  
  useEffect(() => {
    loadCleanerProfile();
  }, []);

  const loadCleanerProfile = async () => {
    try {
      setLoading(true);
      const response = await zelareApi.getCleanerProfile();
      
      if (response.success) {
        setCleanerProfile(response.data);
        setIsAvailable(response.data.available || false);
        console.log('Cleaner profile loaded:', response.data);
      } else {
        console.error('Failed to load cleaner profile:', response.message);
        // If no cleaner profile exists, we might need to create one
        if (response.message.includes('not found') || response.message.includes('not configured')) {
          // Profile not set up yet - this is normal for new users
          setCleanerProfile(null);
        } else {
          Alert.alert('Error', 'Failed to load your profile. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error loading cleaner profile:', error);
      Alert.alert('Error', 'Failed to load your profile. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCleanerProfile();
    setRefreshing(false);
  };

  const toggleAvailability = async () => {
    try {
      const newAvailability = !isAvailable;
      const response = await zelareApi.updateCleanerAvailability(newAvailability);
      
      if (response.success) {
        setIsAvailable(newAvailability);
        Alert.alert(
          'Status Updated', 
          newAvailability ? 'You are now available for jobs' : 'You are now unavailable for jobs'
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to update availability');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      Alert.alert('Error', 'Failed to update availability. Please try again.');
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/'); 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  const displayName = profile?.full_name || user?.email || 'Cleaner';
  const firstName = displayName.split(' ')[0];
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome, {firstName}!</Text>
        </View>
        
        <View style={styles.statusCard}>
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>Your Status</Text>
            <Text style={styles.statusValue}>
              {isAvailable ? '🟢 Available for instant jobs' : '🔴 Currently unavailable'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.changeStatusButton}
            onPress={toggleAvailability}
          >
            <Text style={styles.changeStatusText}>
              {isAvailable ? 'Go Offline' : 'Go Online'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(cleaner)/requests')}
          >
            <Text style={styles.actionEmoji}>📅</Text>
            <Text style={styles.actionTitle}>Job Requests</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>0</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(cleaner)/messages')}
          >
            <Text style={styles.actionEmoji}>💬</Text>
            <Text style={styles.actionTitle}>Messages</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>0</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(cleaner)/profile')}
          >
            <Text style={styles.actionEmoji}>📝</Text>
            <Text style={styles.actionTitle}>My Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(cleaner)/history')}
          >
            <Text style={styles.actionEmoji}>📈</Text>
            <Text style={styles.actionTitle}>Job History</Text>
          </TouchableOpacity>
        </View>
        
        {/* Profile Setup Warning for new users */}
        {!cleanerProfile && (
          <View style={styles.setupWarning}>
            <Text style={styles.setupWarningTitle}>Complete Your Profile</Text>
            <Text style={styles.setupWarningText}>
              Set up your cleaner profile to start receiving job requests
            </Text>
            <TouchableOpacity 
              style={styles.setupButton}
              onPress={() => router.push('/(cleaner)/profile')}
            >
              <Text style={styles.setupButtonText}>Complete Profile</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Jobs</Text>
          <Text style={styles.noRequestsText}>No jobs scheduled for today</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {cleanerProfile?.completedJobs || 0}
              </Text>
              <Text style={styles.statLabel}>Jobs Completed</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {cleanerProfile?.rating ? cleanerProfile.rating.toFixed(1) : 'N/A'}
              </Text>
              <Text style={styles.statLabel}>Average Rating</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {cleanerProfile?.hourlyRate ? `${cleanerProfile.hourlyRate}` : 'N/A'}
              </Text>
              <Text style={styles.statLabel}>Hourly Rate (Kz)</Text>
            </View>
          </View>
        </View>

        {/* Account Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Status</Text>
          <View style={styles.statusInfo}>
            <Text style={styles.statusLabel}>Phone Verified: </Text>
            <Text style={[styles.statusBadge, { color: profile?.phone_number ? '#2ecc71' : '#e74c3c' }]}>
              {profile?.phone_number ? '✅ Verified' : '❌ Not Verified'}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/(cleaner)/jobs')}
        >
          <View style={styles.addButton}>
            <Plus size={24} color="#FFF" />
          </View>
          <Text style={styles.navText}>Find Jobs</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/(cleaner)/profile')}
        >
          <User size={24} color="#666" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/(cleaner)/help')}
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
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8F5E9',
    margin: 24,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    color: '#424242',
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
  },
  statusLabel: {
    fontSize: 16,
    color: '#666',
  },
  statusBadge: {
    fontSize: 16,
    fontWeight: '600',
  },
  changeStatusButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  changeStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  setupWarning: {
    backgroundColor: '#fff3cd',
    margin: 24,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  setupWarningTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#856404',
    marginBottom: 8,
  },
  setupWarningText: {
    fontSize: 16,
    color: '#856404',
    marginBottom: 16,
  },
  setupButton: {
    backgroundColor: '#ffc107',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  setupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 16,
  },
  actionCard: {
    width: '47%',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  actionEmoji: {
    fontSize: 36,
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#3498db',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  noRequestsText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  statsCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
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