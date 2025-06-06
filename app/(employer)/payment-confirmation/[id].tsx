import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { CLEANERS } from '@/data/mockData';

export default function PaymentConfirmationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const cleanerId = parseInt(id || '0');
  const cleaner = CLEANERS.find(c => c.id === cleanerId);

  // Hardcoded values for demo
  const hours = 5;
  const hourlyRate = 1000;
  const subtotal = hours * hourlyRate;
  const platformFee = Math.round(subtotal * 0.1); // 10% platform fee
  const totalAmount = subtotal + platformFee;
  const cleanerAmount = subtotal - platformFee;

  if (!cleaner) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Cleaner not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handlePayment = () => {
    Alert.alert(
      'Payment Simulated!',
      'In a real app, this would process the payment through a payment gateway.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.cleanerCard}>
            <Text style={styles.cleanerName}>{cleaner.name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>⭐ {cleaner.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Hourly Rate</Text>
              <Text style={styles.detailValue}>{hourlyRate} Kz</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>{hours} hours</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Subtotal</Text>
              <Text style={styles.detailValue}>{subtotal} Kz</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Platform Fee (10%)</Text>
              <Text style={styles.detailValue}>{platformFee} Kz</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount to Cleaner</Text>
              <Text style={styles.detailValue}>{cleanerAmount} Kz</Text>
            </View>
            <View style={styles.divider} />

            <View style={[styles.detailRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>{totalAmount} Kz</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.mobileMoneyButton}
          onPress={() => Alert.alert('Mobile Money', 'This feature will be available soon!')}
        >
          <Text style={styles.mobileMoneyText}>💳 Pay with Mobile Money</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handlePayment}
        >
          <Text style={styles.confirmButtonText}>✅ Confirm Payment</Text>
        </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  section: {
    padding: 24,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  cleanerCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cleanerName: {
    fontSize: 24,
    fontWeight: '700',
  },
  ratingContainer: {
    backgroundColor: '#FFF9C4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
  },
  detailsCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  mobileMoneyButton: {
    marginHorizontal: 24,
    marginBottom: 16,
    height: 56,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  mobileMoneyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
  },
  confirmButton: {
    margin: 24,
    marginTop: 8,
    height: 56,
    backgroundColor: '#2ecc71',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 24,
    color: '#666',
  },
});