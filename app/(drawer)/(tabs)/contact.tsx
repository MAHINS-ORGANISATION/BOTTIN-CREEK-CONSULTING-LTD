import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { COMPANY } from '@/constants/company';
import { Colors, Palette, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTabScrollPaddingBottom } from '@/hooks/use-tab-scroll-padding';
import * as Haptics from 'expo-haptics';

const FAQ_ITEMS = [
  {
    id: '1',
    q: 'How do I request services?',
    a: 'Browse Services, add items to your order, complete your on-device profile, then confirm. You will receive a PDF summary you can keep for your records.',
  },
  {
    id: '2',
    q: 'Is my data stored in the cloud?',
    a: 'The app does not persist your profile or preferences to disk. Nothing is uploaded to our servers from the app itself. Email us when you are ready to engage formally.',
  },
  {
    id: '3',
    q: 'When will you reply to my email?',
    a: 'We aim to respond within one business day during service hours. Complex matters may need a short internal review first—we will say so in our reply.',
  },
  {
    id: '4',
    q: 'Does the app include pricing?',
    a: 'No. The app is for professional ordering and clarity only. Scope and next steps are discussed after we understand your needs.',
  },
  {
    id: '5',
    q: 'Can I use the PDF as a contract?',
    a: 'The order summary PDF is for your records and workflow. It is not a substitute for a signed engagement letter or formal agreement.',
  },
] as const;

export default function ContactTab() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const scrollPadBottom = useTabScrollPaddingBottom();
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const mail = () => {
    Haptics.selectionAsync().catch(() => {});
    Linking.openURL(`mailto:${COMPANY.email}?subject=${encodeURIComponent('Bottin Consult inquiry')}`);
  };

  const toggleFaq = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <View style={styles.root}>
      <ScreenHeader title="Contact" subtitle={COMPANY.legalName} />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: scrollPadBottom }]}
        showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[Palette.navy, Palette.navySoft]}
          style={styles.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <Text style={styles.heroKicker}>Get in touch</Text>
          <Text style={styles.heroTitle}>We reply by email—thoughtfully and on time.</Text>
          <Text style={styles.heroBody}>
            Use the address below for all enquiries. No phone or web form required here—just a direct line to our team.
          </Text>
        </LinearGradient>

        <Pressable
          onPress={mail}
          style={({ pressed }) => [
            styles.emailCard,
            {
              backgroundColor: c.card,
              borderColor: Palette.brass,
              opacity: pressed ? 0.94 : 1,
            },
          ]}>
          <LinearGradient
            colors={['rgba(196,163,90,0.12)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.emailIconWrap, { backgroundColor: c.cardMuted }]}>
            <Ionicons name="mail" size={26} color={Palette.brass} />
          </View>
          <View style={styles.emailTextCol}>
            <Text style={[styles.emailLabel, { color: c.textSecondary }]}>Email us</Text>
            <Text style={[styles.emailValue, { color: c.text }]}>{COMPANY.email}</Text>
            <Text style={[styles.emailHint, { color: c.icon }]}>Tap to open your mail app</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={Palette.brass} />
        </Pressable>

        <View style={[styles.hoursCard, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={[styles.hoursIconRing, { borderColor: Palette.brass }]}>
            <Ionicons name="time-outline" size={28} color={Palette.brass} />
          </View>
          <View style={styles.hoursTextCol}>
            <Text style={[styles.hoursTitle, { color: c.text }]}>Service hours</Text>
            <Text style={[styles.hoursLine, { color: c.textSecondary }]}>{COMPANY.hours}</Text>
            <Text style={[styles.hoursNote, { color: c.icon }]}>
              Messages outside these hours are queued for the next business day.
            </Text>
          </View>
        </View>

        <View style={styles.faqHeader}>
          <Text style={[styles.faqSectionTitle, { color: c.text }]}>Frequently asked</Text>
          <Text style={[styles.faqSectionSub, { color: c.textSecondary }]}>
            Quick answers before you write to us
          </Text>
        </View>

        {FAQ_ITEMS.map((item, index) => {
          const open = openFaqId === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => toggleFaq(item.id)}
              style={({ pressed }) => [
                styles.faqItem,
                {
                  backgroundColor: c.card,
                  borderColor: open ? Palette.brass : c.border,
                  opacity: pressed ? 0.97 : 1,
                },
              ]}>
              <View style={[styles.faqAccent, { backgroundColor: open ? Palette.brass : c.border }]} />
              <View style={styles.faqInner}>
                <View style={styles.faqQRow}>
                  <Text style={[styles.faqIndex, { color: Palette.brass }]}>{String(index + 1).padStart(2, '0')}</Text>
                  <Text style={[styles.faqQ, { color: c.text }]}>{item.q}</Text>
                  <Ionicons
                    name={open ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={c.icon}
                  />
                </View>
                {open ? (
                  <Text style={[styles.faqA, { color: c.textSecondary }]}>{item.a}</Text>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, gap: Spacing.md },
  hero: { borderRadius: Radius.xl, padding: Spacing.lg, gap: Spacing.sm },
  heroKicker: { color: Palette.brass, fontSize: 11, letterSpacing: 2, fontFamily: 'DMSans_700Bold' },
  heroTitle: {
    color: Palette.cream,
    fontSize: 24,
    fontFamily: 'CormorantGaramond_700Bold',
    lineHeight: 30,
  },
  heroBody: {
    color: 'rgba(247,244,236,0.82)',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'DMSans_400Regular',
    marginTop: 4,
  },
  emailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 2,
    overflow: 'hidden',
  },
  emailIconWrap: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailTextCol: { flex: 1, gap: 4 },
  emailLabel: { fontSize: 12, fontFamily: 'DMSans_500Medium', textTransform: 'uppercase', letterSpacing: 0.8 },
  emailValue: { fontSize: 17, fontFamily: 'DMSans_700Bold' },
  emailHint: { fontSize: 12, fontFamily: 'DMSans_400Regular' },
  hoursCard: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  hoursIconRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hoursTextCol: { flex: 1, gap: 6 },
  hoursTitle: { fontSize: 18, fontFamily: 'CormorantGaramond_700Bold' },
  hoursLine: { fontSize: 16, fontFamily: 'DMSans_500Medium', lineHeight: 24 },
  hoursNote: { fontSize: 13, lineHeight: 19, fontFamily: 'DMSans_400Regular', marginTop: 4 },
  faqHeader: { marginTop: Spacing.sm, gap: 4 },
  faqSectionTitle: { fontSize: 22, fontFamily: 'CormorantGaramond_700Bold' },
  faqSectionSub: { fontSize: 14, fontFamily: 'DMSans_400Regular' },
  faqItem: {
    flexDirection: 'row',
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  faqAccent: { width: 4 },
  faqInner: { flex: 1, padding: Spacing.md, gap: Spacing.sm },
  faqQRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  faqIndex: { fontSize: 12, fontFamily: 'DMSans_700Bold', width: 28 },
  faqQ: { flex: 1, fontSize: 16, fontFamily: 'DMSans_700Bold', lineHeight: 22 },
  faqA: { fontSize: 15, lineHeight: 24, fontFamily: 'DMSans_400Regular', paddingLeft: 40, paddingRight: 8 },
});
