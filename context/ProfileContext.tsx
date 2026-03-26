import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export const DEFAULT_PROFILE_EMOJI = '👤';

export type UserProfile = {
  emoji: string;
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  notes?: string;
};

function isComplete(p: UserProfile | null): boolean {
  if (!p) return false;
  return Boolean(
    p.fullName?.trim() && p.email?.trim() && p.phone?.trim()
  );
}

type ProfileContextValue = {
  profile: UserProfile | null;
  hydrated: boolean;
  isComplete: boolean;
  saveProfile: (p: UserProfile) => Promise<void>;
  deleteProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const saveProfile = useCallback(async (p: UserProfile) => {
    const next: UserProfile = {
      emoji: p.emoji?.trim() || DEFAULT_PROFILE_EMOJI,
      fullName: p.fullName.trim(),
      email: p.email.trim(),
      phone: p.phone.trim(),
      organization: p.organization?.trim() || undefined,
      notes: p.notes?.trim() || undefined,
    };
    setProfile(next);
  }, []);

  const deleteProfile = useCallback(async () => {
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({
      profile,
      hydrated: true,
      isComplete: isComplete(profile),
      saveProfile,
      deleteProfile,
    }),
    [profile, saveProfile, deleteProfile]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
