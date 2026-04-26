import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { JwtAdapter } from './jwt.adapter';
import { IAdapterSecret } from '@/infra/secret/adapter';

describe('JwtAdapter', () => {
  let adapter: JwtAdapter;
  let jwtService: jest.Mocked<JwtService>;
  let secretService: jest.Mocked<IAdapterSecret>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAdapter,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: IAdapterSecret,
          useValue: {
            JWT_SECRET: 'test_secret',
            TOKEN_EXPIRATION: '1h',
          },
        },
      ],
    }).compile();

    adapter = module.get<JwtAdapter>(JwtAdapter);
    jwtService = module.get(JwtService);
    secretService = module.get(IAdapterSecret);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  const payload = { sub: '1', email: 'test@example.com' };

  describe('signAccessToken', () => {
    it('should sign access token with correct options', async () => {
      jwtService.sign.mockReturnValue('access_token');

      const result = await adapter.signAccessToken(payload);

      expect(result).toBe('access_token');
      expect(jwtService.sign).toHaveBeenCalledWith(payload, {
        secret: secretService.JWT_SECRET,
        expiresIn: secretService.TOKEN_EXPIRATION,
      });
    });
  });

  describe('signRefreshToken', () => {
    it('should sign refresh token with correct options', async () => {
      jwtService.sign.mockReturnValue('refresh_token');

      const result = await adapter.signRefreshToken(payload);

      expect(result).toBe('refresh_token');
      expect(jwtService.sign).toHaveBeenCalledWith(payload, {
        secret: secretService.JWT_SECRET,
        expiresIn: secretService.TOKEN_EXPIRATION,
      });
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify access token', async () => {
      jwtService.verify.mockReturnValue(payload);

      const result = await adapter.verifyAccessToken('token');

      expect(result).toEqual(payload);
      expect(jwtService.verify).toHaveBeenCalledWith('token', {
        secret: secretService.JWT_SECRET,
      });
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify refresh token', async () => {
      jwtService.verify.mockReturnValue(payload);

      const result = await adapter.verifyRefreshToken('token');

      expect(result).toEqual(payload);
      expect(jwtService.verify).toHaveBeenCalledWith('token', {
        secret: secretService.JWT_SECRET,
      });
    });
  });
});
