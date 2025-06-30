import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      // User is authenticated, redirect to tabs
      router.replace('/(tabs)');
    }
  }, [user, loading]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Show landing page for unauthenticated users
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={{ uri: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg' }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.contentContainer}>
            <Text style={styles.emoji}>🏠</Text>
            <Text style={styles.title}>Domus Angola</Text>
            <Text style={styles.subtitle}>
              Find trusted home cleaners or get hired for cleaning jobs
            </Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.loginButton]} 
                onPress={() => router.push('/auth/login')}
              >
                <Text style={styles.buttonText}>🔵 Sign In</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.registerButton]}
                onPress={() => router.push('/auth/register')}
              >
                <Text style={styles.buttonText}>🟢 Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#3498db',
  },
  registerButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
});