import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { ScreenHeader } from '@/components/ScreenHeader';
import { AppImages, getAppImage } from '@/constants/appImages';
import { BLOG_POSTS } from '@/constants/blogPosts';
import { COMPANY } from '@/constants/company';
import { CATALOG } from '@/constants/servicesCatalog';
import { Colors, Fonts, Palette, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTabScrollPaddingBottom } from '@/hooks/use-tab-scroll-padding';
import * as Haptics from 'expo-haptics';

export default function HomeTab() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const { width: winW, height: winH } = useWindowDimensions();
  const scrollPadBottom = useTabScrollPaddingBottom();
  const featuredServices = CATALOG.filter((service) => service.featured).slice(0, 3);
  const featuredPosts = BLOG_POSTS.filter((post) => post.featured).slice(0, 2);

  const heroHeight = Math.round(Math.min(340, Math.max(200, winH * 0.34)));
  const heroTitleSize = Math.min(32, Math.max(22, winW * 0.075));
  const featureCardW = Math.min(280, Math.max(200, winW * 0.62));
  const blogCardW = Math.min(260, Math.max(180, winW * 0.58));

  return (
    <View style={styles.root}>
      <ScreenHeader title={COMPANY.appName} subtitle={COMPANY.tagline} />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: scrollPadBottom }]}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(600).springify()}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(drawer)/(tabs)/services');
            }}
            style={({ pressed }) => [styles.heroCard, { height: heroHeight, opacity: pressed ? 0.96 : 1 }]}>
            <Image source={AppImages.homeHero} style={StyleSheet.absoluteFill} contentFit="cover" />
            <LinearGradient
              colors={['rgba(10,22,40,0.15)', 'rgba(10,22,40,0.95)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={[styles.heroOrb, { backgroundColor: c.accent }]} />
            <View style={styles.heroContent}>
              <Text style={styles.heroKicker}>{COMPANY.legalName}</Text>
              <Text style={[styles.heroTitle, { fontSize: heroTitleSize, lineHeight: heroTitleSize + 4 }]}>
                Ultra-premium legal advisory, delivered with calm precision
              </Text>
              <View style={styles.heroRow}>
                <Text style={styles.heroCta}>Explore services</Text>
                <Ionicons name="arrow-forward-circle" size={28} color={Palette.brass} />
              </View>
            </View>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(80).duration(520)} style={styles.section}>
          <SectionHeader title="Quick actions" color={c.text} linkColor={c.tint} />
          <View style={styles.quickGrid}>
            {(
              [
              {
                label: 'Start order',
                icon: 'clipboard-outline' as const,
                onPress: () => router.push('/(drawer)/(tabs)/order'),
                colors: [Palette.navy, Palette.navySoft] as [string, string],
              },
              {
                label: 'View profile',
                icon: 'person-circle-outline' as const,
                onPress: () => router.push('/(drawer)/profile'),
                colors: [c.accent, Palette.sapphire] as [string, string],
              },
              {
                label: 'Contact firm',
                icon: 'mail-outline' as const,
                onPress: () => router.push('/(drawer)/(tabs)/contact'),
                colors: [Palette.teal, Palette.sapphire] as [string, string],
              },
              {
                label: 'Read insights',
                icon: 'newspaper-outline' as const,
                onPress: () => router.push('/(drawer)/(tabs)/blog'),
                colors: [Palette.rose, Palette.brassMuted] as [string, string],
              },
            ] as const).map((action) => (
              <Pressable
                key={action.label}
                onPress={() => {
                  Haptics.selectionAsync();
                  action.onPress();
                }}
                style={({ pressed }) => [
                  styles.quickCard,
                  { opacity: pressed ? 0.92 : 1 },
                ]}>
                <LinearGradient colors={action.colors} style={styles.quickGradient}>
                  <Ionicons name={action.icon} size={22} color={Palette.cream} />
                  <Text style={styles.quickLabel}>{action.label}</Text>
                </LinearGradient>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(130).duration(540)} style={styles.section}>
          <SectionHeader
            title="Featured services"
            actionLabel="View all"
            onPress={() => router.push('/(drawer)/(tabs)/services')}
            color={c.text}
            linkColor={c.tint}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.hStack}>
              {featuredServices.map((service) => (
                <Pressable
                  key={service.id}
                  onPress={() =>
                    router.push({ pathname: '/(drawer)/service/[id]', params: { id: service.id } })
                  }
                  style={({ pressed }) => [
                    styles.featureCard,
                    { width: featureCardW, opacity: pressed ? 0.95 : 1 },
                  ]}>
                  <Image source={getAppImage(service.imageKey)} style={StyleSheet.absoluteFill} contentFit="cover" />
                  <LinearGradient
                    colors={['rgba(10,22,40,0.1)', 'rgba(10,22,40,0.95)']}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={[styles.featureGlow, { backgroundColor: service.accent }]} />
                  <Text style={styles.featureCat}>{service.category}</Text>
                  <Text style={styles.featureTitle}>{service.title}</Text>
                  <Text style={styles.featureCta}>View details</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(180).duration(540)} style={styles.section}>
          <SectionHeader
            title="Featured insights"
            actionLabel="All posts"
            onPress={() => router.push('/(drawer)/(tabs)/blog')}
            color={c.text}
            linkColor={c.tint}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.hStack}>
              {featuredPosts.map((post) => (
                <Pressable
                  key={post.id}
                  onPress={() =>
                    router.push({ pathname: '/(drawer)/(tabs)/blog', params: { open: post.id } })
                  }
                  style={({ pressed }) => [styles.blogCard, { width: blogCardW, opacity: pressed ? 0.95 : 1 }]}>
                  <Image source={getAppImage(post.imageKey)} style={StyleSheet.absoluteFill} contentFit="cover" />
                  <LinearGradient
                    colors={['rgba(10,22,40,0.1)', 'rgba(10,22,40,0.94)']}
                    style={StyleSheet.absoluteFill}
                  />
                  <Text style={styles.blogTitle}>{post.title}</Text>
                  <Text style={styles.blogMeta}>{post.readMinutes} min read</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(220).duration(560)} style={styles.section}>
          <Text style={[styles.h2, { color: c.text }]}>How we work</Text>
          <Text style={[styles.p, { color: c.textSecondary }]}>{COMPANY.shortAbout}</Text>
          <View style={styles.grid}>
            {[
              { t: 'Governance', d: 'Board-ready clarity without the noise.', i: 'layers-outline' as const },
              { t: 'Contracts', d: 'Documents your teams will actually follow.', i: 'document-text-outline' as const },
              { t: 'Prevention', d: 'Spot friction before it becomes exposure.', i: 'shield-half-outline' as const },
            ].map((card) => (
              <View key={card.t} style={[styles.tile, { backgroundColor: c.card, borderColor: c.border }]}>
                <View style={[styles.tileIcon, { backgroundColor: c.cardMuted }]}>
                  <Ionicons name={card.i} size={22} color={Palette.brass} />
                </View>
                <Text style={[styles.tileTitle, { color: c.text }]}>{card.t}</Text>
                <Text style={[styles.tileBody, { color: c.textSecondary }]}>{card.d}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(280).duration(550)} style={styles.quoteWrap}>
          <LinearGradient
            colors={[Palette.navy, Palette.navySoft]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.quote}>
            <Text style={styles.quoteText}>
              “Precision in language is precision in thought—especially when stakes are high.”
            </Text>
            <Text style={styles.quoteSig}>— {COMPANY.legalName}</Text>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function SectionHeader({
  title,
  actionLabel,
  onPress,
  color,
  linkColor,
}: {
  title: string;
  actionLabel?: string;
  onPress?: () => void;
  color: string;
  linkColor: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
      {actionLabel && onPress ? (
        <Pressable onPress={onPress} hitSlop={8}>
          <Text style={[styles.sectionLink, { color: linkColor }]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, gap: Spacing.lg },
  heroCard: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  heroOrb: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 999,
    right: -30,
    top: -50,
    opacity: 0.18,
  },
  heroContent: { padding: Spacing.lg },
  heroKicker: {
    color: Palette.brass,
    fontSize: 11,
    letterSpacing: 2,
    fontFamily: 'DMSans_700Bold',
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    color: Palette.cream,
    fontFamily: 'CormorantGaramond_700Bold',
    marginBottom: Spacing.md,
  },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroCta: { color: Palette.cream, fontSize: 16, fontFamily: 'DMSans_500Medium' },
  section: { gap: Spacing.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.displayBold,
  },
  sectionLink: { fontSize: 13, fontFamily: 'DMSans_700Bold' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  quickCard: { width: '47%' },
  quickGradient: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: 6,
    minHeight: 90,
    justifyContent: 'center',
  },
  quickLabel: { color: Palette.cream, fontSize: 14, fontFamily: 'DMSans_700Bold' },
  hStack: { flexDirection: 'row', gap: Spacing.md, paddingVertical: 2, paddingRight: Spacing.md },
  featureCard: {
    height: 200,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    padding: Spacing.md,
    justifyContent: 'flex-end',
  },
  featureGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    right: -20,
    top: -30,
    borderRadius: 999,
    opacity: 0.3,
  },
  featureCat: {
    color: Palette.brass,
    fontSize: 11,
    letterSpacing: 1.5,
    fontFamily: 'DMSans_700Bold',
    textTransform: 'uppercase',
  },
  featureTitle: {
    color: Palette.cream,
    fontSize: 20,
    fontFamily: 'CormorantGaramond_700Bold',
    marginTop: 6,
  },
  featureCta: { color: 'rgba(247,244,236,0.78)', fontSize: 12, marginTop: 8 },
  blogCard: {
    height: 160,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    padding: Spacing.md,
    justifyContent: 'flex-end',
  },
  blogTitle: { color: Palette.cream, fontSize: 16, fontFamily: 'DMSans_700Bold' },
  blogMeta: { color: 'rgba(247,244,236,0.7)', fontSize: 12, marginTop: 6 },
  h2: {
    fontSize: 24,
    fontFamily: Fonts.displayBold,
  },
  p: { fontSize: 16, lineHeight: 24, fontFamily: 'DMSans_400Regular' },
  grid: { gap: Spacing.sm },
  tile: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  tileIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tileTitle: { fontSize: 18, fontFamily: 'DMSans_700Bold' },
  tileBody: { fontSize: 14, lineHeight: 20, fontFamily: 'DMSans_400Regular' },
  quoteWrap: { borderRadius: Radius.xl, overflow: 'hidden' },
  quote: { padding: Spacing.lg, gap: Spacing.sm },
  quoteText: {
    color: Palette.cream,
    fontSize: 17,
    lineHeight: 26,
    fontFamily: 'CormorantGaramond_600SemiBold',
  },
  quoteSig: { color: 'rgba(247,244,236,0.75)', fontSize: 12, fontFamily: 'DMSans_500Medium' },
});
