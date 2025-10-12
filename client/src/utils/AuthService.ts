import supabase from "@/utils/supabaseClient";

class AuthService {
  private static instance: AuthService;
  private accessToken: string | null = null;
  private expiresAt: number | null = null; // in ms
  private bufferMs = 30 * 1000; // refresh 30s before expiry

  private constructor() {
    // Initialize token
    this.updateSession();

    // Listen for auth state changes
    supabase.auth.onAuthStateChange((_event, session) => {
      this.accessToken = session?.access_token ?? null;
      this.expiresAt = session?.expires_at ? session.expires_at * 1000 : null; // Supabase gives seconds
    });
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Update token & expiry from Supabase session
  private async updateSession() {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    this.accessToken = session?.access_token ?? null;
    this.expiresAt = session?.expires_at ? session.expires_at * 1000 : null;
  }

  // Returns a valid access token
  public async getAccessToken(): Promise<string | null> {
    const now = Date.now();

    // If token is missing or about to expire, refresh it
    if (
      !this.accessToken ||
      !this.expiresAt ||
      now + this.bufferMs >= this.expiresAt
    ) {
      await this.refreshToken();
    }

    return this.accessToken;
  }

  // Refresh token using Supabase refresh mechanism
  private async refreshToken() {
    // Supabase automatically refreshes when you call getSession()
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Failed to refresh token:", error.message);
      this.accessToken = null;
      this.expiresAt = null;
      return null;
    }

    const session = data.session;
    this.accessToken = session?.access_token ?? null;
    this.expiresAt = session?.expires_at ? session.expires_at * 1000 : null;

    return this.accessToken;
  }
}

export const authService = AuthService.getInstance();