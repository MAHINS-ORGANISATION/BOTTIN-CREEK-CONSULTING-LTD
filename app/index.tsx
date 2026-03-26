import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { ONBOARDING_COMPLETE_KEY } from '@/constants/onboardingStorage';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function Index() {
  const scheme = useColorScheme() ?? 'light';
  const [hydrated, setHydrated] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
        if (!cancelled) {
          setOnboardingComplete(value === '1');
        }
      } catch {
        if (!cancelled) {
          setOnboardingComplete(false);
        }
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!hydrated) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
        }}>
        <ActivityIndicator size="large" color={Colors[scheme].tint} accessibilityLabel="Loading" />
      </View>
    );
  }

  if (!onboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(drawer)/(tabs)" />;
}
