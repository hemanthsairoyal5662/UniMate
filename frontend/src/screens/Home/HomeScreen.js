import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();

  const modules = [
    { 
      id: 1, 
      name: 'Marketplace', 
      icon: '🛒', 
      description: 'Buy & sell goods',
      screen: 'Marketplace'
    },
    { 
      id: 2, 
      name: 'Services', 
      icon: '💼', 
      description: 'Exchange skills',
      screen: 'Services'
    },
    { 
      id: 3, 
      name: 'Campus Feed', 
      icon: '📢', 
      description: 'Stay updated',
      screen: 'Feed'
    },
    { 
      id: 4, 
      name: 'Finance', 
      icon: '💰', 
      description: 'Manage expenses',
    },
    { 
      id: 5, 
      name: 'Housing', 
      icon: '🏠', 
      description: 'Find accommodation',
    },
    { 
      id: 6, 
      name: 'Commute', 
      icon: '🚗', 
      description: 'Share rides',
    },
    { 
      id: 7, 
      name: 'Timetable', 
      icon: '📅', 
      description: 'AI-powered schedule',
    },
    { 
      id: 8, 
      name: 'Rewards', 
      icon: '🏆', 
      description: 'Earn points',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.name}! 👋</Text>
          <Text style={styles.subGreeting}>Welcome to UniMate</Text>
          <View style={styles.pointsCard}>
            <Text style={styles.pointsLabel}>Reward Points</Text>
            <Text style={styles.pointsValue}>{user?.rewardPoints || 0}</Text>
          </View>
        </View>

        <View style={styles.modulesContainer}>
          <Text style={styles.sectionTitle}>Explore Modules</Text>
          <View style={styles.modulesGrid}>
            {modules.map((module) => (
              <TouchableOpacity
                key={module.id}
                style={styles.moduleCard}
                onPress={() => module.screen && navigation.navigate(module.screen)}
              >
                <Text style={styles.moduleIcon}>{module.icon}</Text>
                <Text style={styles.moduleName}>{module.name}</Text>
                <Text style={styles.moduleDescription}>{module.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  pointsCard: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  pointsLabel: {
    color: '#e0e7ff',
    fontSize: 14,
    marginBottom: 4,
  },
  pointsValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  modulesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moduleCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moduleIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  moduleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default HomeScreen;
