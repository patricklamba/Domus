import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { EMPLOYERS } from '@/data/mockData';

const MESSAGES = [
  {
    id: 1,
    employerId: 1,
    lastMessage: "Great! I will see you on Monday at 8AM.",
    timestamp: "Today",
    unread: true,
  },
  {
    id: 2,
    employerId: 2,
    lastMessage: "Thank you for the great service!",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: 3,
    employerId: 3,
    lastMessage: "Can you come next week?",
    timestamp: "2 days ago",
    unread: false,
  },
];

export default function MessagesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.messagesList}>
        {MESSAGES.map((message) => {
          const employer = EMPLOYERS.find(e => e.id === message.employerId);
          return (
            <TouchableOpacity
              key={message.id}
              style={styles.messageItem}
              onPress={() => router.push(`/(cleaner)/chat/${message.employerId}`)}
            >
              <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                  <Text style={styles.employerName}>{employer?.name}</Text>
                  <Text style={styles.timestamp}>{message.timestamp}</Text>
                </View>
                <Text 
                  style={[
                    styles.messagePreview,
                    message.unread && styles.unreadMessage
                  ]}
                  numberOfLines={1}
                >
                  {message.lastMessage}
                </Text>
              </View>
              {message.unread && <View style={styles.unreadDot} />}
            </TouchableOpacity>
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
  messagesList: {
    flex: 1,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  employerName: {
    fontSize: 18,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 16,
    color: '#666',
  },
  messagePreview: {
    fontSize: 16,
    color: '#666',
  },
  unreadMessage: {
    color: '#000',
    fontWeight: '500',
  },
  unreadDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3498db',
    marginLeft: 12,
  },
});