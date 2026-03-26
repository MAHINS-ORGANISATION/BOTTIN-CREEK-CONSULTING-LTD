import { ScrollView, StyleSheet, Text } from 'react-native';

import { SubScreenChrome } from '@/components/SubScreenChrome';
import { COMPANY } from '@/constants/company';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function PrivacyScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  return (
    <SubScreenChrome title="Privacy policy">
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: Spacing.xxl }]}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.p, { color: c.textSecondary }]}>
          Last updated: March 26, 2026. This notice describes how the {COMPANY.appName} mobile experience treats
          information when you use it on your device.
        </Text>
        <Text style={[styles.h, { color: c.text }]}>No data collection or storage</Text>
        <Text style={[styles.p, { color: c.textSecondary }]}>
          {COMPANY.appName} does not request runtime permissions on Android, does not use persistent local storage for your
          profile, theme, or onboarding state, and does not send your inputs to {COMPANY.legalName}’s servers. Profile and
          order details you enter exist only in the app’s memory for the current session and are cleared when the app
          process ends.
        </Text>
        <Text style={[styles.h, { color: c.text }]}>Orders & PDFs</Text>
        <Text style={[styles.p, { color: c.textSecondary }]}>
          When you confirm an order, the app composes a PDF on-device using the profile and order details currently in
          memory. Sharing or saving that PDF uses your operating system share sheet or another app you choose.{' '}
          {COMPANY.legalName} does not receive those files automatically from {COMPANY.appName}.
        </Text>
        <Text style={[styles.h, { color: c.text }]}>No tracking stack</Text>
        <Text style={[styles.p, { color: c.textSecondary }]}>
          The app is built without advertising identifiers, location tracking, contact-book access, or third-party analytics
          SDKs in its default configuration. Images and copy you see are bundled with the app or loaded like any other
          local resource.
        </Text>
        <Text style={[styles.h, { color: c.text }]}>Children</Text>
        <Text style={[styles.p, { color: c.textSecondary }]}>
          The app is intended for adults seeking professional legal consultancy information. It does not knowingly invite
          children to submit data.
        </Text>
        <Text style={[styles.h, { color: c.text }]}>Contact</Text>
        <Text style={[styles.p, { color: c.textSecondary }]}>
          Questions about this policy: {COMPANY.email}
        </Text>
      </ScrollView>
    </SubScreenChrome>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, gap: Spacing.md },
  h: { fontSize: 18, fontFamily: 'DMSans_700Bold', marginTop: Spacing.sm },
  p: { fontSize: 15, lineHeight: 24, fontFamily: 'DMSans_400Regular' },
});
