import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ScreenHeader } from '@/components/ScreenHeader';
import { COMPANY } from '@/constants/company';
import { Colors, Palette, Radius, Spacing } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import { useProfile } from '@/context/ProfileContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTabScrollPaddingBottom } from '@/hooks/use-tab-scroll-padding';
import { generateAndShareOrderPdf } from '@/utils/orderPdf';
import * as Haptics from 'expo-haptics';

export default function OrderTab() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const scrollPadBottom = useTabScrollPaddingBottom();
  const { lines, setQuantity, removeLine, clearCart, orderNotes, setOrderNotes } = useCart();
  const { isComplete, profile } = useProfile();
  const [busy, setBusy] = useState(false);
  const [keyboardBottomPad, setKeyboardBottomPad] = useState(0);
  const [urgency, setUrgency] = useState<'Standard' | 'Priority' | 'Strategic'>('Standard');
  const [contactMethod, setContactMethod] = useState<'Email' | 'Phone' | 'Video'>('Email');

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const show = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardBottomPad(e.endCoordinates?.height ?? 0);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardBottomPad(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const totalItems = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines]
  );

  const confirm = async () => {
    if (!lines.length) {
      Alert.alert('Empty order', 'Add at least one service from the Services tab.');
      return;
    }
    if (!isComplete || !profile) {
      Alert.alert(
        'Create your profile first',
        'We need your profile details to include them in your order summary PDF. Nothing is sent to our servers from this app—your details exist only in memory for this session.',
        [
          { text: 'Later', style: 'cancel' },
          {
            text: 'Open profile',
            onPress: () => router.push('/(drawer)/profile'),
          },
        ]
      );
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setBusy(true);
    try {
      const compiledNotes = [
        orderNotes.trim(),
        `Urgency: ${urgency}`,
        `Preferred contact: ${contactMethod}`,
      ]
        .filter(Boolean)
        .join('\n');
      await generateAndShareOrderPdf({
        profile,
        lines: [...lines],
        orderNotes: compiledNotes,
      });
      clearCart();
      router.replace('/(drawer)/(tabs)/contact');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Please try again.';
      Alert.alert('PDF error', msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.root}>
      <ScreenHeader title="Your order" subtitle="Review and confirm your professional request" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: scrollPadBottom + keyboardBottomPad },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
      >
        <LinearGradient
          colors={[Palette.navy, Palette.navySoft]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}>
          <View style={styles.heroTop}>
            <Text style={styles.heroKicker}>Order desk</Text>
            <View style={styles.heroBadge}>
              <Ionicons name="shield-checkmark-outline" size={16} color={Palette.brass} />
              <Text style={styles.heroBadgeText}>Secure, on-device</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>Professional ordering with structured confirmation</Text>
          <Text style={styles.heroBody}>
            {totalItems ? `${totalItems} line items prepared` : 'Build your order in a polished, professional flow.'}
          </Text>
          <View style={styles.steps}>
            {['Select', 'Review', 'Confirm'].map((step, idx) => (
              <View key={step} style={styles.step}>
                <View style={[styles.stepDot, idx < 2 && styles.stepDotActive]} />
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {lines.length === 0 ? (
          <View style={[styles.empty, { borderColor: c.border, backgroundColor: c.card }]}>
            <Ionicons name="file-tray-outline" size={48} color={c.icon} />
            <Text style={[styles.emptyTitle, { color: c.text }]}>No items yet</Text>
            <Text style={[styles.emptyBody, { color: c.textSecondary }]}>
              Browse Services and tap “Add to order”. When you confirm, we generate a PDF summary for your records.
            </Text>
            <Pressable
              onPress={() => router.push('/(drawer)/(tabs)/services')}
              style={({ pressed }) => [styles.linkBtn, { opacity: pressed ? 0.9 : 1 }]}>
              <LinearGradient
                colors={[Palette.navy, Palette.navySoft]}
                style={styles.linkGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
                <Text style={styles.linkText}>Go to services</Text>
                <Ionicons name="arrow-forward" size={18} color={Palette.cream} />
              </LinearGradient>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={[styles.summaryCard, { backgroundColor: c.card, borderColor: c.border }]}>
              <View style={styles.summaryTop}>
                <Text style={[styles.summaryTitle, { color: c.text }]}>Order summary</Text>
                <Text style={[styles.summaryCount, { color: c.textSecondary }]}>{totalItems} items</Text>
              </View>
              <View style={styles.summaryRow}>
                <Ionicons name="sparkles-outline" size={18} color={Palette.brass} />
                <Text style={[styles.summaryBody, { color: c.textSecondary }]}>
                  Premium legal request workflow with clean documentation.
                </Text>
              </View>
            </View>

            {lines.map((line) => (
              <View key={line.catalogId} style={[styles.line, { borderColor: c.border, backgroundColor: c.card }]}>
                <View style={styles.lineTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.lineTitle, { color: c.text }]}>{line.title}</Text>
                    <Text style={[styles.lineCat, { color: c.textSecondary }]}>{line.category}</Text>
                  </View>
                  <Pressable
                    onPress={() => removeLine(line.catalogId)}
                    hitSlop={10}
                    accessibilityLabel="Remove line">
                    <Ionicons name="trash-outline" size={22} color="#b4534f" />
                  </Pressable>
                </View>
                <View style={styles.qtyRow}>
                  <Pressable
                    onPress={() => setQuantity(line.catalogId, line.quantity - 1)}
                    style={[styles.qtyBtn, { backgroundColor: c.cardMuted }]}>
                    <Ionicons name="remove" size={20} color={c.text} />
                  </Pressable>
                  <Text style={[styles.qty, { color: c.text }]}>{line.quantity}</Text>
                  <Pressable
                    onPress={() => setQuantity(line.catalogId, line.quantity + 1)}
                    style={[styles.qtyBtn, { backgroundColor: c.cardMuted }]}>
                    <Ionicons name="add" size={20} color={c.text} />
                  </Pressable>
                </View>
              </View>
            ))}

            <Text style={[styles.label, { color: c.textSecondary }]}>Order notes</Text>
            <TextInput
              value={orderNotes}
              onChangeText={setOrderNotes}
              placeholder="Context, timelines, jurisdictions…"
              placeholderTextColor={c.icon}
              multiline
              style={[
                styles.input,
                { color: c.text, borderColor: c.border, backgroundColor: c.card },
              ]}
            />

            <View style={[styles.prefsCard, { backgroundColor: c.card, borderColor: c.border }]}>
              <Text style={[styles.prefsTitle, { color: c.text }]}>Engagement preferences</Text>
              <View style={styles.choiceRow}>
                {(['Standard', 'Priority', 'Strategic'] as const).map((level) => (
                  <Pressable
                    key={level}
                    onPress={() => setUrgency(level)}
                    style={[
                      styles.choice,
                      {
                        borderColor: urgency === level ? Palette.brass : c.border,
                        backgroundColor: urgency === level ? c.cardMuted : 'transparent',
                      },
                    ]}>
                    <Text style={[styles.choiceText, { color: c.text }]}>{level}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={[styles.choiceLabel, { color: c.textSecondary }]}>Preferred contact</Text>
              <View style={styles.choiceRow}>
                {(['Email', 'Phone', 'Video'] as const).map((method) => (
                  <Pressable
                    key={method}
                    onPress={() => setContactMethod(method)}
                    style={[
                      styles.choice,
                      {
                        borderColor: contactMethod === method ? Palette.brass : c.border,
                        backgroundColor: contactMethod === method ? c.cardMuted : 'transparent',
                      },
                    ]}>
                    <Text style={[styles.choiceText, { color: c.text }]}>{method}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Text style={[styles.hint, { color: c.textSecondary }]}>
              Confirming generates a PDF with a welcome message, {COMPANY.legalName} details, your order, and your
              profile—then opens your contact options.
            </Text>

            <Pressable
              onPress={confirm}
              disabled={busy}
              style={({ pressed }) => [
                styles.confirmWrap,
                { opacity: pressed || busy ? 0.88 : 1 },
              ]}>
              <LinearGradient
                colors={[Palette.brass, Palette.brassMuted]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.confirm}>
                {busy ? (
                  <ActivityIndicator color={Palette.navy} />
                ) : (
                  <>
                    <Ionicons name="document-text-outline" size={22} color={Palette.navy} />
                    <Text style={styles.confirmText}>Confirm & generate PDF</Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollView: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, gap: Spacing.md, flexGrow: 1 },
  hero: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroKicker: {
    color: Palette.brass,
    fontSize: 11,
    letterSpacing: 2,
    fontFamily: 'DMSans_700Bold',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  heroBadgeText: { color: Palette.cream, fontSize: 12, fontFamily: 'DMSans_500Medium' },
  heroTitle: {
    color: Palette.cream,
    fontSize: 22,
    lineHeight: 28,
    fontFamily: 'CormorantGaramond_700Bold',
  },
  heroBody: { color: 'rgba(247,244,236,0.8)', fontSize: 14, fontFamily: 'DMSans_400Regular' },
  steps: { flexDirection: 'row', gap: Spacing.sm, marginTop: 6 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(247,244,236,0.35)' },
  stepDotActive: { backgroundColor: Palette.brass },
  stepText: { color: 'rgba(247,244,236,0.7)', fontSize: 12, fontFamily: 'DMSans_500Medium' },
  empty: {
    alignItems: 'center',
    padding: Spacing.xl,
    borderRadius: Radius.xl,
    borderWidth: 1,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  emptyTitle: { fontSize: 20, fontFamily: 'DMSans_700Bold', marginTop: Spacing.sm },
  emptyBody: { textAlign: 'center', fontSize: 15, lineHeight: 22, fontFamily: 'DMSans_400Regular' },
  linkBtn: { marginTop: Spacing.md, borderRadius: Radius.lg, overflow: 'hidden' },
  linkGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
  },
  linkText: { color: Palette.cream, fontSize: 16, fontFamily: 'DMSans_700Bold' },
  summaryCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  summaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryTitle: { fontSize: 18, fontFamily: 'DMSans_700Bold' },
  summaryCount: { fontSize: 13, fontFamily: 'DMSans_500Medium' },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  summaryBody: { flex: 1, fontSize: 13, lineHeight: 19, fontFamily: 'DMSans_400Regular' },
  line: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  lineTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  lineTitle: { fontSize: 17, fontFamily: 'DMSans_700Bold' },
  lineCat: { fontSize: 13, marginTop: 4, fontFamily: 'DMSans_400Regular' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: { fontSize: 18, fontFamily: 'DMSans_700Bold', minWidth: 28, textAlign: 'center' },
  label: { fontSize: 13, fontFamily: 'DMSans_500Medium', marginTop: Spacing.sm },
  input: {
    minHeight: 100,
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    textAlignVertical: 'top',
    fontSize: 15,
    fontFamily: 'DMSans_400Regular',
  },
  prefsCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  prefsTitle: { fontSize: 16, fontFamily: 'DMSans_700Bold' },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  choice: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  choiceText: { fontSize: 13, fontFamily: 'DMSans_500Medium' },
  choiceLabel: { fontSize: 12, fontFamily: 'DMSans_500Medium', marginTop: 6 },
  hint: { fontSize: 13, lineHeight: 19, fontFamily: 'DMSans_400Regular' },
  confirmWrap: { borderRadius: Radius.lg, overflow: 'hidden', marginTop: Spacing.sm },
  confirm: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  confirmText: { color: Palette.navy, fontSize: 17, fontFamily: 'DMSans_700Bold' },
});
