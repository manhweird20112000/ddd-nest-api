import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { CrmAuthController } from './crm.controller';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { InvalidCredentialsException } from '@/shared/exceptions';

describe('CrmAuthController', () => {
  let controller: CrmAuthController;
  let loginUseCase: jest.Mocked<LoginUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrmAuthController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CrmAuthController>(CrmAuthController);
    loginUseCase = module.get(LoginUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    const loginDto = {
      email: 'admin@example.com',
      password: 'password123',
    };

    it('should return tokens when login is successful', async () => {
      const tokens = {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      };
      loginUseCase.execute.mockResolvedValue(tokens);

      const result = await controller.login(loginDto);

      expect(result).toEqual(tokens);
      expect(loginUseCase.execute).toHaveBeenCalledWith(loginDto);
    });

    it('should throw UnauthorizedException when login fails with InvalidCredentialsException', async () => {
      loginUseCase.execute.mockRejectedValue(new InvalidCredentialsException());

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should rethrow other errors', async () => {
      const error = new Error('Unexpected error');
      loginUseCase.execute.mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow(error);
    });
  });
});
