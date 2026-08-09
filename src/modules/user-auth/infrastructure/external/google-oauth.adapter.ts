import { Injectable, Logger } from '@nestjs/common';
import {
  GoogleOauthPort,
  GoogleProfile,
} from '../../application/ports/google-oauth.port';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';
const GOOGLE_SCOPES = 'openid email profile';

@Injectable()
export class GoogleOauthAdapter extends GoogleOauthPort {
  private readonly logger = new Logger(GoogleOauthAdapter.name);

  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? '',
      redirect_uri: process.env.GOOGLE_CALLBACK_URL ?? '',
      response_type: 'code',
      scope: GOOGLE_SCOPES,
      access_type: 'offline',
      prompt: 'consent',
    });
    return `${GOOGLE_AUTH_URL}?${params.toString()}`;
  }

  async exchangeCode(rawCode: string): Promise<GoogleProfile> {
    const code = this.normalizeCode(rawCode);
    const redirectUri = process.env.GOOGLE_CALLBACK_URL ?? '';
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID ?? '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    const tokenBody = (await tokenResponse.json()) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };
    if (!tokenResponse.ok || !tokenBody.access_token) {
      const detail = [
        tokenBody.error,
        tokenBody.error_description,
        `redirect_uri=${redirectUri}`,
      ]
        .filter(Boolean)
        .join(' | ');
      this.logger.error(`Google token exchange failed: ${detail}`);
      throw new Error(`Google token exchange failed: ${detail}`);
    }
    const userResponse = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokenBody.access_token}` },
    });
    const profile = (await userResponse.json()) as {
      id?: string;
      email?: string;
      error?: { message?: string };
    };
    if (!userResponse.ok || !profile.id || !profile.email) {
      const detail = profile.error?.message ?? 'userinfo incomplete';
      this.logger.error(`Google userinfo failed: ${detail}`);
      throw new Error(`Google userinfo failed: ${detail}`);
    }
    return { id: profile.id, email: profile.email };
  }

  private normalizeCode(rawCode: string): string {
    const trimmed = rawCode.trim();
    try {
      return decodeURIComponent(trimmed);
    } catch {
      return trimmed;
    }
  }
}
