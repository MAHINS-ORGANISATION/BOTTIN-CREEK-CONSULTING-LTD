import { Alert, Keyboard, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SubScreenChrome } from '@/components/SubScreenChrome';
import { COMPANY } from '@/constants/company';
import { Colors, Palette, Radius, Spacing, type ThemeColors } from '@/constants/theme';
import { DEFAULT_PROFILE_EMOJI, useProfile, type UserProfile } from '@/context/ProfileContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';

const EMOJI_OPTIONS = ['👤', '🧑‍💼', '👨‍💼', '👩‍💼', '🧑‍⚖️', '👨‍⚖️', '👩‍⚖️', '🧑', '👨', '👩', '🙋', '🙋‍♂️', '🙋‍♀️'];

export default function ProfileScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const insets = useSafeAreaInsets();
  const { profile, saveProfile, deleteProfile } = useProfile();
  const [keyboardBottomPad, setKeyboardBottomPad] = useState(0);

  const [emoji, setEmoji] = useState(DEFAULT_PROFILE_EMOJI);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (profile) {
      setEmoji(profile.emoji || DEFAULT_PROFILE_EMOJI);
      setFullName(profile.fullName);
      setEmail(profile.email);
      setPhone(profile.phone);
      setOrganization(profile.organization ?? '');
      setNotes(profile.notes ?? '');
    }
  }, [profile]);

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

  const persist = async () => {
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      Alert.alert('Almost there', 'Please enter your full name, email, and phone so we can include them in your PDF.');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const next: UserProfile = {
      emoji: emoji || DEFAULT_PROFILE_EMOJI,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      organization: organization.trim() || undefined,
      notes: notes.trim() || undefined,
    };
    await saveProfile(next);
    Alert.alert('Updated', 'Your profile is kept in memory for this session only—it is not saved to disk.');
  };

  const remove = () => {
    Alert.alert(
      'Delete profile?',
      'This clears the profile from memory for this session. It does not affect any PDFs you already exported.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await deleteProfile();
            setEmoji(DEFAULT_PROFILE_EMOJI);
            setFullName('');
            setEmail('');
            setPhone('');
            setOrganization('');
            setNotes('');
          },
        },
      ]
    );
  };

  const scrollBottomPad = Spacing.xxl + insets.bottom + keyboardBottomPad;

  return (
    <SubScreenChrome title="Profile">
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scroll, { paddingBottom: scrollBottomPad }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
      >
        <Text style={[styles.lead, { color: c.textSecondary }]}>
          Your profile is optional until you confirm an order. It stays on your device—we do not transmit it from this
          app.
        </Text>

        <View style={[styles.avatarCard, { backgroundColor: c.card, borderColor: c.border }]}>
          <Text style={styles.bigEmoji}>{emoji}</Text>
          <Text style={[styles.avatarHint, { color: c.textSecondary }]}>Choose a human-style avatar</Text>
          <View style={styles.emojiRow}>
            {EMOJI_OPTIONS.map((e) => (
              <Pressable
                key={e}
                onPress={() => {
                  Haptics.selectionAsync();
                  setEmoji(e);
                }}
                style={[
                  styles.emojiChip,
                  {
                    borderColor: e === emoji ? Palette.brass : c.border,
                    backgroundColor: e === emoji ? c.cardMuted : c.backgroundElevated,
                  },
                ]}>
                <Text style={styles.emojiChipText}>{e}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Field label="Full name" c={c} value={fullName} onChangeText={setFullName} />
        <Field label="Email" c={c} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Field label="Phone" c={c} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Field label="Organization (optional)" c={c} value={organization} onChangeText={setOrganization} />
        <Text style={[styles.label, { color: c.textSecondary }]}>Notes (optional)</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Anything we should know when reviewing your order"
          placeholderTextColor={c.icon}
          multiline
          style={[
            styles.input,
            styles.area,
            { color: c.text, borderColor: c.border, backgroundColor: c.card },
          ]}
        />

        <Pressable
          onPress={persist}
          style={({ pressed }) => [
            styles.primary,
            { backgroundColor: Palette.navy, opacity: pressed ? 0.9 : 1 },
          ]}>
          <Text style={styles.primaryText}>Save profile</Text>
        </Pressable>

        {profile ? (
          <Pressable onPress={remove} style={styles.danger}>
            <Text style={styles.dangerText}>Delete profile from device</Text>
          </Pressable>
        ) : null}

        <Text style={[styles.foot, { color: c.textSecondary }]}>
          {COMPANY.appName} does not collect analytics. {COMPANY.legalName}
        </Text>
      </ScrollView>
    </SubScreenChrome>
  );
}

function Field({
  label,
  c,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  c: ThemeColors;
  value: string;
  onChangeText: (s: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences';
}) {
  return (
    <>
      <Text style={[styles.label, { color: c.textSecondary }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={[styles.input, { color: c.text, borderColor: c.border, backgroundColor: c.card }]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, gap: Spacing.sm, flexGrow: 1 },
  lead: { fontSize: 15, lineHeight: 22, fontFamily: 'DMSans_400Regular', marginBottom: Spacing.sm },
  avatarCard: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  bigEmoji: { fontSize: 64 },
  avatarHint: { fontSize: 13, fontFamily: 'DMSans_400Regular' },
  emojiRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: Spacing.sm },
  emojiChip: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiChipText: { fontSize: 24 },
  label: { fontSize: 13, fontFamily: 'DMSans_500Medium', marginTop: Spacing.sm },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'DMSans_400Regular',
  },
  area: { minHeight: 100, textAlignVertical: 'top' },
  primary: {
    marginTop: Spacing.lg,
    paddingVertical: 16,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  primaryText: { color: Palette.cream, fontSize: 17, fontFamily: 'DMSans_700Bold' },
  danger: { marginTop: Spacing.md, alignItems: 'center', padding: Spacing.sm },
  dangerText: { color: '#b4534f', fontSize: 15, fontFamily: 'DMSans_700Bold' },
  foot: { marginTop: Spacing.lg, fontSize: 12, lineHeight: 18, textAlign: 'center' },
});
