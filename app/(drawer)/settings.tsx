import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SubScreenChrome } from '@/components/SubScreenChrome';
import { Colors, Palette, Radius, Spacing } from '@/constants/theme';
import { usePreferences, type ThemePreference } from '@/context/PreferencesContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';

const OPTIONS: { key: ThemePreference; label: string; hint: string }[] = [
  { key: 'system', label: 'System', hint: 'Match your device' },
  { key: 'light', label: 'Light', hint: 'Paper-bright surfaces' },
  { key: 'dark', label: 'Dark', hint: 'Midnight navy' },
];

export default function SettingsScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const { themePreference, setThemePreference } = usePreferences();

  return (
    <SubScreenChrome title="Settings">
      <View style={[styles.wrap, { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg }]}>
        <Text style={[styles.section, { color: c.textSecondary }]}>Appearance</Text>
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          {OPTIONS.map((opt) => {
            const active = themePreference === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => {
                  Haptics.selectionAsync();
                  setThemePreference(opt.key);
                }}
                style={({ pressed }) => [
                  styles.row,
                  { borderBottomColor: c.border, opacity: pressed ? 0.9 : 1 },
                ]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rowTitle, { color: c.text }]}>{opt.label}</Text>
                  <Text style={[styles.rowHint, { color: c.textSecondary }]}>{opt.hint}</Text>
                </View>
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: active ? Palette.brass : c.border,
                      backgroundColor: active ? Palette.brass : 'transparent',
                    },
                  ]}
                />
              </Pressable>
            );
          })}
        </View>
        <Text style={[styles.note, { color: c.textSecondary }]}>
          Appearance follows your choice for this session only; it is not saved when you close the app.
        </Text>
      </View>
    </SubScreenChrome>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  section: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontFamily: 'DMSans_700Bold',
    marginBottom: Spacing.sm,
  },
  card: { borderRadius: Radius.xl, borderWidth: 1, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.md,
  },
  rowTitle: { fontSize: 17, fontFamily: 'DMSans_700Bold' },
  rowHint: { fontSize: 13, marginTop: 2, fontFamily: 'DMSans_400Regular' },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
  },
  note: { marginTop: Spacing.lg, fontSize: 14, lineHeight: 20, fontFamily: 'DMSans_400Regular' },
});
