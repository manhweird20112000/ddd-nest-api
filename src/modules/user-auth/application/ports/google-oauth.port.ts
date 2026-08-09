export interface GoogleProfile {
  readonly id: string;
  readonly email: string;
}

export abstract class GoogleOauthPort {
  abstract getAuthUrl(): string;

  abstract exchangeCode(code: string): Promise<GoogleProfile>;
}
