interface JwtPayload {
  sub: string;
  email: string;
}

export abstract class IJwtService {
  abstract signAccessToken(payload: JwtPayload): Promise<string>;

  abstract signRefreshToken(payload: JwtPayload): Promise<string>;

  abstract verifyAccessToken(token: string): Promise<JwtPayload>;

  abstract verifyRefreshToken(token: string): Promise<JwtPayload>;
}
