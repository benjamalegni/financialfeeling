import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert 
} from 'react-native';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
}

const PricingScreen = ({ navigation }: any) => {
  const pricingPlans: PricingPlan[] = [
    {
      id: '1',
      name: 'Free',
      price: '$0',
      period: 'month',
      features: [
        'Track up to 5 assets',
        'Basic market data',
        'Email support',
        'Mobile app access'
      ]
    },
    {
      id: '2',
      name: 'Pro',
      price: '$9.99',
      period: 'month',
      features: [
        'Track unlimited assets',
        'Advanced market data',
        'AI-powered analysis',
        'Priority support',
        'Real-time alerts',
        'Portfolio analytics'
      ],
      popular: true
    },
    {
      id: '3',
      name: 'Enterprise',
      price: '$29.99',
      period: 'month',
      features: [
        'Everything in Pro',
        'Custom integrations',
        'Dedicated support',
        'Advanced reporting',
        'API access',
        'White-label options'
      ]
    }
  ];

  const handleSubscribe = (plan: PricingPlan) => {
    Alert.alert(
      'Subscribe to ' + plan.name,
      `You selected the ${plan.name} plan for ${plan.price}/${plan.period}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Subscribe', 
          onPress: () => {
            Alert.alert('Success', 'Subscription feature coming soon!');
          }
        }
      ]
    );
  };

  const PricingCard = ({ plan }: { plan: PricingPlan }) => (
    <View style={[
      styles.pricingCard,
      plan.popular && styles.popularCard
    ]}>
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>Most Popular</Text>
        </View>
      )}
      
      <Text style={styles.planName}>{plan.name}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{plan.price}</Text>
        <Text style={styles.period}>/{plan.period}</Text>
      </View>
      
      <View style={styles.featuresList}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Text style={styles.featureText}>✓ {feature}</Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity
        style={[
          styles.subscribeButton,
          plan.popular && styles.popularButton
        ]}
        onPress={() => handleSubscribe(plan)}
      >
        <Text style={styles.subscribeButtonText}>
          {plan.name === 'Free' ? 'Get Started' : 'Subscribe'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Pricing Plans</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Choose Your Plan</Text>
          <Text style={styles.infoText}>
            Select the perfect plan for your financial tracking needs. All plans include our core features with different levels of advanced functionality.
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Can I change my plan later?</Text>
            <Text style={styles.faqAnswer}>
              Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Is there a free trial?</Text>
            <Text style={styles.faqAnswer}>
              Yes, all paid plans come with a 7-day free trial. You can cancel anytime during the trial period.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>What payment methods do you accept?</Text>
            <Text style={styles.faqAnswer}>
              We accept all major credit cards, PayPal, and Apple Pay for mobile subscriptions.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 50,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoSection: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  infoText: {
    color: '#999',
    lineHeight: 20,
  },
  plansContainer: {
    marginBottom: 30,
  },
  pricingCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
    position: 'relative',
  },
  popularCard: {
    borderColor: '#007AFF',
    backgroundColor: '#1a3a5a',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  popularText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  period: {
    fontSize: 16,
    color: '#999',
    marginLeft: 5,
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    marginBottom: 8,
  },
  featureText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  subscribeButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  popularButton: {
    backgroundColor: '#28a745',
  },
  subscribeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  faqSection: {
    marginBottom: 20,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  faqItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  faqAnswer: {
    color: '#999',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default PricingScreen; 