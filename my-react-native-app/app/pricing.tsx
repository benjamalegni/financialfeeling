import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator, Linking, Alert } from 'react-native';
import { supabase } from '../lib/supabaseClient';

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string | null;
  features: string[];
  stripe_price_id: string | null;
  active: boolean;
  description: string | null;
}

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('active', true)
        .order('price', { ascending: true });

      if (error) {
        console.error('Error fetching plans:', error);
        setError('Could not fetch pricing plans. Please try again later.');
      } else {
        const formattedPlans = data.map(plan => ({
          ...plan,
          features: typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features || [],
        }));
        setPlans(formattedPlans);
      }
      setIsLoading(false);
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (plan: Plan) => {
    if (!plan.stripe_price_id) {
      Alert.alert('Not Available', 'This plan is not available for online subscription.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real app, you'd call your backend to create a Stripe Checkout session.
      // For this example, we'll simulate this and open a URL.
      // const response = await fetch('/api/stripe/create-checkout-session', { ... });
      // const sessionData = await response.json();
      // const { sessionUrl } = sessionData;

      // As we don't have a backend here, we'll use a placeholder URL.
      const sessionUrl = `https://your-backend.com/api/stripe/create-checkout-session?priceId=${plan.stripe_price_id}`;

      Alert.alert(
        'Redirecting to Stripe',
        `You will be redirected to complete your subscription for the ${plan.name} plan.`,
        [
          {
            text: 'Cancel',
            onPress: () => setIsLoading(false),
            style: 'cancel',
          },
          {
            text: 'Continue',
            onPress: async () => {
              const supported = await Linking.canOpenURL(sessionUrl);
              if (supported) {
                await Linking.openURL(sessionUrl);
              } else {
                Alert.alert('Error', `Don't know how to open this URL: ${sessionUrl}`);
              }
              setIsLoading(false);
            },
          },
        ]
      );

    } catch (err: any) {
      console.error('Subscription error:', err);
      setError(err.message || 'Could not initiate subscription. Please try again.');
      setIsLoading(false);
    }
  };

  if (isLoading && plans.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={styles.loadingText}>Loading pricing plans...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Choose Your Plan</Text>

      {plans.length === 0 && !isLoading && (
        <Text style={styles.centeredText}>No active plans available at the moment.</Text>
      )}

      {plans.map((plan) => (
        <View key={plan.id} style={styles.planCard}>
          <Text style={styles.planName}>{plan.name}</Text>
          {plan.description && <Text style={styles.planDescription}>{plan.description}</Text>}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${plan.price.toFixed(2)}</Text>
            <Text style={styles.interval}>{plan.interval ? `/ ${plan.interval}` : ''}</Text>
          </View>
          <View style={styles.featuresList}>
            {plan.features && plan.features.map((feature, index) => (
              <Text key={index} style={styles.featureItem}>• {feature}</Text>
            ))}
          </View>
          <Button
            title={plan.stripe_price_id ? (plan.price === 0 ? 'Get Started' : 'Subscribe') : 'Details'}
            onPress={() => handleSubscribe(plan)}
            disabled={!plan.stripe_price_id || isLoading}
            color="#1E90FF"
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 16,
  },
  loadingText: {
    marginTop: 10,
    color: '#FFF',
  },
  errorText: {
    color: '#FF6347',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E90FF',
    textAlign: 'center',
    marginBottom: 20,
  },
  centeredText: {
    color: '#AAA',
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
  planDescription: {
    color: '#AAA',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  interval: {
    color: '#AAA',
    marginLeft: 5,
  },
  featuresList: {
    marginVertical: 10,
  },
  featureItem: {
    color: '#FFF',
    marginBottom: 5,
  },
});
