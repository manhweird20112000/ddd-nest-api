import { AdminQueryPort } from '@/modules/admin/application/ports/admin-query.port';
import { BaseUseCase } from '@/shared/common/base-use-case';
import { LoginDto } from '../dtos/login.dto';
import { IJwtService } from '../ports/jwt.port';
import { InvalidCredentialsException } from '@/shared/exceptions';

type Input = LoginDto;
interface Output {
  access_token: string;
  refresh_token: string;
}
export class LoginUseCase implements BaseUseCase<Input, Output> {
  constructor(
    private readonly adminQueryService: AdminQueryPort,
    private readonly jwtService: IJwtService,
  ) {}

  async execute(input: Input): Promise<Output> {
    const admin = await this.adminQueryService.findByEmail(input.email);

    if (!admin) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await admin.verifyPassword(input.password);

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    const payload = {
      sub: admin.id.toString(),
      email: admin.email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAccessToken(payload),
      this.jwtService.signRefreshToken(payload),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
