import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Phone, Mail, MapPin, MessageCircle, ChevronRight } from 'lucide-react-native';

const FAQ_ITEMS = [
  {
    question: 'How do I accept job requests?',
    answer: 'When you receive a job request, you can view the details and either accept or decline. Accepted jobs will appear in your upcoming jobs section.'
  },
  {
    question: 'How do I get paid?',
    answer: 'Payment is processed automatically after job completion. Funds are transferred to your registered mobile money account within 24 hours.'
  },
  {
    question: 'Can I set my own rates?',
    answer: 'Yes, you can set your hourly rate in your profile settings. You can adjust this at any time based on your experience and demand.'
  },
  {
    question: 'What if a client cancels?',
    answer: 'If a client cancels with less than 24 hours notice, you may be eligible for a cancellation fee. Contact support for assistance.'
  }
];

const COMMON_PROBLEMS = [
  {
    title: 'Not receiving job requests',
    solution: 'Check your availability settings and ensure your profile is complete with photos and services listed.'
  },
  {
    title: 'Payment delays',
    solution: 'Verify your mobile money details are correct in your profile. Contact support if payment is delayed beyond 24 hours.'
  },
  {
    title: 'Client communication issues',
    solution: 'Use the in-app chat feature for all communication. If issues persist, contact support for mediation.'
  }
];

export default function CleanerHelpScreen() {
  const handleCall = () => {
    Linking.openURL('tel:+244123456789');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:cleaners@domusangola.com');
  };

  const handleChat = () => {
    // Implement chat functionality
    router.push('/(cleaner)/support-chat');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Need Help?</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Contact Support</Text>
          
          <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
            <Phone size={20} color="#2ecc71" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Call Us</Text>
              <Text style={styles.contactValue}>+244 123 456 789</Text>
            </View>
            <ChevronRight size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton} onPress={handleEmail}>
            <Mail size={20} color="#3498db" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email Support</Text>
              <Text style={styles.contactValue}>cleaners@domusangola.com</Text>
            </View>
            <ChevronRight size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton}>
            <MapPin size={20} color="#e74c3c" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Visit Us</Text>
              <Text style={styles.contactValue}>Luanda Central Office</Text>
            </View>
            <ChevronRight size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
            <MessageCircle size={20} color="#FFF" />
            <Text style={styles.chatButtonText}>Start Live Chat</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {FAQ_ITEMS.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={styles.question}>{item.question}</Text>
              <Text style={styles.answer}>{item.answer}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Problems</Text>
          {COMMON_PROBLEMS.map((item, index) => (
            <View key={index} style={styles.problemItem}>
              <Text style={styles.problemTitle}>{item.title}</Text>
              <Text style={styles.solution}>{item.solution}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Hours</Text>
          <View style={styles.hoursContainer}>
            <View style={styles.hoursRow}>
              <Text style={styles.dayText}>Monday - Friday</Text>
              <Text style={styles.timeText}>8:00 AM - 6:00 PM</Text>
            </View>
            <View style={styles.hoursRow}>
              <Text style={styles.dayText}>Saturday</Text>
              <Text style={styles.timeText}>9:00 AM - 4:00 PM</Text>
            </View>
            <View style={styles.hoursRow}>
              <Text style={styles.dayText}>Sunday</Text>
              <Text style={styles.timeText}>Closed</Text>
            </View>
          </View>
        </View>
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
  contactCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  contactInfo: {
    flex: 1,
    marginLeft: 15,
  },
  contactLabel: {
    fontSize: 14,
    color: '#666',
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  answer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  problemItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  problemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#e74c3c',
  },
  solution: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  hoursContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dayText: {
    fontSize: 14,
    color: '#666',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});