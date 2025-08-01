import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../src/lib/supabaseClient';

export default function Index() {
  useEffect(() => {
    console.log('Index: Component mounted');
    
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Index: Session check:', session ? 'Found' : 'None');
      
      if (session) {
        console.log('Index: Redirecting to dashboard');
        router.replace('/dashboard');
      } else {
        console.log('Index: Redirecting to login');
        router.replace('/login');
      }
    };

    checkSession();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
}); 