import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy';
import { RolesGuard } from './guard';

@Module({
    imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
    providers: [JwtStrategy, RolesGuard],
    exports: [PassportModule, RolesGuard],
})
export class AuthModule {}
