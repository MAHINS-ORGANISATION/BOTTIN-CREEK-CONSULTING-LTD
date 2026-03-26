import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppScreenCanvas } from '@/components/AppScreenCanvas';
import { ScreenHeader } from '@/components/ScreenHeader';
import { getAppImage } from '@/constants/appImages';
import { BLOG_POSTS, type BlogPost } from '@/constants/blogPosts';
import { Colors, Palette, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTabScrollPaddingBottom } from '@/hooks/use-tab-scroll-padding';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

export default function BlogTab() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const scrollPadBottom = useTabScrollPaddingBottom();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState<BlogPost | null>(null);
  const { open: openId } = useLocalSearchParams<{ open?: string }>();

  useEffect(() => {
    if (!openId) return;
    const match = BLOG_POSTS.find((post) => post.id === openId);
    if (match) {
      setOpen(match);
    }
  }, [openId]);

  return (
    <View style={styles.root}>
      <ScreenHeader title="Insights" subtitle="Notes from our desk" />
      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: scrollPadBottom }]}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.intro, { color: c.textSecondary }]}>
          Short reads on judgment, documentation, and calm execution.
        </Text>
        {BLOG_POSTS.map((post) => (
          <Pressable
            key={post.id}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setOpen(post);
            }}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: c.card, borderColor: c.border, opacity: pressed ? 0.95 : 1 },
            ]}>
            <View style={styles.thumb}>
              <Image source={getAppImage(post.imageKey)} style={StyleSheet.absoluteFill} contentFit="cover" />
              <LinearGradient colors={['transparent', 'rgba(10,22,40,0.85)']} style={StyleSheet.absoluteFill} />
              <Text style={styles.thumbTitle} numberOfLines={2}>
                {post.title}
              </Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={[styles.excerpt, { color: c.textSecondary }]} numberOfLines={3}>
                {post.excerpt}
              </Text>
              {post.tags?.length ? (
                <View style={styles.tagRow}>
                  {post.tags.slice(0, 3).map((tag) => (
                    <View key={tag} style={[styles.tag, { backgroundColor: c.cardMuted }]}>
                      <Text style={[styles.tagText, { color: c.textSecondary }]}>{tag}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
              <View style={styles.meta}>
                <Text style={[styles.date, { color: c.icon }]}>{post.date}</Text>
                <Text style={[styles.date, { color: c.icon }]}>{post.readMinutes} min read</Text>
              </View>
              <View style={styles.readRow}>
                <Text style={[styles.read, { color: Palette.brass }]}>Read</Text>
                <Ionicons name="arrow-forward" size={16} color={Palette.brass} />
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Modal visible={!!open} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setOpen(null)}>
        {open ? (
          <AppScreenCanvas>
            <View style={styles.modalRoot}>
              <View style={[styles.modalBar, { borderBottomColor: c.border, paddingTop: insets.top + Spacing.sm }]}>
                <Pressable
                  onPress={() => setOpen(null)}
                  style={({ pressed }) => [styles.closeBtn, { opacity: pressed ? 0.75 : 1 }]}>
                  <Ionicons name="close" size={28} color={c.text} />
                </Pressable>
                <Text style={[styles.modalTitle, { color: c.text }]} numberOfLines={2}>
                  {open.title}
                </Text>
                <View style={{ width: 40 }} />
              </View>
              <ScrollView
                contentContainerStyle={{ paddingBottom: Spacing.xxl + insets.bottom }}
                showsVerticalScrollIndicator={false}>
                <Image source={getAppImage(open.imageKey)} style={styles.modalHero} contentFit="cover" />
                <View style={{ padding: Spacing.md, gap: Spacing.md }}>
                  <Text style={[styles.modalMeta, { color: c.textSecondary }]}>
                    {open.date} · {open.readMinutes} min read
                  </Text>
                  {open.tags?.length ? (
                    <View style={styles.tagRow}>
                      {open.tags.map((tag) => (
                        <View key={tag} style={[styles.tag, { backgroundColor: c.cardMuted }]}>
                          <Text style={[styles.tagText, { color: c.textSecondary }]}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  ) : null}
                  {open.body.split('\n\n').map((para, i) => (
                    <Text key={i} style={[styles.modalBody, { color: c.textSecondary }]}>
                      {para.trim()}
                    </Text>
                  ))}
                </View>
              </ScrollView>
            </View>
          </AppScreenCanvas>
        ) : null}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  list: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, gap: Spacing.md },
  intro: { fontSize: 15, lineHeight: 22, fontFamily: 'DMSans_400Regular' },
  card: { borderRadius: Radius.xl, borderWidth: 1, overflow: 'hidden' },
  thumb: { height: 160, justifyContent: 'flex-end', padding: Spacing.md },
  thumbTitle: { color: Palette.cream, fontSize: 20, fontFamily: 'CormorantGaramond_700Bold', lineHeight: 24 },
  cardBody: { padding: Spacing.md, gap: Spacing.sm },
  excerpt: { fontSize: 15, lineHeight: 22, fontFamily: 'DMSans_400Regular' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  tagText: { fontSize: 11, fontFamily: 'DMSans_500Medium' },
  meta: { flexDirection: 'row', justifyContent: 'space-between' },
  date: { fontSize: 12, fontFamily: 'DMSans_500Medium' },
  readRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  read: { fontSize: 15, fontFamily: 'DMSans_700Bold' },
  modalRoot: { flex: 1 },
  modalBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.sm,
  },
  closeBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  modalTitle: { flex: 1, fontSize: 17, fontFamily: 'DMSans_700Bold' },
  modalHero: { width: '100%', height: 220 },
  modalMeta: { fontSize: 13, fontFamily: 'DMSans_500Medium' },
  modalBody: { fontSize: 16, lineHeight: 26, fontFamily: 'DMSans_400Regular' },
});
