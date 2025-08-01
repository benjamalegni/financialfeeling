import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { supabase } from '../src/lib/supabaseClient';
import Header from '../components/Header';
import { router } from 'expo-router';

export default function DashboardScreen() {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    console.log('DashboardScreen: Component mounted');
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <Header compact={true} />
      <ScrollView style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            Welcome back, {user?.email || 'User'}!
          </Text>
          <Text style={styles.subtitle}>
            Your financial insights are ready
          </Text>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/select-assets')}
          >
            <Text style={styles.menuItemTitle}>Select Assets</Text>
            <Text style={styles.menuItemSubtitle}>Choose your investment preferences</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/ia-analysis')}
          >
            <Text style={styles.menuItemTitle}>AI Analysis</Text>
            <Text style={styles.menuItemSubtitle}>Get intelligent investment insights</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/pricing')}
          >
            <Text style={styles.menuItemTitle}>Pricing</Text>
            <Text style={styles.menuItemSubtitle}>View subscription plans</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  menuSection: {
    marginBottom: 40,
  },
  menuItem: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  signOutButton: {
    backgroundColor: '#ff4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 