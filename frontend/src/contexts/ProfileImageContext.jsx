'use client';

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getProfileImageUrl } from '@/lib/profileImageUrl';

const STORAGE_KEY = 'verifyup_profile_image';

function loadFromStorage() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data && typeof data.profileImage === 'string') return data;
    return null;
  } catch {
    return null;
  }
}

function saveToStorage(profileImage, profileImageToken) {
  if (typeof window === 'undefined') return;
  try {
    if (profileImage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ profileImage, profileImageToken: profileImageToken ?? null }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

const ProfileImageContext = createContext(null);

export function ProfileImageProvider({ children }) {
  const { user, updateUserProfileImage } = useAuth();
  const [profileImage, setProfileImageState] = useState(null);
  const [profileImageToken, setProfileImageTokenState] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [urlVersion, setUrlVersion] = useState(0);

  useEffect(() => {
    const cached = loadFromStorage();
    if (cached) {
      setProfileImageState(cached.profileImage);
      setProfileImageTokenState(cached.profileImageToken ?? null);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (user === null) {
      setProfileImageState(null);
      setProfileImageTokenState(null);
      saveToStorage(null, null);
      return;
    }
    if (user?.profileImage) {
      setProfileImageState(user.profileImage);
      const token = user.profileImageToken ?? null;
      setProfileImageTokenState(token);
      saveToStorage(user.profileImage, token);
    }
  }, [hydrated, user?.profileImage, user?.profileImageToken, user]);

  const setProfileImage = useCallback(
    (path, token) => {
      const nextPath = path ?? null;
      const nextToken = token !== undefined ? token : null;
      setProfileImageState(nextPath);
      setProfileImageTokenState(nextToken);
      saveToStorage(nextPath, nextToken);
      if (nextPath) {
        updateUserProfileImage(nextPath, nextToken);
        setUrlVersion((v) => v + 1);
      }
    },
    [updateUserProfileImage]
  );

  const displayUrl = useMemo(() => {
    const base = getProfileImageUrl(profileImage, profileImageToken);
    if (!base) return null;
    const sep = base.includes('?') ? '&' : '?';
    return `${base}${sep}_v=${urlVersion}`;
  }, [profileImage, profileImageToken, urlVersion]);

  const value = useMemo(
    () => ({
      profileImage,
      profileImageToken,
      displayUrl,
      setProfileImage,
    }),
    [profileImage, profileImageToken, displayUrl, setProfileImage]
  );

  return (
    <ProfileImageContext.Provider value={value}>
      {children}
    </ProfileImageContext.Provider>
  );
}

export function useProfileImage() {
  const context = useContext(ProfileImageContext);
  if (!context) {
    throw new Error('useProfileImage must be used within ProfileImageProvider');
  }
  return context;
}
