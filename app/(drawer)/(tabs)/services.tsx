import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

import { ScreenHeader } from '@/components/ScreenHeader';
import { getAppImage } from '@/constants/appImages';
import { CATALOG } from '@/constants/servicesCatalog';
import { Colors, Palette, Radius, Spacing } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTabScrollPaddingBottom } from '@/hooks/use-tab-scroll-padding';
import * as Haptics from 'expo-haptics';

export default function ServicesTab() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const { width: winW } = useWindowDimensions();
  const scrollPadBottom = useTabScrollPaddingBottom();
  const { addOrIncrement, quantityFor } = useCart();
  const imageMinH = Math.round(Math.min(260, Math.max(180, winW * 0.48)));

  return (
    <View style={styles.root}>
      <ScreenHeader title="Services & products" subtitle="Professional catalogue — request what you need" />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: scrollPadBottom }]}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.intro, { color: c.textSecondary }]}>
          Add items to your order. There is no pricing in this app; our team will follow up with next steps after you
          confirm.
        </Text>
        {CATALOG.map((item, idx) => {
          const inCart = quantityFor(item.id) > 0;
          return (
          <Animated.View key={item.id} entering={FadeInRight.delay(idx * 55).duration(420)}>
            <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
              <View style={[styles.imageWrap, { height: imageMinH }]}>
                <Image source={getAppImage(item.imageKey)} style={StyleSheet.absoluteFill} contentFit="cover" />
                <LinearGradient
                  colors={['rgba(10,22,40,0.05)', 'rgba(10,22,40,0.92)']}
                  style={StyleSheet.absoluteFill}
                />
                <View style={[styles.accentGlow, { backgroundColor: item.accent }]} />
                <Pressable
                  onPress={() => router.push({ pathname: '/(drawer)/service/[id]', params: { id: item.id } })}
                  style={StyleSheet.absoluteFill}
                />
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
                    addOrIncrement(item.id, item.title, item.category);
                  }}
                  style={({ pressed }) => [
                    styles.coverCartBtn,
                    inCart ? styles.coverCartBtnInCart : styles.coverCartBtnDefault,
                    { opacity: pressed ? 0.88 : 1 },
                  ]}>
                  <Ionicons
                    name={inCart ? 'checkmark-circle' : 'add-circle-outline'}
                    size={18}
                    color={inCart ? Palette.navy : Palette.brass}
                  />
                  <Text style={[styles.coverCartBtnText, inCart && styles.coverCartBtnTextInCart]}>
                    {inCart ? 'In cart' : 'Add to order'}
                  </Text>
                </Pressable>
                <View style={styles.imageLabel} pointerEvents="box-none">
                  <Text style={styles.cat}>{item.category}</Text>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.tap}>Tap for full details</Text>
                </View>
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.summary, { color: c.textSecondary }]}>{item.summary}</Text>
                <View style={styles.actions}>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                      router.push({ pathname: '/(drawer)/service/[id]', params: { id: item.id } });
                    }}
                    style={({ pressed }) => [
                      styles.detailBtn,
                      { borderColor: c.border, opacity: pressed ? 0.86 : 1 },
                    ]}>
                    <Ionicons name="sparkles-outline" size={18} color={c.text} />
                    <Text style={[styles.detailText, { color: c.text }]}>View details</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
                      addOrIncrement(item.id, item.title, item.category);
                    }}
                    style={({ pressed }) => [
                      styles.addBtn,
                      inCart ? styles.addBtnInCart : styles.addBtnDefault,
                      { opacity: pressed ? 0.9 : 1 },
                    ]}>
                    <Ionicons
                      name={inCart ? 'checkmark-circle' : 'add-circle-outline'}
                      size={22}
                      color={inCart ? Palette.navy : Palette.brass}
                    />
                    <Text style={[styles.addText, inCart && styles.addTextInCart]}>{inCart ? 'In cart' : 'Add to order'}</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, gap: Spacing.md },
  intro: { fontSize: 15, lineHeight: 22, fontFamily: 'DMSans_400Regular', marginBottom: 4 },
  card: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  imageWrap: { justifyContent: 'flex-end', overflow: 'hidden' },
  coverCartBtn: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    zIndex: 2,
  },
  coverCartBtnDefault: {
    backgroundColor: 'rgba(10,22,40,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(196,163,90,0.45)',
  },
  coverCartBtnInCart: {
    backgroundColor: Palette.brass,
    borderWidth: 0,
  },
  coverCartBtnText: {
    color: Palette.cream,
    fontSize: 13,
    fontFamily: 'DMSans_700Bold',
  },
  coverCartBtnTextInCart: {
    color: Palette.navy,
  },
  imageLabel: { padding: Spacing.md, zIndex: 1 },
  accentGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 999,
    right: -30,
    top: -40,
    opacity: 0.22,
  },
  cat: {
    color: Palette.brass,
    fontSize: 11,
    letterSpacing: 1.5,
    fontFamily: 'DMSans_700Bold',
    textTransform: 'uppercase',
  },
  cardTitle: {
    color: Palette.cream,
    fontSize: 22,
    fontFamily: 'CormorantGaramond_700Bold',
    marginTop: 4,
  },
  tap: {
    marginTop: 6,
    fontSize: 12,
    color: 'rgba(247,244,236,0.75)',
    fontFamily: 'DMSans_500Medium',
  },
  cardBody: { padding: Spacing.md, gap: Spacing.md },
  summary: { fontSize: 15, lineHeight: 22, fontFamily: 'DMSans_400Regular' },
  actions: { gap: Spacing.sm },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  detailText: { fontSize: 15, fontFamily: 'DMSans_700Bold' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: Radius.lg,
  },
  addBtnDefault: {
    backgroundColor: Palette.navy,
  },
  addBtnInCart: {
    backgroundColor: Palette.brass,
  },
  addText: { color: Palette.cream, fontSize: 16, fontFamily: 'DMSans_700Bold' },
  addTextInCart: { color: Palette.navy },
});
