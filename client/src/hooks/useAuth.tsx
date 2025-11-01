import { useEffect, useState } from "react";
import { authService } from "@/utils/AuthService";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [user, setUser] = useState<any>(authService.getUser());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = authService.subscribe((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string) => {
    await authService.signUp(email, password);
    console.log("Sign-up successful, redirecting to home...");
    navigate("/");
  };

  const signIn = async (email: string, password: string) => {
    await authService.signIn(email, password);
    console.log("Sign-in successful, redirecting to home...");
    navigate("/");
  };

  const signInWithGoogle = async () => {
    await authService.signInWithGoogle();
  };

  const signOut = async () => {
    await authService.signOut();
    navigate("/auth");
  };

  return { user, loading, signUp, signIn, signInWithGoogle, signOut };
};
