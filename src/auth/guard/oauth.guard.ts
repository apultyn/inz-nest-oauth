import { AuthGuard } from '@nestjs/passport';

export class OauthGuard extends AuthGuard('oauth') {
    constructor() {
        super();
    }
}
