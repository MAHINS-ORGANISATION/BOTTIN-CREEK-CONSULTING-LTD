import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppScreenCanvas } from '@/components/AppScreenCanvas';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';

type Props = {
  title: string;
  children: React.ReactNode;
};

export function SubScreenChrome({ title, children }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const insets = useSafeAreaInsets();

  const back = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    try {
      if (router.canGoBack?.()) {
        router.back();
        return;
      }
    } catch {
      /* fall through */
    }
    router.replace('/(drawer)/(tabs)');
  };

  return (
    <AppScreenCanvas contentStyle={{ paddingTop: insets.top }}>
      <View style={[styles.bar, { borderBottomColor: c.border }]}>
        <Pressable
          onPress={back}
          style={({ pressed }) => [styles.back, { opacity: pressed ? 0.75 : 1, backgroundColor: c.cardMuted }]}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={24} color={c.text} />
        </Pressable>
        <Text style={[styles.title, { color: c.text }]} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.back} />
      </View>
      <View style={[styles.body, { paddingBottom: insets.bottom }]}>{children}</View>
    </AppScreenCanvas>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    minHeight: 0,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.sm,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'DMSans_700Bold',
    textAlign: 'center',
  },
});
