import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { CLEANERS } from '@/data/mockData';
import { ArrowLeft, Star } from 'lucide-react-native';

export default function CleaningHistory() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cleaning History</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {CLEANERS.map((cleaner) => (
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
                <Star size={16} color="#FFB800" fill="#FFB800" />
                <Text style={styles.rating}>
                  {cleaner.rating.toFixed(1)} ({cleaner.reviews.length} reviews)
                </Text>
              </View>
              <Text style={styles.lastCleaning}>Last cleaning: 2 weeks ago</Text>
              <Text style={styles.totalCleanings}>Total cleanings: 5</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f3f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  cleanerCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 15,
  },
  cleanerImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  cleanerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  cleanerName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  rating: {
    fontSize: 14,
    marginLeft: 5,
    color: '#666',
  },
  lastCleaning: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  totalCleanings: {
    fontSize: 14,
    color: '#666',
  },
});