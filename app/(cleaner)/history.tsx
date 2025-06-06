import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { EMPLOYERS, REQUESTS } from '@/data/mockData';

export default function JobHistoryScreen() {
  const completedJobs = REQUESTS.filter(req => req.status === 'completed');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Job History</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.jobsList}>
        {completedJobs.map((job) => {
          const employer = EMPLOYERS.find(e => e.id === job.employerId);
          return (
            <View key={job.id} style={styles.jobItem}>
              <View style={styles.jobHeader}>
                <Text style={styles.employerName}>{employer?.name}</Text>
                <Text style={styles.completedBadge}>✅ Completed</Text>
              </View>

              <View style={styles.jobDetails}>
                <Text style={styles.jobInfo}>📍 {job.location}</Text>
                <Text style={styles.jobInfo}>📆 {job.date}</Text>
                <Text style={styles.jobInfo}>⏰ {job.time}</Text>
                <Text style={styles.jobPrice}>💰 {job.price} Kz</Text>
              </View>

              {job.notes && (
                <Text style={styles.jobNotes}>
                  📝 {job.notes}
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    fontSize: 24,
    fontWeight: '700',
  },
  jobsList: {
    flex: 1,
  },
  jobItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  employerName: {
    fontSize: 18,
    fontWeight: '600',
  },
  completedBadge: {
    fontSize: 16,
    color: '#2ecc71',
    fontWeight: '500',
  },
  jobDetails: {
    gap: 8,
  },
  jobInfo: {
    fontSize: 16,
  },
  jobPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginTop: 4,
  },
  jobNotes: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    fontStyle: 'italic',
  },
});