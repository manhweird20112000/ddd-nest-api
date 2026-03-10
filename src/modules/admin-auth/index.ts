import { forwardRef, Module } from '@nestjs/common';
import { CrmAuthController } from './interface/controllers/crm.controller';
import { AdminModule } from '../admin';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { AdminQueryPort } from '../admin/application/ports/admin-query.port';
import { IJwtService } from './application/ports/jwt.port';
import { JwtAdapter } from './infra/auth/jwt.adapter';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SecretModule } from '@/infra/secret';
import { IAdapterSecret } from '@/infra/secret/adapter';

@Module({
  imports: [forwardRef(() => AdminModule), JwtModule, SecretModule],
  controllers: [CrmAuthController],
  providers: [
    {
      provide: IJwtService,
      inject: [JwtService, IAdapterSecret],
      useFactory(jwtService: JwtService, secretService: IAdapterSecret) {
        return new JwtAdapter(jwtService, secretService);
      },
    },
    {
      provide: LoginUseCase,
      inject: [AdminQueryPort, IJwtService],
      useFactory(adminQueryService: AdminQueryPort, jwtService: IJwtService) {
        return new LoginUseCase(adminQueryService, jwtService);
      },
    },
  ],
})
export class AdminAuthModule {}
