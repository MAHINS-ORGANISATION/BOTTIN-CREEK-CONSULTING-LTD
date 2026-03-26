import { Ionicons } from '@expo/vector-icons';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, type Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppScreenCanvas } from '@/components/AppScreenCanvas';
import { AppImages } from '@/constants/appImages';
import { COMPANY } from '@/constants/company';
import { Colors, Palette, Radius, Spacing } from '@/constants/theme';
import { useProfile } from '@/context/ProfileContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';

const BRAND_LOGO = require('@/assets/images/logo.png');

type Item = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: string;
};

const ITEMS: Item[] = [
  { key: 'profile', label: 'Profile', icon: 'person-circle-outline', href: '/(drawer)/profile' },
  { key: 'settings', label: 'Settings', icon: 'settings-outline', href: '/(drawer)/settings' },
  { key: 'privacy', label: 'Privacy policy', icon: 'shield-checkmark-outline', href: '/(drawer)/privacy' },
  { key: 'info', label: 'App info', icon: 'information-circle-outline', href: '/(drawer)/app-info' },
  { key: 'about', label: 'About the firm', icon: 'people-outline', href: '/(drawer)/about' },
];

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const { profile } = useProfile();
  const insets = useSafeAreaInsets();

  const go = (href: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    props.navigation.closeDrawer();
    router.push(href as Href);
  };

  return (
    <AppScreenCanvas contentStyle={{ paddingTop: insets.top }}>
      <View style={styles.heroWrap}>
        <Image source={AppImages.drawerHero} style={styles.heroImage} contentFit="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(10,22,40,0.92)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroText}>
          <View style={styles.heroProfileRow}>
            <View style={styles.logoBadgeOuter}>
              <LinearGradient
                colors={['#fdfcfa', '#f0ebe3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoBadgeInner}>
                <View style={styles.logoImagePad}>
                  <Image source={BRAND_LOGO} style={styles.logoImage} contentFit="contain" />
                </View>
              </LinearGradient>
            </View>
            <View style={styles.heroTitles}>
              <View style={styles.heroNameRow}>
                <Text style={styles.heroEmoji}>{profile?.emoji ?? '👤'}</Text>
                <Text style={styles.heroName} numberOfLines={1}>
                  {profile?.fullName?.trim() ? profile.fullName : 'Guest'}
                </Text>
              </View>
              <Text style={styles.heroCo} numberOfLines={2}>
                {COMPANY.legalName}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + Spacing.lg }]}
        showsVerticalScrollIndicator={false}>
        {ITEMS.map((item) => (
          <Pressable
            key={item.key}
            onPress={() => go(item.href)}
            style={({ pressed }) => [
              styles.row,
              {
                backgroundColor: pressed ? c.cardMuted : c.card,
                borderColor: c.border,
              },
            ]}>
            <View style={[styles.iconWrap, { backgroundColor: c.cardMuted }]}>
              <Ionicons name={item.icon} size={22} color={Palette.brass} />
            </View>
            <Text style={[styles.rowLabel, { color: c.text }]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={c.icon} />
          </Pressable>
        ))}
      </ScrollView>
    </AppScreenCanvas>
  );
}

const styles = StyleSheet.create({
  heroWrap: {
    height: 200,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroText: {
    padding: Spacing.md,
  },
  heroProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  logoBadgeOuter: {
    width: 96,
    height: 96,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(196,163,90,0.9)',
    overflow: 'hidden',
    backgroundColor: 'rgba(10,22,40,0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 8,
  },
  logoBadgeInner: {
    width: '100%',
    height: '100%',
  },
  logoImagePad: {
    width: '100%',
    height: '100%',
    padding: 2,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  heroTitles: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  heroNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroEmoji: {
    fontSize: 22,
  },
  heroName: {
    flex: 1,
    fontSize: 19,
    fontFamily: 'DMSans_700Bold',
    color: Palette.cream,
  },
  heroCo: {
    fontSize: 11,
    color: 'rgba(247,244,236,0.82)',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  list: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
});
