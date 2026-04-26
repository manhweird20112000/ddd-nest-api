import { Test, TestingModule } from '@nestjs/testing';
import { LoginUseCase } from './login.use-case';
import { AdminQueryPort } from '@/modules/admin/application/ports/admin-query.port';
import { IJwtService } from '../ports/jwt.port';
import { InvalidCredentialsException } from '@/shared/exceptions';
import { Admin } from '@/modules/admin/domain';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let adminQueryService: jest.Mocked<AdminQueryPort>;
  let jwtService: jest.Mocked<IJwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: AdminQueryPort,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: IJwtService,
          useValue: {
            signAccessToken: jest.fn(),
            signRefreshToken: jest.fn(),
            verifyAccessToken: jest.fn(),
            verifyRefreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<LoginUseCase>(LoginUseCase);
    adminQueryService = module.get(AdminQueryPort);
    jwtService = module.get(IJwtService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const loginDto = {
      email: 'admin@example.com',
      password: 'password123',
    };

    it('should return tokens when credentials are valid', async () => {
      const mockAdmin = {
        id: 1,
        email: 'admin@example.com',
        verifyPassword: jest.fn().mockResolvedValue(true),
      } as unknown as Admin;

      adminQueryService.findByEmail.mockResolvedValue(mockAdmin);
      jwtService.signAccessToken.mockResolvedValue('access_token');
      jwtService.signRefreshToken.mockResolvedValue('refresh_token');

      const result = await useCase.execute(loginDto);

      expect(result).toEqual({
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      });
      expect(adminQueryService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockAdmin.verifyPassword).toHaveBeenCalledWith(loginDto.password);
    });

    it('should throw InvalidCredentialsException when admin is not found', async () => {
      adminQueryService.findByEmail.mockResolvedValue(null);

      await expect(useCase.execute(loginDto)).rejects.toThrow(
        InvalidCredentialsException,
      );
    });

    it('should throw InvalidCredentialsException when password is invalid', async () => {
      const mockAdmin = {
        id: 1,
        email: 'admin@example.com',
        verifyPassword: jest.fn().mockResolvedValue(false),
      } as unknown as Admin;

      adminQueryService.findByEmail.mockResolvedValue(mockAdmin);

      await expect(useCase.execute(loginDto)).rejects.toThrow(
        InvalidCredentialsException,
      );
    });
  });
});
