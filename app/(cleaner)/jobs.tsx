import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { EMPLOYERS, REQUESTS } from '@/data/mockData';

export default function FindJobsScreen() {
  const availableJobs = REQUESTS.filter(req => !req.cleanerId && req.status === 'pending');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Available Jobs</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.jobsList}>
        {availableJobs.length > 0 ? (
          availableJobs.map((job) => {
            const employer = EMPLOYERS.find(e => e.id === job.employerId);
            return (
              <TouchableOpacity
                key={job.id}
                style={styles.jobItem}
                onPress={() => router.push(`/(cleaner)/request-details/${job.id}`)}
              >
                <View style={styles.jobHeader}>
                  <Text style={styles.employerName}>{employer?.name}</Text>
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>🆕 New</Text>
                  </View>
                </View>

                <View style={styles.jobDetails}>
                  <Text style={styles.jobInfo}>📍 {job.location}</Text>
                  <Text style={styles.jobInfo}>📅 {job.date}</Text>
                  <Text style={styles.jobInfo}>⏰ {job.time}</Text>
                  <Text style={styles.jobPrice}>💰 {job.price} Kz</Text>
                </View>

                {job.notes && (
                  <Text style={styles.jobNotes}>
                    📝 {job.notes}
                  </Text>
                )}

                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.viewButton]}
                    onPress={() => router.push(`/(cleaner)/request-details/${job.id}`)}
                  >
                    <Text style={styles.viewButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>🔍</Text>
            <Text style={styles.emptyStateText}>No jobs available</Text>
            <Text style={styles.emptyStateSubtext}>Check back later for new cleaning opportunities</Text>
          </View>
        )}
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
  newBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  newBadgeText: {
    fontSize: 14,
    color: '#1565C0',
    fontWeight: '600',
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
  actionButtons: {
    marginTop: 16,
  },
  actionButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#3498db',
  },
  viewButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});