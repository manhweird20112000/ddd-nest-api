import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SecretModule } from '@/infra/secret';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { GetGoogleUrlUseCase } from './application/use-cases/get-google-url.use-case';
import { GoogleCallbackUseCase } from './application/use-cases/google-callback.use-case';
import { GoogleOauthPort } from './application/ports/google-oauth.port';
import { IJwtService } from './application/ports/jwt.port';
import { UserStorePort } from './application/ports/user-store.port';
import { GoogleOauthAdapter } from './infrastructure/external/google-oauth.adapter';
import { JwtAdapter } from './infrastructure/external/jwt.adapter';
import { InMemoryUserStore } from './infrastructure/persistence/in-memory-user.store';
import { UserAuthMsController } from './interface/controllers/user-auth.ms.controller';

@Module({
  imports: [JwtModule, SecretModule],
  controllers: [UserAuthMsController],
  providers: [
    LoginUseCase,
    GetGoogleUrlUseCase,
    GoogleCallbackUseCase,
    {
      provide: GoogleOauthPort,
      useClass: GoogleOauthAdapter,
    },
    {
      provide: IJwtService,
      useClass: JwtAdapter,
    },
    {
      provide: UserStorePort,
      useClass: InMemoryUserStore,
    },
  ],
  exports: [IJwtService],
})
export class UserAuthModule {}
