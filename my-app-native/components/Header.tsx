import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';
import AnimatedLogo from './AnimatedLogo';

const { width } = Dimensions.get('window');

interface HeaderProps {
  showSubtitle?: boolean;
  compact?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showSubtitle = true, compact = false }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'MozillaHeadline': require('../assets/fonts/MozillaHeadline-Bold.ttf'),
      });
      setFontsLoaded(true);
    };
    
    loadFonts();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      // Only use native driver on native platforms
      const useNativeDriver = Platform.OS !== 'web';
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver,
        }),
      ]).start();
    }
  }, [fadeAnim, slideAnim, fontsLoaded]);

  return (
    <LinearGradient
      colors={['#1a1a1a', '#2a2a2a', '#1a1a1a']}
      style={[styles.container, compact && styles.containerCompact]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <View style={styles.logoContainer}>
          <View style={[styles.iconContainer, compact && styles.iconContainerCompact]}>
            <AnimatedLogo 
              size={compact ? 28 : 36} 
              color="red"
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={[
              styles.title, 
              compact && styles.titleCompact,
              { fontFamily: fontsLoaded ? 'MozillaHeadline' : 'System' }
            ]}>
              Financial
            </Text>
            <Text style={[
              styles.subtitle, 
              compact && styles.subtitleCompact,
              { fontFamily: fontsLoaded ? 'MozillaHeadline' : 'System' }
            ]}>
              Feeling
            </Text>
          </View>
        </View>
        
        {showSubtitle && !compact && (
          <Animated.View 
            style={[
              styles.subtitleContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={[
              styles.tagline,
              { fontFamily: fontsLoaded ? 'MozillaHeadline' : 'System' }
            ]}>
              Smart Investment Insights
            </Text>
            <View style={styles.decorativeLine} />
          </Animated.View>
        )}
      </Animated.View>
      
      {/* Decorative elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeLine1} />
      <View style={styles.decorativeLine2} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  containerCompact: {
    paddingTop: 30,
    paddingBottom: 15,
  },
  content: {
    alignItems: 'center',
    zIndex: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainerCompact: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  textContainer: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    color: '#ffffff', // Blanco
    letterSpacing: 2,
  },
  titleCompact: {
    fontSize: 24,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff', // Blanco
    letterSpacing: 1,
    marginTop: -5,
  },
  subtitleCompact: {
    fontSize: 28,
    marginTop: -3,
  },
  subtitleContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  tagline: {
    fontSize: 14,
    color: '#ffffff', // Naranja dorado
    fontWeight: '400',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  decorativeLine: {
    width: 60,
    height: 2,
    backgroundColor: '#FFD700', // Dorado
    marginTop: 8,
    borderRadius: 1,
    
  },
  // Decorative elements
  decorativeCircle1: {
    position: 'absolute',
    top: 20,
    right: 30,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.3)', // Dorado
  },
  decorativeCircle2: {
    position: 'absolute',
    top: 40,
    right: 50,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 165, 0, 0.2)', // Naranja dorado
  },
  decorativeLine1: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 30,
    height: 1,
    backgroundColor: 'rgba(255, 215, 0, 0.2)', // Dorado
    transform: [{ rotate: '45deg' }],
  },
  decorativeLine2: {
    position: 'absolute',
    top: 80,
    left: 40,
    width: 20,
    height: 1,
    backgroundColor: 'rgba(255, 165, 0, 0.3)', // Naranja dorado
    transform: [{ rotate: '-45deg' }],
  },
});

export default Header;
