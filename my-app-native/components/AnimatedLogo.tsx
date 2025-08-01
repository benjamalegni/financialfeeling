import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';

interface AnimatedLogoProps {
  size?: number;
  color?: 'red' | 'green';
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  size = 24, 
  color = 'red' 
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Only use native driver on native platforms
    const useNativeDriver = Platform.OS !== 'web';

    // Animación de rotación continua
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver,
      })
    );

    // Animación de pulso
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1500,
          useNativeDriver,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver,
        }),
      ])
    );

    // Animación de escala sutil
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 3000,
          useNativeDriver,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver,
        }),
      ])
    );

    rotateAnimation.start();
    pulseAnimation.start();
    scaleAnimation.start();

    return () => {
      rotateAnimation.stop();
      pulseAnimation.stop();
      scaleAnimation.stop();
    };
  }, [rotateAnim, pulseAnim, scaleAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const mainColor = color === 'red' ? '#ff4444' : '#44ff44';
  const secondaryColor = color === 'red' ? '#ff6666' : '#66ff66';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [
            { scale: Animated.multiply(scaleAnim, pulseAnim) },
            { rotate }
          ],
        },
      ]}
    >
      {/* Círculo exterior */}
      <View style={[styles.outerCircle, { borderColor: mainColor }]} />
      
      {/* Círculo interior */}
      <View style={[styles.innerCircle, { backgroundColor: secondaryColor }]} />
      
      {/* Líneas decorativas */}
      <View style={[styles.line1, { backgroundColor: mainColor }]} />
      <View style={[styles.line2, { backgroundColor: secondaryColor }]} />
      <View style={[styles.line3, { backgroundColor: mainColor }]} />
      
      {/* Punto central */}
      <View style={[styles.centerDot, { backgroundColor: mainColor }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  outerCircle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 50,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  innerCircle: {
    position: 'absolute',
    width: '60%',
    height: '60%',
    borderRadius: 50,
    opacity: 0.3,
  },
  line1: {
    position: 'absolute',
    width: '80%',
    height: 2,
    borderRadius: 1,
    top: '20%',
  },
  line2: {
    position: 'absolute',
    width: '60%',
    height: 2,
    borderRadius: 1,
    top: '40%',
  },
  line3: {
    position: 'absolute',
    width: '40%',
    height: 2,
    borderRadius: 1,
    top: '60%',
  },
  centerDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

export default AnimatedLogo; 