import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Palette, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';

type Props = {
  title: string;
  subtitle?: string;
};

export function ScreenHeader({ title, subtitle }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const openDrawer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const parent = navigation.getParent?.();
    if (parent) {
      parent.dispatch(DrawerActions.openDrawer());
    } else {
      navigation.dispatch(DrawerActions.openDrawer());
    }
  };

  return (
    <LinearGradient
      colors={[c.gradientStart, c.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, { paddingTop: insets.top + 8 }]}>
      <View pointerEvents="none" style={[styles.orb, styles.orbLarge, { backgroundColor: c.accent }]} />
      <View pointerEvents="none" style={[styles.orb, styles.orbSmall, { backgroundColor: c.accentWarm }]} />
      <View style={styles.row}>
        <Pressable
          onPress={openDrawer}
          style={({ pressed }) => [
            styles.menuBtn,
            {
              opacity: pressed ? 0.85 : 1,
              borderColor: 'rgba(196,163,90,0.35)',
              backgroundColor: 'rgba(255,255,255,0.12)',
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Open menu">
          <Ionicons name="menu" size={26} color={Palette.cream} />
        </Pressable>
        <View style={styles.titles}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={styles.spacer} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    paddingHorizontal: 16,
    paddingBottom: 18,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuBtn: {
    width: 46,
    height: 46,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  titles: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontFamily: 'CormorantGaramond_700Bold',
    color: Palette.cream,
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: 'rgba(247,244,236,0.75)',
    lineHeight: 18,
    fontFamily: 'DMSans_400Regular',
  },
  spacer: {
    width: 46,
  },
  orb: {
    position: 'absolute',
    opacity: 0.18,
    borderRadius: 999,
  },
  orbLarge: {
    width: 180,
    height: 180,
    right: -40,
    top: -60,
  },
  orbSmall: {
    width: 90,
    height: 90,
    right: 40,
    top: 10,
  },
});
