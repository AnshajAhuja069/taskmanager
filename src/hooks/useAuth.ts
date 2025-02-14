import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

export function useAuth() {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    // Check for redirect result on component mount
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        setUser(result.user);
        toast.success('Successfully signed in!');
      }
    }).catch((error) => {
      console.error('Redirect sign-in error:', error);
      toast.error('Failed to sign in. Please try again.');
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      // First try popup
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      toast.success('Successfully signed in!');
    } catch (error: any) {
      if (error?.code === 'auth/popup-blocked') {
        // If popup is blocked, fall back to redirect
        toast.loading('Redirecting to Google sign-in...');
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError) {
          console.error('Redirect sign-in error:', redirectError);
          toast.error('Failed to sign in. Please try again.');
        }
      } else {
        console.error('Error signing in with Google:', error);
        toast.error('Failed to sign in. Please try again.');
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success('Successfully signed out!');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  return {
    user,
    signInWithGoogle,
    logout
  };
}