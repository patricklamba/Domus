import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
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
                onPress={() => router.push('/login')}
              >
                <Text style={styles.buttonText}>🔵 Log In</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.registerButton]}
                onPress={() => router.push('/register')}
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