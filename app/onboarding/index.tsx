import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { AppImageKey } from '@/constants/appImages';
import { getAppImage } from '@/constants/appImages';
import { COMPANY } from '@/constants/company';
import { Colors, Fonts, Palette, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';

type OnboardingImageKey = Extract<AppImageKey, 'onboarding1' | 'onboarding2' | 'onboarding3'>;

type Slide = {
  key: string;
  title: string;
  body: string;
  imageKey: OnboardingImageKey;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  accentSoft: string;
};

const SLIDES: Slide[] = [
  {
    key: '1',
    title: 'Counsel with clarity',
    body: 'Navigate governance, contracts, and risk with guidance that respects your pace and priorities.',
    imageKey: 'onboarding1',
    icon: 'sparkles',
    accent: Palette.sapphire,
    accentSoft: Palette.sapphireSoft,
  },
  {
    key: '2',
    title: 'Order services with confidence',
    body: 'Build your professional request in the app—no pricing noise, just what you need from our catalogue.',
    imageKey: 'onboarding2',
    icon: 'briefcase-outline',
    accent: Palette.teal,
    accentSoft: 'rgba(31,138,112,0.18)',
  },
  {
    key: '3',
    title: 'Your summary, beautifully documented',
    body: 'Confirm an order to receive a polished PDF for your records—then reach us easily on the contact page.',
    imageKey: 'onboarding3',
    icon: 'document-text-outline',
    accent: Palette.rose,
    accentSoft: 'rgba(217,108,139,0.2)',
  },
];

export default function OnboardingScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const insets = useSafeAreaInsets();
  const { width: slideWidth, height: windowHeight } = useWindowDimensions();
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const cardHeight = useMemo(() => {
    const reservedTop = insets.top + 56;
    const reservedBottom = insets.bottom + Spacing.md + 140;
    return Math.min(420, Math.max(240, windowHeight - reservedTop - reservedBottom));
  }, [insets.bottom, insets.top, windowHeight]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollX.value = e.nativeEvent.contentOffset.x;
  };

  const finish = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    router.replace('/(drawer)/(tabs)');
  };

  const next = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      finish();
    }
  };

  const skip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    finish();
  };

  return (
    <View style={styles.root}>
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Text style={[styles.brand, { color: c.text, fontFamily: Fonts.displayBold }]}>
          {COMPANY.appName}
        </Text>
        <Pressable onPress={skip} hitSlop={12}>
          <Text style={[styles.skip, { color: c.tint }]}>Skip</Text>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        style={styles.list}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / slideWidth);
          setIndex(Math.min(Math.max(i, 0), SLIDES.length - 1));
        }}
        onScrollToIndexFailed={({ index: i }) => {
          setTimeout(() => listRef.current?.scrollToIndex({ index: i, animated: true }), 100);
        }}
        getItemLayout={(_, i) => ({ length: slideWidth, offset: slideWidth * i, index: i })}
        renderItem={({ item, index: i }) => (
          <View style={{ width: slideWidth }}>
            <SlideCard
              slide={item}
              index={i}
              scrollX={scrollX}
              slideWidth={slideWidth}
              cardHeight={cardHeight}
            />
          </View>
        )}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <Dot key={i} index={i} scrollX={scrollX} slideWidth={slideWidth} />
          ))}
        </View>
        <Pressable
          onPress={next}
          style={({ pressed }) => [
            styles.cta,
            { opacity: pressed ? 0.92 : 1 },
          ]}>
          <LinearGradient
            colors={[Palette.navy, Palette.navySoft]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGrad}>
            <Text style={styles.ctaText}>{index === SLIDES.length - 1 ? 'Enter app' : 'Continue'}</Text>
            <Ionicons name="arrow-forward" size={20} color={Palette.cream} />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

function Dot({
  index,
  scrollX,
  slideWidth,
}: {
  index: number;
  scrollX: SharedValue<number>;
  slideWidth: number;
}) {
  const style = useAnimatedStyle(() => {
    const sw = slideWidth;
    const w = interpolate(
      scrollX.value,
      [(index - 1) * sw, index * sw, (index + 1) * sw],
      [6, 28, 6],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      [(index - 1) * sw, index * sw, (index + 1) * sw],
      [0.35, 1, 0.35],
      Extrapolation.CLAMP
    );
    return { width: w, opacity };
  }, [slideWidth, index]);

  return (
    <Animated.View
      style={[
        styles.dot,
        style,
        { backgroundColor: Palette.brass },
      ]}
    />
  );
}

function SlideCard({
  slide,
  index,
  scrollX,
  slideWidth,
  cardHeight,
}: {
  slide: Slide;
  index: number;
  scrollX: SharedValue<number>;
  slideWidth: number;
  cardHeight: number;
}) {
  const cardStyle = useAnimatedStyle(() => {
    const sw = slideWidth;
    const scale = interpolate(
      scrollX.value,
      [(index - 1) * sw, index * sw, (index + 1) * sw],
      [0.95, 1, 0.95],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollX.value,
      [(index - 1) * sw, index * sw, (index + 1) * sw],
      [20, 0, 20],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ scale }, { translateY }],
    };
  }, [slideWidth, index]);

  const iconStyle = useAnimatedStyle(() => {
    const sw = slideWidth;
    const rotate = interpolate(
      scrollX.value,
      [(index - 1) * sw, index * sw, (index + 1) * sw],
      [-8, 0, 8],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollX.value,
      [(index - 1) * sw, index * sw, (index + 1) * sw],
      [0.85, 1, 0.85],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ rotate: `${rotate}deg` }, { scale }],
    };
  }, [slideWidth, index]);

  return (
    <Animated.View style={[styles.imageCard, { height: cardHeight }, cardStyle]}>
      <Image source={getAppImage(slide.imageKey)} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient colors={['rgba(10,22,40,0.12)', 'rgba(10,22,40,0.93)']} style={StyleSheet.absoluteFill} />
      <View style={[styles.slideOrb, { backgroundColor: slide.accentSoft }]} />
      <Animated.View style={[styles.iconWrap, { backgroundColor: slide.accent }, iconStyle]}>
        <Ionicons name={slide.icon} size={26} color={Palette.cream} />
      </Animated.View>
      <View style={styles.imageInner}>
        <Text style={styles.slideTitle}>{slide.title}</Text>
        <Text style={styles.slideBody}>{slide.body}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  list: {
    flex: 1,
    minHeight: 0,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  brand: {
    fontSize: 22,
    letterSpacing: -0.5,
  },
  skip: {
    fontSize: 16,
    fontWeight: '600',
  },
  imageCard: {
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  slideOrb: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 999,
    right: -40,
    top: -60,
    opacity: 0.65,
  },
  iconWrap: {
    position: 'absolute',
    left: Spacing.lg,
    top: Spacing.lg,
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageInner: {
    padding: Spacing.lg,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Palette.cream,
    fontFamily: 'CormorantGaramond_700Bold',
    marginBottom: Spacing.sm,
  },
  slideBody: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(247,244,236,0.9)',
    fontFamily: 'DMSans_400Regular',
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  cta: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  ctaGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: Radius.lg,
  },
  ctaText: {
    color: Palette.cream,
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'DMSans_700Bold',
  },
});
