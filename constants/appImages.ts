/**
 * Bundled JPEGs under assets/images/app — offline-safe, one unique asset per use.
 * Re-encoded without EXIF/camera metadata (run scripts/strip_app_images.py after replacing files).
 */
export const AppImages = {
  drawerHero: require('@/assets/images/app/drawer-hero.jpg'),
  homeHero: require('@/assets/images/app/home-hero.jpg'),
  onboarding1: require('@/assets/images/app/onboarding-1.jpg'),
  onboarding2: require('@/assets/images/app/onboarding-2.jpg'),
  onboarding3: require('@/assets/images/app/onboarding-3.jpg'),
  serviceGovernance: require('@/assets/images/app/service-governance.jpg'),
  serviceCompliance: require('@/assets/images/app/service-compliance.jpg'),
  serviceContracts: require('@/assets/images/app/service-contracts.jpg'),
  serviceRisk: require('@/assets/images/app/service-risk.jpg'),
  serviceRetainer: require('@/assets/images/app/service-retainer.jpg'),
  serviceWorkshop: require('@/assets/images/app/service-workshop.jpg'),
  blogLeadership: require('@/assets/images/app/blog-leadership.jpg'),
  blogDocumentation: require('@/assets/images/app/blog-documentation.jpg'),
  blogDisputes: require('@/assets/images/app/blog-disputes.jpg'),
  aboutTeam: require('@/assets/images/app/about-team.jpg'),
} as const;

export type AppImageKey = keyof typeof AppImages;

export const SERVICE_IMAGE_KEYS = [
  'serviceGovernance',
  'serviceCompliance',
  'serviceContracts',
  'serviceRisk',
  'serviceRetainer',
  'serviceWorkshop',
] as const;
export type ServiceImageKey = (typeof SERVICE_IMAGE_KEYS)[number];

export const BLOG_IMAGE_KEYS = ['blogLeadership', 'blogDocumentation', 'blogDisputes'] as const;
export type BlogImageKey = (typeof BLOG_IMAGE_KEYS)[number];

export function getAppImage(key: AppImageKey) {
  return AppImages[key];
}
