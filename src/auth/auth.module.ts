import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { OauthStrategy } from './strategy';
import { RolesGuard } from './guard';

@Module({
    imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
    providers: [OauthStrategy, RolesGuard],
    exports: [PassportModule, RolesGuard],
})
export class AuthModule {}
