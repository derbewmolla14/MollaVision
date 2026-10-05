import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth as useClerkAuth, useClerk, useUser } from '@clerk/react';
import { authAPI, setAuthTokenProvider } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { isLoaded, user: clerkUser } = useUser();
  const { getToken } = useClerkAuth();
  const { signOut } = useClerk();
  const clerkMappedUser = useMemo(() => {
    if (!clerkUser) return null;
    return {
      id: clerkUser.id,
      name: clerkUser.fullName || clerkUser.firstName || 'Learner',
      email: clerkUser.primaryEmailAddress?.emailAddress || '',
      role: clerkUser.publicMetadata?.role === 'admin' ? 'admin' : 'student',
      isPremium: clerkUser.publicMetadata?.isPremium === true,
    };
  }, [clerkUser]);
  const [backendUser, setBackendUser] = useState(null);

  useEffect(() => {
    setAuthTokenProvider(getToken);
    return () => setAuthTokenProvider(null);
  }, [getToken]);

  useEffect(() => {
    if (!isLoaded || !clerkUser) {
      setBackendUser(null);
      return;
    }
    authAPI.getMe().then(({ data }) => setBackendUser(data.user)).catch(() => setBackendUser(null));
  }, [clerkUser, isLoaded]);

  const user = backendUser || clerkMappedUser;

  const logout = async () => {
    await signOut({ redirectUrl: '/' });
  };

  const refreshUser = async () => user;

  const value = useMemo(
    () => ({ user, loading: !isLoaded, isAuthenticated: Boolean(clerkUser), logout, refreshUser }),
    [user, isLoaded, clerkUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};