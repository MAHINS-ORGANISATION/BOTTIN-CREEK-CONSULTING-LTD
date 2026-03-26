import 'react-native-gesture-handler';

import {
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from '@expo-google-fonts/cormorant-garamond';
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppScreenCanvas } from '@/components/AppScreenCanvas';
import { Colors, Palette } from '@/constants/theme';
import { CartProvider } from '@/context/CartContext';
import { PreferencesProvider, usePreferences } from '@/context/PreferencesContext';
import { ProfileProvider } from '@/context/ProfileContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

const LightNav = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Palette.brass,
    background: Colors.light.backgroundTop,
    card: '#ffffff',
    text: Palette.ink,
    border: 'rgba(10,22,40,0.08)',
    notification: Palette.brass,
  },
};

const DarkNav = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Palette.brass,
    background: Colors.dark.backgroundTop,
    card: Palette.navyMid,
    text: Palette.cream,
    border: 'rgba(247,244,236,0.1)',
    notification: Palette.brass,
  },
};

function NavTheme({ children }: { children: React.ReactNode }) {
  const { resolvedScheme } = usePreferences();
  return (
    <ThemeProvider value={resolvedScheme === 'dark' ? DarkNav : LightNav}>
      {children}
      <StatusBar style={resolvedScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

function RootLayoutInner() {
  const { resolvedScheme } = usePreferences();
  const stackBackground = Colors[resolvedScheme].backgroundTop;
  const [fontsLoaded] = useFonts({
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavTheme>
      <AppScreenCanvas>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { flex: 1, backgroundColor: stackBackground },
          }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(drawer)" />
        </Stack>
      </AppScreenCanvas>
    </NavTheme>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PreferencesProvider>
        <ProfileProvider>
          <CartProvider>
            <RootLayoutInner />
          </CartProvider>
        </ProfileProvider>
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}

export const unstable_settings = {
  initialRouteName: 'index',
};
