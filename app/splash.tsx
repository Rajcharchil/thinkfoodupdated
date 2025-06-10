import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ChefHat, Coffee, Heart, Utensils } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const { user, loading } = useAuth();
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Food icons animation values
  const icon1Anim = useRef(new Animated.Value(0)).current;
  const icon2Anim = useRef(new Animated.Value(0)).current;
  const icon3Anim = useRef(new Animated.Value(0)).current;
  const icon4Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo fade in and scale up animation
    const logoAnimation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
    ]);

    // Text slide up animation
    const textAnimation = Animated.timing(slideAnim, {
      toValue: 0,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    // Logo pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Food icons floating animation
    const iconsAnimation = Animated.stagger(200, [
      Animated.loop(
        Animated.sequence([
          Animated.timing(icon1Anim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(icon1Anim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(icon2Anim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(icon2Anim, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(icon3Anim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(icon3Anim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(icon4Anim, {
            toValue: 1,
            duration: 2200,
            useNativeDriver: true,
          }),
          Animated.timing(icon4Anim, {
            toValue: 0,
            duration: 2200,
            useNativeDriver: true,
          }),
        ])
      ),
    ]);

    // Start all animations
    logoAnimation.start();
    textAnimation.start();
    
    setTimeout(() => {
      pulseAnimation.start();
      iconsAnimation.start();
    }, 1000);

    // Navigate after animation
    const timer = setTimeout(() => {
      if (!loading) {
        if (user) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/login');
        }
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [loading, user]);

  return (
    <LinearGradient
      colors={[colors.background, colors.gray[100]]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  })
                },
              ],
            },
          ]}
        >
          <ChefHat size={80} color={colors.primary} />
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>FoodHub</Text>
          <Text style={[styles.subtitle, { color: colors.gray[600] }]}>
            Delicious food at your doorstep
          </Text>
        </Animated.View>

        {/* Floating food icons */}
        <View style={styles.iconsContainer}>
          <Animated.View
            style={[
              styles.iconWrapper,
              {
                transform: [
                  {
                    translateY: icon1Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -20],
                    }),
                  },
                ],
              },
            ]}
          >
            <Utensils size={24} color={colors.primary} />
          </Animated.View>

          <Animated.View
            style={[
              styles.iconWrapper,
              {
                transform: [
                  {
                    translateY: icon2Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -15],
                    }),
                  },
                ],
              },
            ]}
          >
            <Coffee size={24} color={colors.primary} />
          </Animated.View>

          <Animated.View
            style={[
              styles.iconWrapper,
              {
                transform: [
                  {
                    translateY: icon3Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -25],
                    }),
                  },
                ],
              },
            ]}
          >
            <Heart size={24} color={colors.primary} />
          </Animated.View>

          <Animated.View
            style={[
              styles.iconWrapper,
              {
                transform: [
                  {
                    translateY: icon4Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -18],
                    }),
                  },
                ],
              },
            ]}
          >
            <ChefHat size={24} color={colors.primary} />
          </Animated.View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  iconsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});