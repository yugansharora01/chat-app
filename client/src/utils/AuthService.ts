import { create_conversation } from "@/API/apiservice";
import { supabase } from "@/utils/supabaseClient";

class AuthService {
  private static instance: AuthService;
  private accessToken: string | null = null;
  private user: any = null;
  private expiresAt: number | null = null;
  private listeners: ((user: any) => void)[] = [];

  private bufferMs = 30 * 1000;
  // track whether initial session check finished
  private initialized = false;

  private constructor() {
    this.init();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async init() {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    this.updateSession(session);

    // mark ready and ensure listeners receive the initial session
    this.initialized = true;
    this.notifyListeners();

    supabase.auth.onAuthStateChange(async (event, session) => {
      this.updateSession(session);
      if (event === "SIGNED_IN" && session) {
        await this.afterSignIn(); // ✅ trigger for OAuth or magic link sign-ins
      }
    });
  }

  private updateSession(session: any) {
    this.accessToken = session?.access_token ?? null;
    this.user = session?.user ?? null;
    this.expiresAt = session?.expires_at ? session.expires_at * 1000 : null;
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach((cb) => cb(this.user));
  }

  public subscribe(callback: (user: any) => void) {
    this.listeners.push(callback);
    // only sync immediately if initial session check completed
    if (this.initialized) {
      callback(this.user);
    }
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  public async getAccessToken(): Promise<string | null> {
    const now = Date.now();
    if (
      !this.accessToken ||
      !this.expiresAt ||
      now + this.bufferMs >= this.expiresAt
    ) {
      await this.refreshToken();
    }
    return this.accessToken;
  }

  private async refreshToken() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Token refresh failed:", error.message);
      this.accessToken = null;
      this.user = null;
      return null;
    }
    this.updateSession(data.session);
    return this.accessToken;
  }

  public async signUp(email: string, password: string) {
    const redirectUrl = window.location.origin;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl },
    });
    if (error) throw error;
  }

  private async afterSignIn() {
    try {
      // Token is already available via getAccessToken()
      await create_conversation("Welcome Chat", true);
    } catch (err) {
      console.error("Failed to create welcome chat:", err);
    }
  }

  public async signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }

  public async signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  }

  public async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  public getUser() {
    return this.user;
  }
}

export const authService = AuthService.getInstance();
