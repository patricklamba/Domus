import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { EMPLOYERS, CLEANERS } from '@/data/mockData';
import { Wallet, History, Crown, ChevronRight, ArrowLeft } from 'lucide-react-native';

export default function EmployerProfile() {
  // Using first employer as example
  const employer = EMPLOYERS[0];
  
  // Get last 2 cleaners worked with
  const recentCleaners = CLEANERS.slice(0, 2);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('/(employer)/dashboard')}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: employer.profilePicture }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.name}>{employer.name}</Text>
            <Text style={styles.location}>{employer.location}</Text>
          </View>
        </View>
      </View>

      <View style={styles.creditSection}>
        <View style={styles.balanceContainer}>
          <Wallet size={24} color="#2ecc71" />
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceLabel}>Available Credits</Text>
            <Text style={styles.balanceAmount}>15,000 Kz</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.loadButton}
          onPress={() => router.push('/(employer)/load-credits')}
        >
          <Text style={styles.loadButtonText}>Load Credits</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subscriptionCard}>
        <View style={styles.subscriptionHeader}>
          <Crown size={24} color="#FFD700" />
          <Text style={styles.subscriptionTitle}>Diamond Plan</Text>
        </View>
        <Text style={styles.subscriptionDescription}>
          Enjoy premium features and priority booking
        </Text>
        <TouchableOpacity 
          style={styles.upgradeButton}
          onPress={() => router.push('/(employer)/subscription-plans')}
        >
          <Text style={styles.upgradeButtonText}>View Plans</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <History size={20} color="#666" />
            <Text style={styles.sectionTitle}>Recent Cleaners</Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/(employer)/cleaning-history')}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight size={16} color="#3498db" />
          </TouchableOpacity>
        </View>

        {recentCleaners.map((cleaner) => (
          <TouchableOpacity
            key={cleaner.id}
            style={styles.cleanerCard}
            onPress={() => router.push(`/(employer)/profile/${cleaner.id}`)}
          >
            <Image
              source={{ uri: cleaner.profilePicture }}
              style={styles.cleanerImage}
            />
            <View style={styles.cleanerInfo}>
              <Text style={styles.cleanerName}>{cleaner.name}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>⭐ {cleaner.rating.toFixed(1)}</Text>
                <Text style={styles.reviews}>({cleaner.reviews.length} reviews)</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.settingsSection}>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => router.push('/(employer)/settings')}
        >
          <Text style={styles.settingsButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#3498db',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileInfo: {
    marginLeft: 20,
  },
  welcomeText: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 16,
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 4,
  },
  location: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 16,
  },
  creditSection: {
    margin: 20,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  balanceInfo: {
    marginLeft: 12,
    flex: 1,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2ecc71',
  },
  loadButton: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: Platform.select({
      ios: 18,
      android: 16,
      default: 16,
    }),
    paddingVertical: Platform.select({
      ios: 12,
      android: 10,
      default: 10,
    }),
    borderRadius: 8,
    minWidth: Platform.select({
      ios: 100,
      android: 95,
      default: 95,
    }),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2ecc71',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  loadButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: Platform.select({
      ios: 15,
      android: 14,
      default: 14,
    }),
    textAlign: 'center',
  },
  subscriptionCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  subscriptionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 10,
    color: '#333',
  },
  subscriptionDescription: {
    color: '#666',
    marginBottom: 15,
  },
  upgradeButton: {
    backgroundColor: '#FFD700',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  section: {
    margin: 20,
    marginTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#3498db',
    marginRight: 4,
  },
  cleanerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 10,
  },
  cleanerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  cleanerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  cleanerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    marginRight: 4,
  },
  reviews: {
    fontSize: 14,
    color: '#666',
  },
  settingsSection: {
    margin: 20,
    marginTop: 0,
    marginBottom: 40,
  },
  settingsButton: {
    backgroundColor: '#f1f3f5',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  settingsButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});