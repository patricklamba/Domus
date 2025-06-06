import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView,
  Platform 
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { REQUESTS, EMPLOYERS } from '@/data/mockData';
import { Plus, User, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';

export default function DashboardScreen() {
  // Get pending requests
  const pendingRequests = REQUESTS.filter(req => req.status === 'pending');
  
  const handleLogout = () => {
    router.replace('/');
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome, Maria!</Text>
          <TouchableOpacity 
            style={styles.homeButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.homeButtonText}>🏠 Home</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.statusCard}>
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>Your Status</Text>
            <Text style={styles.statusValue}>🟢 Available for instant jobs</Text>
          </View>
          <TouchableOpacity 
            style={styles.changeStatusButton}
            onPress={() => router.push('/(cleaner)/availability')}
          >
            <Text style={styles.changeStatusText}>Change</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(cleaner)/requests')}
          >
            <Text style={styles.actionEmoji}>📅</Text>
            <Text style={styles.actionTitle}>Pending Requests</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{pendingRequests.length}</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(cleaner)/messages')}
          >
            <Text style={styles.actionEmoji}>💬</Text>
            <Text style={styles.actionTitle}>Messages</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>3</Text>
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
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jobs</Text>
          
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => {
              const employer = EMPLOYERS.find(e => e.id === request.employerId);
              return (
                <View key={request.id} style={styles.requestCard}>
                  <View style={styles.requestHeader}>
                    <Text style={styles.employerName}>{employer?.name || 'Unknown'}</Text>
                    <Text style={styles.requestDate}>{request.date}</Text>
                  </View>
                  
                  <View style={styles.requestDetails}>
                    <Text style={styles.requestLocation}>📍 {request.location}</Text>
                    <Text style={styles.requestTime}>🕒 {request.time}</Text>
                    <Text style={styles.requestPrice}>💰 {request.price} Kz</Text>
                  </View>
                  
                  <View style={styles.requestActions}>
                    <TouchableOpacity 
                      style={[styles.requestButton, styles.acceptButton]}
                      onPress={() => router.push(`/(cleaner)/request-details/${request.id}`)}
                    >
                      <Text style={styles.acceptButtonText}>Accept</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.requestButton, styles.declineButton]}
                      onPress={() => router.push(`/(cleaner)/request-details/${request.id}`)}
                    >
                      <Text style={styles.declineButtonText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={styles.noRequestsText}>No pending requests</Text>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Jobs</Text>
          
          {REQUESTS.filter(req => req.status === 'accepted').length > 0 ? (
            REQUESTS.filter(req => req.status === 'accepted').map((request) => {
              const employer = EMPLOYERS.find(e => e.id === request.employerId);
              return (
                <View key={request.id} style={styles.jobCard}>
                  <View style={styles.jobHeader}>
                    <Text style={styles.employerName}>{employer?.name || 'Unknown'}</Text>
                    <View style={styles.jobStatusBadge}>
                      <Text style={styles.jobStatusText}>Confirmed</Text>
                    </View>
                  </View>
                  
                  <View style={styles.jobDetails}>
                    <Text style={styles.jobInfo}>📍 {request.location}</Text>
                    <Text style={styles.jobInfo}>📅 {request.date}</Text>
                    <Text style={styles.jobInfo}>🕒 {request.time}</Text>
                    <Text style={styles.jobPrice}>💰 {request.price} Kz</Text>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={styles.noRequestsText}>No upcoming jobs</Text>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stats</Text>
          
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>32</Text>
              <Text style={styles.statLabel}>Jobs Completed</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Average Rating</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>95%</Text>
              <Text style={styles.statLabel}>On-time Rate</Text>
            </View>
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
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingBottom: 100, // Add padding to account for bottom nav
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  homeButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
  requestCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  employerName: {
    fontSize: 18,
    fontWeight: '700',
  },
  requestDate: {
    fontSize: 14,
    color: '#666',
  },
  requestDetails: {
    marginBottom: 16,
    gap: 8,
  },
  requestLocation: {
    fontSize: 16,
  },
  requestTime: {
    fontSize: 16,
  },
  requestPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 12,
  },
  requestButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#2ecc71',
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  declineButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  noRequestsText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  jobCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  jobStatusBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  jobStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565C0',
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