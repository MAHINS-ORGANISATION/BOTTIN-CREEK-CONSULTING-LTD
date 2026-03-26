import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { SubScreenChrome } from '@/components/SubScreenChrome';
import { AppImages } from '@/constants/appImages';
import { COMPANY } from '@/constants/company';
import { Colors, Palette, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AboutDrawerScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  return (
    <SubScreenChrome title="About the firm">
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: Spacing.xxl }]}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(500)}>
          <View style={styles.hero}>
            <Image source={AppImages.aboutTeam} style={StyleSheet.absoluteFill} contentFit="cover" />
            <LinearGradient colors={['transparent', 'rgba(10,22,40,0.95)']} style={StyleSheet.absoluteFill} />
            <Text style={styles.heroCap}>People first</Text>
            <Text style={styles.heroHead}>A consultancy built for judgment, not jargon</Text>
          </View>
        </Animated.View>

        <Text style={[styles.body, { color: c.textSecondary }]}>
          {COMPANY.shortAbout} We collaborate with founders, boards, and operators who need dependable legal
          perspective without losing momentum.
        </Text>

        <View style={[styles.values, { backgroundColor: c.card, borderColor: c.border }]}>
          {[
            { t: 'Integrity', d: 'We say what we mean and document what we promise.' },
            { t: 'Discretion', d: 'Sensitive matters stay carefully bounded.' },
            { t: 'Pragmatism', d: 'Advice should be executable—not theoretical.' },
          ].map((v) => (
            <View key={v.t} style={[styles.valueRow, { borderBottomColor: c.border }]}>
              <Text style={[styles.valueTitle, { color: c.text }]}>{v.t}</Text>
              <Text style={[styles.valueBody, { color: c.textSecondary }]}>{v.d}</Text>
            </View>
          ))}
        </View>

        <LinearGradient
          colors={[Palette.navyMid, Palette.navy]}
          style={styles.banner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <Text style={styles.bannerText}>
            Bottin Consult is the client-facing experience of {COMPANY.legalName}. This app does not collect analytics
            or personal data beyond what you choose to store locally on your device.
          </Text>
        </LinearGradient>
      </ScrollView>
    </SubScreenChrome>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, gap: Spacing.lg },
  hero: {
    height: 240,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: Spacing.lg,
  },
  heroCap: { color: Palette.brass, fontSize: 12, letterSpacing: 2, fontFamily: 'DMSans_700Bold' },
  heroHead: {
    color: Palette.cream,
    fontSize: 26,
    fontFamily: 'CormorantGaramond_700Bold',
    marginTop: Spacing.sm,
    lineHeight: 30,
  },
  body: { fontSize: 16, lineHeight: 24, fontFamily: 'DMSans_400Regular' },
  values: { borderRadius: Radius.xl, borderWidth: 1, overflow: 'hidden' },
  valueRow: { padding: Spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, gap: 6 },
  valueTitle: { fontSize: 17, fontFamily: 'DMSans_700Bold' },
  valueBody: { fontSize: 14, lineHeight: 20, fontFamily: 'DMSans_400Regular' },
  banner: { borderRadius: Radius.lg, padding: Spacing.lg },
  bannerText: { color: 'rgba(247,244,236,0.9)', fontSize: 14, lineHeight: 21, fontFamily: 'DMSans_400Regular' },
});
