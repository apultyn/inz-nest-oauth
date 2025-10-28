import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { use } from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

interface KeycloakPayload {
    sub: string;
    email: string;
    realm_access: {
        roles: string[];
    };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        config: ConfigService,
        private prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: config.get('KEYCLOAK_JWKS_URI') || 'localhost:8443',
            }),
            issuer: config.get('KEYCLOAK_ISSUER_URL'), 
            algorithms: ['RS256'],
        });
    }

    async validate(payload: KeycloakPayload): Promise<any> {
        if (!payload) {
            throw new UnauthorizedException('Invalid token payload');
        }

        let user = await this.prisma.user.findUnique({
            where: { keycloak_id: payload.sub },
        });

        if (!user) {
            try {
                user = await this.prisma.user.create({
                    data: { keycloak_id: payload.sub, email: payload.email },
                });
            } catch (error) {
                throw new InternalServerErrorException('Could not sync user');
            }
        }

        return { ...user, roles: payload.realm_access.roles || [] };
    }
}
