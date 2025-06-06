import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { EMPLOYERS, REQUESTS } from '@/data/mockData';

export default function PendingRequestsScreen() {
  const pendingRequests = REQUESTS.filter(req => req.status === 'pending');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pending Requests</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.requestsList}>
        {pendingRequests.length > 0 ? (
          pendingRequests.map((request) => {
            const employer = EMPLOYERS.find(e => e.id === request.employerId);
            return (
              <TouchableOpacity
                key={request.id}
                style={styles.requestItem}
                onPress={() => router.push(`/(cleaner)/request-details/${request.id}`)}
              >
                <View style={styles.requestHeader}>
                  <Text style={styles.employerName}>{employer?.name}</Text>
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingBadgeText}>⏳ Pending</Text>
                  </View>
                </View>

                <View style={styles.requestDetails}>
                  <Text style={styles.requestInfo}>📍 {request.location}</Text>
                  <Text style={styles.requestInfo}>📅 {request.date}</Text>
                  <Text style={styles.requestInfo}>⏰ {request.time}</Text>
                  <Text style={styles.requestPrice}>💰 {request.price} Kz</Text>
                </View>

                {request.notes && (
                  <Text style={styles.requestNotes}>
                    📝 {request.notes}
                  </Text>
                )}

                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.acceptButton]}
                    onPress={() => router.push(`/(cleaner)/request-details/${request.id}`)}
                  >
                    <Text style={styles.acceptButtonText}>Review Request</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>📭</Text>
            <Text style={styles.emptyStateText}>No pending requests</Text>
            <Text style={styles.emptyStateSubtext}>New cleaning requests will appear here</Text>
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
  requestsList: {
    flex: 1,
  },
  requestItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  employerName: {
    fontSize: 18,
    fontWeight: '600',
  },
  pendingBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pendingBadgeText: {
    fontSize: 14,
    color: '#F57C00',
    fontWeight: '600',
  },
  requestDetails: {
    gap: 8,
  },
  requestInfo: {
    fontSize: 16,
  },
  requestPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginTop: 4,
  },
  requestNotes: {
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
  acceptButton: {
    backgroundColor: '#3498db',
  },
  acceptButtonText: {
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