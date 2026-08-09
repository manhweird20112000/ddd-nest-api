import { CreateUserFromEventUseCase } from './create-user-from-event.use-case';
import { User, UserRepository } from '@/modules/user/domain';

describe('CreateUserFromEventUseCase', () => {
  const mockRepository: jest.Mocked<UserRepository> = {
    save: jest.fn(),
    findById: jest.fn(),
    findByAuthUserId: jest.fn(),
  };
  const useCase = new CreateUserFromEventUseCase(mockRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns existing user when authUserId already exists', async () => {
    const existing = new User('id-1', 'auth-1', 'a@test.com', 'A', null);
    mockRepository.findByAuthUserId.mockResolvedValue(existing);
    const actual = await useCase.execute({
      authUserId: 'auth-1',
      email: 'a@test.com',
    });
    expect(actual).toBe(existing);
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it('creates user when authUserId is new', async () => {
    mockRepository.findByAuthUserId.mockResolvedValue(null);
    mockRepository.save.mockImplementation(async (user) => user);
    const actual = await useCase.execute({
      authUserId: 'auth-2',
      email: 'B@Test.com',
      displayName: 'Bob',
    });
    expect(actual.authUserId).toBe('auth-2');
    expect(actual.email).toBe('b@test.com');
    expect(actual.displayName).toBe('Bob');
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });
});
