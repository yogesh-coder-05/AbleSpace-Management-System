'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types/task';
import { guestLoginApi, guestLogoutApi, fetchUserProfileApi } from '../lib/api';

interface GuestContextType {
  guestUserId: string | null;
  user: UserProfile | null;
  isLoading: boolean;
  loginAsGuest: (name?: string) => Promise<void>;
  logoutGuest: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const GuestContext = createContext<GuestContextType>({
  guestUserId: null,
  user: null,
  isLoading: true,
  loginAsGuest: async () => {},
  logoutGuest: async () => {},
  setUser: () => {},
});

export const GuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [guestUserId, setGuestUserId] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedId = localStorage.getItem('guestUserId');
    if (savedId) {
      setGuestUserId(savedId);
      fetchUserProfileApi(savedId)
        .then((profile) => setUser(profile))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const loginAsGuest = async (name?: string) => {
    setIsLoading(true);
    try {
      const data = await guestLoginApi(name);
      setGuestUserId(data.guestUserId);
      setUser(data.user);
      localStorage.setItem('guestUserId', data.guestUserId);
    } catch (err) {
      console.error('Guest login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logoutGuest = async () => {
    try {
      if (guestUserId) {
        await guestLogoutApi(guestUserId);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setGuestUserId(null);
      setUser(null);
      localStorage.removeItem('guestUserId');
    }
  };

  return (
    <GuestContext.Provider
      value={{ guestUserId, user, isLoading, loginAsGuest, logoutGuest, setUser }}
    >
      {children}
    </GuestContext.Provider>
  );
};

export const useGuest = () => useContext(GuestContext);
