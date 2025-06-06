import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Wallet } from 'lucide-react-native';

const AMOUNTS = [
  { value: 5000, label: '5,000 Kz' },
  { value: 10000, label: '10,000 Kz' },
  { value: 20000, label: '20,000 Kz' },
  { value: 50000, label: '50,000 Kz' },
];

export default function LoadCredits() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const handleLoadCredits = () => {
    if (selectedAmount) {
      // Here you would typically integrate with a payment gateway
      router.back();
    }
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
        <Text style={styles.headerTitle}>Load Credits</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.walletCard}>
          <Wallet size={32} color="#2ecc71" />
          <Text style={styles.currentBalance}>Current Balance</Text>
          <Text style={styles.balanceAmount}>15,000 Kz</Text>
        </View>

        <Text style={styles.sectionTitle}>Select Amount</Text>
        <View style={styles.amountGrid}>
          {AMOUNTS.map((amount) => (
            <TouchableOpacity
              key={amount.value}
              style={[
                styles.amountButton,
                selectedAmount === amount.value && styles.amountButtonSelected
              ]}
              onPress={() => setSelectedAmount(amount.value)}
            >
              <Text style={[
                styles.amountText,
                selectedAmount === amount.value && styles.amountTextSelected
              ]}>
                {amount.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.paymentMethods}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity style={styles.paymentButton}>
            <Text style={styles.paymentButtonText}>💳 Credit Card</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentButton}>
            <Text style={styles.paymentButtonText}>📱 Mobile Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentButton}>
            <Text style={styles.paymentButtonText}>🏦 Bank Transfer</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.loadButton,
            !selectedAmount && styles.loadButtonDisabled
          ]}
          onPress={handleLoadCredits}
          disabled={!selectedAmount}
        >
          <Text style={styles.loadButtonText}>
            Load {selectedAmount ? `${selectedAmount.toLocaleString()} Kz` : 'Credits'}
          </Text>
        </TouchableOpacity>
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
  walletCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  currentBalance: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2ecc71',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  amountButton: {
    width: '48%',
    backgroundColor: '#f1f3f5',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  amountButtonSelected: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#3498db',
  },
  amountText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  amountTextSelected: {
    color: '#3498db',
  },
  paymentMethods: {
    marginBottom: 30,
  },
  paymentButton: {
    backgroundColor: '#f1f3f5',
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
  },
  paymentButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  loadButton: {
    backgroundColor: '#2ecc71',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  loadButtonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  loadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});