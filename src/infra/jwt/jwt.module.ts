import { Module } from '@nestjs/common';
import { IAdapterSecret } from '@/infra/secret/adapter';
import { SecretModule } from '@/infra/secret';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '@/infra/jwt/jwt.strategy';
import { JwtAuthService } from '@/infra/jwt/jwt.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      useFactory: ({ JWT_SECRET, TOKEN_EXPIRATION }: IAdapterSecret) => {
        return {
          secret: JWT_SECRET,
          signOptions: { expiresIn: TOKEN_EXPIRATION },
        };
      },
      imports: [SecretModule],
      inject: [IAdapterSecret],
    }),
  ],
  providers: [JwtStrategy, JwtService, JwtAuthService],
  exports: [JwtAuthService],
})
export class JwtAppModule {}
