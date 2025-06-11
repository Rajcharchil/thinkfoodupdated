import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useSegments } from 'expo-router';
import { ChefHat, Coffee, Heart, Utensils } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const segments = useSegments();
  const { colors } = useTheme();
  const { user, initialized } = useAuth();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const loadingAnim = useRef(new Animated.Value(0)).current;

  // Food icon animations
  const foodAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    let isMounted = true;

    const startAnimations = async () => {
      // Main logo animation
      await new Promise(resolve => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]).start(resolve);
      });

      // Loading bar animation
      Animated.timing(loadingAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }).start();

      // Floating animation for food icons
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Staggered animation for food icons
      await new Promise(resolve => {
        Animated.stagger(
          200,
          foodAnimations.map(anim =>
            Animated.spring(anim, {
              toValue: 1,
              friction: 8,
              tension: 40,
              useNativeDriver: true,
            })
          )
        ).start(resolve);
      });

      // Wait for 2 seconds after animations complete
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (isMounted) {
        // Fade out animation
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(async () => {
          if (isMounted) {
            try {
              // Check if it's first time opening the app
              const hasOpenedBefore = await AsyncStorage.getItem('hasOpenedBefore');
              
              if (!hasOpenedBefore) {
                // First time opening the app
                await AsyncStorage.setItem('hasOpenedBefore', 'true');
                router.replace('/(auth)/signup');
              } else if (user) {
                // User is logged in
                router.replace('/(tabs)');
              } else {
                // User has opened before but not logged in
                router.replace('/(auth)/signup');
              }
            } catch (error) {
              console.error('Error checking first time status:', error);
              // Fallback to signup if there's an error
              router.replace('/(auth)/signup');
            }
          }
        });
      }
    };

    startAnimations();

    return () => {
      isMounted = false;
    };
  }, []);

  const floatInterpolation = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const loadingWidth = loadingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <LinearGradient
      colors={[colors.primary, colors.background]}
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
                { translateY: slideAnim }
              ]
            }
          ]}
        >
          <Text style={[styles.logo, { color: colors.text }]}>ThinkFood</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            Delicious food at your doorstep
          </Text>
        </Animated.View>

        <View style={styles.foodIconsContainer}>
          {[
            { Icon: ChefHat, delay: 0 },
            { Icon: Utensils, delay: 1 },
            { Icon: Coffee, delay: 2 },
            { Icon: Heart, delay: 3 },
          ].map(({ Icon, delay }, index) => (
            <Animated.View
              key={index}
              style={[
                styles.foodIcon,
                {
                  opacity: foodAnimations[index],
                  transform: [
                    { translateY: floatInterpolation },
                    { scale: foodAnimations[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    })}
                  ]
                }
              ]}
            >
              <Icon size={32} color={colors.text} />
            </Animated.View>
          ))}
        </View>

        <View style={styles.loadingContainer}>
          <View style={[styles.loadingBar, { backgroundColor: colors.border }]}>
            <Animated.View 
              style={[
                styles.loadingProgress,
                { 
                  width: loadingWidth,
                  backgroundColor: colors.primary 
                }
              ]} 
            />
          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    textAlign: 'center',
  },
  foodIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 40,
  },
  foodIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    width: '80%',
    alignItems: 'center',
  },
  loadingBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    borderRadius: 2,
  },
}); 