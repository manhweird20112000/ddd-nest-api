import { Test, TestingModule } from '@nestjs/testing';
import { RpcException } from '@nestjs/microservices';
import { UserAuthMsController } from './user-auth.ms.controller';
import { IJwtService } from '../../application/ports/jwt.port';
import { GetGoogleUrlUseCase } from '../../application/use-cases/get-google-url.use-case';
import { GoogleCallbackUseCase } from '../../application/use-cases/google-callback.use-case';

describe('UserAuthMsController', () => {
  let controller: UserAuthMsController;
  let getGoogleUrlUseCase: jest.Mocked<GetGoogleUrlUseCase>;
  let googleCallbackUseCase: jest.Mocked<GoogleCallbackUseCase>;
  let jwtService: jest.Mocked<IJwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAuthMsController],
      providers: [
        {
          provide: GetGoogleUrlUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: GoogleCallbackUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: IJwtService,
          useValue: {
            verifyAccessToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(UserAuthMsController);
    getGoogleUrlUseCase = module.get(GetGoogleUrlUseCase);
    googleCallbackUseCase = module.get(GoogleCallbackUseCase);
    jwtService = module.get(IJwtService);
  });

  describe('googleAuthRedirect', () => {
    it('should return google oauth url', () => {
      const expected = { url: 'https://accounts.google.com/o/oauth2/v2/auth' };
      getGoogleUrlUseCase.execute.mockReturnValue(expected);

      const actual = controller.googleAuthRedirect();

      expect(actual).toEqual(expected);
    });
  });

  describe('googleAuthCallback', () => {
    it('should return tokens when google callback succeeds', async () => {
      const tokens = {
        access_token: 'access',
        refresh_token: 'refresh',
      };
      googleCallbackUseCase.execute.mockResolvedValue(tokens);

      const actual = await controller.googleAuthCallback({ code: 'auth-code' });

      expect(actual).toEqual(tokens);
      expect(googleCallbackUseCase.execute).toHaveBeenCalledWith({
        code: 'auth-code',
      });
    });

    it('should throw RpcException when google callback fails', async () => {
      googleCallbackUseCase.execute.mockRejectedValue(new Error('failed'));

      await expect(
        controller.googleAuthCallback({ code: 'bad-code' }),
      ).rejects.toBeInstanceOf(RpcException);
    });
  });

  describe('validate', () => {
    it('should return payload when token is valid', async () => {
      const payload = { sub: '1', email: 'user@example.com' };
      jwtService.verifyAccessToken.mockResolvedValue(payload);

      const actual = await controller.validate({ token: 'valid' });

      expect(actual).toEqual(payload);
    });

    it('should throw RpcException when token is invalid', async () => {
      jwtService.verifyAccessToken.mockRejectedValue(new Error('jwt expired'));

      await expect(
        controller.validate({ token: 'invalid' }),
      ).rejects.toBeInstanceOf(RpcException);
    });
  });
});
