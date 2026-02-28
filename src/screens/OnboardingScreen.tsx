import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useThemeStore } from '../stores';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Welcome to Universal Health',
    description: 'Your personal digital twin that mirrors your biological state in real-time',
    icon: '🏥',
  },
  {
    id: '2',
    title: 'Connect Your Devices',
    description: 'Sync with Apple Health, Google Fit, Garmin, Oura, and more to aggregate all your health data',
    icon: '📱',
  },
  {
    id: '3',
    title: 'Track Your Progress',
    description: 'Monitor your biometrics, sleep, activity, and get AI-powered insights to improve your health',
    icon: '📊',
  },
  {
    id: '4',
    title: 'Stay Motivated',
    description: 'Earn rewards, complete challenges, and compete with friends on the leaderboard',
    icon: '🏆',
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { colors } = useThemeStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={[styles.slide, { backgroundColor: colors.background }]}>
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {item.description}
      </Text>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: colors.primary,
              opacity: index === currentIndex ? 1 : 0.4,
              transform: [{ scale: index === currentIndex ? 1.2 : 1 }],
            },
          ]}
        />
      ))}
    </View>
  );

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({ x: (currentIndex + 1) * width, animated: true });
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  const renderButtons = () => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.skipButton}
        onPress={handleSkip}
      >
        <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: colors.primary }]}
        onPress={handleNext}
      >
        <Text style={styles.nextText}>
          {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.logo, { color: colors.primary }]}>UH</Text>
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
      >
        {slides.map((item) => (
          <View key={item.id} style={[styles.slide, { width }]}>
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {item.description}
            </Text>
          </View>
        ))}
      </ScrollView>
      
      {renderDots()}
      {renderButtons()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    alignItems: 'flex-end',
  },
  logo: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  icon: {
    fontSize: 80,
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZE.lg,
    textAlign: 'center',
    lineHeight: 28,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  skipButton: {
    padding: SPACING.md,
  },
  skipText: {
    fontSize: FONT_SIZE.md,
  },
  nextButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full,
  },
  nextText: {
    color: '#fff',
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
});

export default OnboardingScreen;
