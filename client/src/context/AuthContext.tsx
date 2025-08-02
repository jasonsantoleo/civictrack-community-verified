// src/contexts/AuthContext.ts

import { createContext } from 'react';
import type { Session, User, AuthError } from '@supabase/supabase-js';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<{ error: AuthError | null; }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);