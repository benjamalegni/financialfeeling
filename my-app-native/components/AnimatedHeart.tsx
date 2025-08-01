import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface AnimatedHeartProps {
  size?: number;
}

const AnimatedHeart: React.FC<AnimatedHeartProps> = ({ size = 24 }) => {
  const colorAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animación de cambio de color (rojo a verde)
    const colorAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ])
    );

    // Animación de pulso
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Animación de escala sutil
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    colorAnimation.start();
    pulseAnimation.start();
    scaleAnimation.start();

    return () => {
      colorAnimation.stop();
      pulseAnimation.stop();
      scaleAnimation.stop();
    };
  }, [colorAnim, pulseAnim, scaleAnim]);

  const interpolatedColor = colorAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#ff4444', '#ffaa00', '#44ff44'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [
            { scale: Animated.multiply(scaleAnim, pulseAnim) }
          ],
        },
      ]}
    >
      <Animated.Text
        style={[
          styles.heart,
          {
            fontSize: size,
            color: interpolatedColor,
          },
        ]}
      >
        ❤️
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heart: {
    textAlign: 'center',
  },
});

export default AnimatedHeart; 