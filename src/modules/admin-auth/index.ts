import { forwardRef, Module } from '@nestjs/common';
import { CrmAuthController } from './interface/controllers/crm.controller';
import { AdminModule } from '../admin';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { IJwtService } from './application/ports/jwt.port';
import { JwtAdapter } from './infrastructure/external/jwt.adapter';
import { JwtModule } from '@nestjs/jwt';
import { SecretModule } from '@/infra/secret';

@Module({
  imports: [forwardRef(() => AdminModule), JwtModule, SecretModule],
  controllers: [CrmAuthController],
  providers: [
    {
      provide: IJwtService,
      useClass: JwtAdapter,
    },
    LoginUseCase,
  ],
  exports: [IJwtService],
})
export class AdminAuthModule {}
