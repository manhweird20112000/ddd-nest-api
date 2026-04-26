import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { IJwtService } from '../../application/ports/jwt.port';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: jest.Mocked<IJwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: IJwtService,
          useValue: {
            verifyAccessToken: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get(IJwtService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let context: ExecutionContext;
    let request: any;

    beforeEach(() => {
      request = {
        headers: {},
      };
      context = {
        switchToHttp: () => ({
          getRequest: () => request,
        }),
      } as unknown as ExecutionContext;
    });

    it('should return true when token is valid', async () => {
      request.headers.authorization = 'Bearer valid_token';
      const payload = { sub: '1', email: 'test@example.com' };
      jwtService.verifyAccessToken.mockResolvedValue(payload);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(request.user).toEqual(payload);
      expect(jwtService.verifyAccessToken).toHaveBeenCalledWith('valid_token');
    });

    it('should throw UnauthorizedException when authorization header is missing', async () => {
      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      request.headers.authorization = 'Bearer invalid_token';
      jwtService.verifyAccessToken.mockRejectedValue(new Error('Invalid token'));

      await expect(guard.canActivate(context)).rejects.toThrow();
    });
  });
});
