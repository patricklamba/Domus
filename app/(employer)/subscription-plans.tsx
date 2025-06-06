import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Crown, Check, ArrowLeft } from 'lucide-react-native';

const PLANS = [
  {
    id: 'gold',
    name: 'Gold',
    price: '5,000',
    color: '#FFD700',
    features: [
      'Priority Support',
      'Booking History',
      'Basic Analytics',
      '5% Discount on Services',
    ],
  },
  {
    id: 'diamond',
    name: 'Diamond',
    price: '10,000',
    color: '#B9F2FF',
    features: [
      '24/7 Priority Support',
      'Advanced Analytics',
      'Exclusive Cleaners',
      '10% Discount on Services',
      'Flexible Scheduling',
      'Premium Features',
    ],
  },
  {
    id: 'ruby',
    name: 'Ruby',
    price: '7,500',
    color: '#E0115F',
    features: [
      'Premium Support',
      'Enhanced Analytics',
      'Priority Booking',
      '7% Discount on Services',
      'Advanced Features',
    ],
  },
];

export default function SubscriptionPlans() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription Plans</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>
          Choose the perfect plan for your cleaning needs
        </Text>

        {PLANS.map((plan) => (
          <View 
            key={plan.id}
            style={[
              styles.planCard,
              { borderColor: plan.color }
            ]}
          >
            <View style={[styles.planHeader, { backgroundColor: plan.color }]}>
              <Crown size={24} color="#fff" />
              <Text style={styles.planName}>{plan.name}</Text>
            </View>

            <View style={styles.planContent}>
              <Text style={styles.planPrice}>
                {plan.price} <Text style={styles.currency}>Kz</Text>
              </Text>
              <Text style={styles.periodText}>per month</Text>

              <View style={styles.featuresList}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Check size={16} color="#2ecc71" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity 
                style={[styles.selectButton, { backgroundColor: plan.color }]}
                onPress={() => {
                  // Handle subscription selection
                  router.back();
                }}
              >
                <Text style={styles.selectButtonText}>Select Plan</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    overflow: 'hidden',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 10,
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  planContent: {
    padding: 20,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
  },
  currency: {
    fontSize: 20,
  },
  periodText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
  },
  selectButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});