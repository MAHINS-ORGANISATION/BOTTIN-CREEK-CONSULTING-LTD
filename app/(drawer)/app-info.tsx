import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SubScreenChrome } from '@/components/SubScreenChrome';
import { COMPANY } from '@/constants/company';
import { Colors, Palette, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const BRAND_LOGO = require('@/assets/images/logo.png');

export default function AppInfoScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <SubScreenChrome title="App info">
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: Spacing.xxl }]}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={[styles.logoFrame, { borderColor: Palette.brass }]}>
            <LinearGradient
              colors={
                scheme === 'dark'
                  ? ['rgba(196,163,90,0.2)', 'rgba(10,22,40,0.5)']
                  : ['rgba(196,163,90,0.12)', 'rgba(247,244,236,0.9)']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoFrameGrad}>
              <Image source={BRAND_LOGO} style={styles.logo} contentFit="contain" />
            </LinearGradient>
          </View>
          <Text style={[styles.name, { color: c.text }]}>{COMPANY.appName}</Text>
          <Text style={[styles.co, { color: c.textSecondary }]}>{COMPANY.legalName}</Text>
          <Text style={[styles.ver, { color: c.textSecondary }]}>Version {version}</Text>
        </View>
        <Text style={[styles.p, { color: c.textSecondary }]}>
          Crafted as a calm, editorial companion to {COMPANY.legalName}. Typography: Cormorant Garamond & DM Sans. Icons:
          Ionicons via Expo.
        </Text>
        <Text style={[styles.p, { color: c.textSecondary }]}>
          This application does not include third-party analytics or crash reporters in its default configuration. Profile,
          theme, and cart state are held in memory only for your current session and are not written to persistent storage
          by the app.
        </Text>
      </ScrollView>
    </SubScreenChrome>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, gap: Spacing.md },
  hero: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoFrame: {
    borderRadius: 28,
    borderWidth: 2,
    padding: 3,
    overflow: 'hidden',
    shadowColor: '#0a1628',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  logoFrameGrad: {
    width: 112,
    height: 112,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
  },
  logo: {
    width: 88,
    height: 88,
  },
  name: { fontSize: 24, fontFamily: 'CormorantGaramond_700Bold', marginTop: Spacing.xs },
  co: { fontSize: 13, textAlign: 'center', fontFamily: 'DMSans_500Medium' },
  ver: { fontSize: 13, fontFamily: 'DMSans_400Regular', marginTop: 4 },
  p: { fontSize: 15, lineHeight: 24, fontFamily: 'DMSans_400Regular' },
});
