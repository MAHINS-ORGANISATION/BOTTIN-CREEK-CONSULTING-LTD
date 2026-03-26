import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SubScreenChrome } from '@/components/SubScreenChrome';
import { getAppImage } from '@/constants/appImages';
import { COMPANY } from '@/constants/company';
import { CATALOG } from '@/constants/servicesCatalog';
import { Colors, Palette, Radius, Spacing } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const { addOrIncrement, quantityFor } = useCart();
  const service = CATALOG.find((item) => item.id === id);
  const inCart = service ? quantityFor(service.id) > 0 : false;

  if (!service) {
    return (
      <SubScreenChrome title="Service details">
        <View style={[styles.missing, { backgroundColor: c.card, borderColor: c.border }]}>
          <Ionicons name="alert-circle-outline" size={34} color={c.icon} />
          <Text style={[styles.missingTitle, { color: c.text }]}>Service not found</Text>
          <Text style={[styles.missingBody, { color: c.textSecondary }]}>
            The service you selected is not available. Browse the full catalogue to explore all offerings.
          </Text>
          <Pressable
            onPress={() => router.replace('/(drawer)/(tabs)/services')}
            style={({ pressed }) => [styles.missingBtn, { opacity: pressed ? 0.9 : 1 }]}>
            <Text style={styles.missingBtnText}>Back to services</Text>
          </Pressable>
        </View>
      </SubScreenChrome>
    );
  }

  return (
    <SubScreenChrome title="Service details">
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: Spacing.lg }]}>
        <View style={styles.hero}>
          <Image source={getAppImage(service.imageKey)} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient
            colors={['rgba(10,22,40,0.1)', 'rgba(10,22,40,0.96)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.heroGlow, { backgroundColor: service.accent }]} />
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Ionicons name="sparkles" size={14} color={Palette.brass} />
              <Text style={styles.heroBadgeText}>{service.category}</Text>
            </View>
            <Text style={styles.heroTitle}>{service.title}</Text>
            <Text style={styles.heroSummary}>{service.summary}</Text>
            <View style={styles.heroMeta}>
              <Ionicons name="time-outline" size={16} color={Palette.brass} />
              <Text style={styles.heroMetaText}>{service.timeline}</Text>
              <Ionicons name="business-outline" size={16} color={Palette.brass} />
              <Text style={styles.heroMetaText}>{COMPANY.legalName}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          <Text style={[styles.cardTitle, { color: c.text }]}>Overview</Text>
          <Text style={[styles.cardBody, { color: c.textSecondary }]}>{service.description}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          <Text style={[styles.cardTitle, { color: c.text }]}>Deliverables</Text>
          {service.deliverables.map((item) => (
            <View key={item} style={styles.row}>
              <Ionicons name="checkmark-circle" size={18} color={Palette.teal} />
              <Text style={[styles.rowText, { color: c.textSecondary }]}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          <Text style={[styles.cardTitle, { color: c.text }]}>Ideal for</Text>
          <View style={styles.chips}>
            {service.idealFor.map((item) => (
              <View key={item} style={[styles.chip, { backgroundColor: c.cardMuted }]}>
                <Text style={[styles.chipText, { color: c.textSecondary }]}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <LinearGradient
          colors={[Palette.navy, Palette.navySoft]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.actionCard}>
          <Text style={styles.actionTitle}>Ready to order?</Text>
          <Text style={styles.actionBody}>
            Add this service to your professional order. We will include it in your PDF confirmation.
          </Text>
          <View style={styles.actionRow}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
                addOrIncrement(service.id, service.title, service.category);
              }}
              style={({ pressed }) => [
                styles.actionBtn,
                inCart ? styles.actionBtnInCart : styles.actionBtnDefault,
                { opacity: pressed ? 0.88 : 1 },
              ]}>
              <Ionicons
                name={inCart ? 'checkmark-circle' : 'add-circle-outline'}
                size={20}
                color={inCart ? Palette.navy : Palette.brass}
              />
              <Text style={[styles.actionBtnText, inCart && styles.actionBtnTextInCart]}>
                {inCart ? 'In cart' : 'Add to order'}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/(drawer)/(tabs)/order')}
              style={({ pressed }) => [styles.secondaryBtn, { opacity: pressed ? 0.9 : 1 }]}>
              <Ionicons name="clipboard-outline" size={18} color={Palette.cream} />
              <Text style={styles.secondaryBtnText}>Go to order</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </ScrollView>
    </SubScreenChrome>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, gap: Spacing.md },
  hero: {
    height: 320,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  heroGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    right: -50,
    top: -70,
    opacity: 0.25,
  },
  heroContent: { padding: Spacing.lg, gap: 6 },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignSelf: 'flex-start',
  },
  heroBadgeText: { color: Palette.cream, fontSize: 11, fontFamily: 'DMSans_700Bold' },
  heroTitle: { color: Palette.cream, fontSize: 26, fontFamily: 'CormorantGaramond_700Bold' },
  heroSummary: { color: 'rgba(247,244,236,0.85)', fontSize: 14, fontFamily: 'DMSans_400Regular' },
  heroMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 6, alignItems: 'center' },
  heroMetaText: { color: 'rgba(247,244,236,0.7)', fontSize: 12, fontFamily: 'DMSans_500Medium' },
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  cardTitle: { fontSize: 16, fontFamily: 'DMSans_700Bold' },
  cardBody: { fontSize: 15, lineHeight: 22, fontFamily: 'DMSans_400Regular' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowText: { flex: 1, fontSize: 14, lineHeight: 20, fontFamily: 'DMSans_400Regular' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  chipText: { fontSize: 12, fontFamily: 'DMSans_500Medium' },
  actionCard: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  actionTitle: { color: Palette.cream, fontSize: 20, fontFamily: 'CormorantGaramond_700Bold' },
  actionBody: { color: 'rgba(247,244,236,0.85)', fontSize: 14, fontFamily: 'DMSans_400Regular' },
  actionRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: Radius.lg,
  },
  actionBtnDefault: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  actionBtnInCart: {
    backgroundColor: Palette.brass,
  },
  actionBtnText: { color: Palette.cream, fontSize: 14, fontFamily: 'DMSans_700Bold' },
  actionBtnTextInCart: { color: Palette.navy },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(255,255,255,0.24)',
  },
  secondaryBtnText: { color: Palette.cream, fontSize: 14, fontFamily: 'DMSans_700Bold' },
  missing: {
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  missingTitle: { fontSize: 18, fontFamily: 'DMSans_700Bold' },
  missingBody: { textAlign: 'center', fontSize: 14, lineHeight: 20, fontFamily: 'DMSans_400Regular' },
  missingBtn: {
    marginTop: Spacing.sm,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    backgroundColor: Palette.navy,
  },
  missingBtnText: { color: Palette.cream, fontSize: 14, fontFamily: 'DMSans_700Bold' },
});
